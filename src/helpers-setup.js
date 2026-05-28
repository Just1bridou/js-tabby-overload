import Handlebars from 'handlebars';
import { DateTime } from 'luxon';

// Import only browser-compatible helper groups (skip fs, code, logging, markdown)
import arrayHelpers from 'handlebars-helpers/lib/array';
import collectionHelpers from 'handlebars-helpers/lib/collection';
import comparisonHelpers from 'handlebars-helpers/lib/comparison';
import htmlHelpers from 'handlebars-helpers/lib/html';
import i18nHelpers from 'handlebars-helpers/lib/i18n';
import inflectionHelpers from 'handlebars-helpers/lib/inflection';
import matchHelpers from 'handlebars-helpers/lib/match';
import mathHelpers from 'handlebars-helpers/lib/math';
import miscHelpers from 'handlebars-helpers/lib/misc';
import numberHelpers from 'handlebars-helpers/lib/number';
import objectHelpers from 'handlebars-helpers/lib/object';
import pathHelpers from 'handlebars-helpers/lib/path';
import regexHelpers from 'handlebars-helpers/lib/regex';
import stringHelpers from 'handlebars-helpers/lib/string';
import urlHelpers from 'handlebars-helpers/lib/url';

[
  arrayHelpers, collectionHelpers, comparisonHelpers,
  htmlHelpers, i18nHelpers, inflectionHelpers, matchHelpers,
  mathHelpers, miscHelpers, numberHelpers, objectHelpers,
  pathHelpers, regexHelpers, stringHelpers, urlHelpers
].forEach(group => Handlebars.registerHelper(group));

// UUID utility used by uuidIfMissing helper
const generateUUID = () => crypto.randomUUID();

// Custom helpers
Handlebars.registerHelper("matchElementInArray", function (array, field, path, value) {
  try {
    const element = array.find(element => lod_.get(element, path) === value);
    if (!lod_.isNil(element)) {
      return lod_.get(element, field);
    }
    return "";
  } catch (e) {
    return "";
  }
});

Handlebars.registerHelper("ifeq", function (a, b, options) {
  if (a == b) return options.fn(this);
  return options.inverse(this);
});

Handlebars.registerHelper("ifnoteq", function (a, b, options) {
  if (a != b) return options.fn(this);
  return options.inverse(this);
});

Handlebars.registerHelper("uppercase", function (text) {
  return text ? text.toUpperCase() : text;
});

Handlebars.registerHelper("json", function (text) {
  if (text === undefined) return `null`;
  return JSON.stringify(text);
});

Handlebars.registerHelper("jsonString", function (text) {
  try {
    if (lod_.isNil(text)) return "";
    if (lod_.isString(text)) return JSON.stringify(text).slice(1, -1);
    return JSON.stringify(text);
  } catch (e) {
    return "";
  }
});

Handlebars.registerHelper("removeSpaces", function (text) {
  return text ? text.replace(/\s/g, "") : text;
});

Handlebars.registerHelper("newlineAsSpace", function (text) {
  if (typeof text !== "string") return text;
  return text.replace(/\n/g, " ");
});

Handlebars.registerHelper("convertToString", function (text) {
  try {
    if (lod_.isNil(text)) return "";
    return String(text);
  } catch (e) {
    return "";
  }
});

Handlebars.registerHelper("toNumber", function (value) {
  return typeof value === "string" && !isNaN(value) ? Number(value) : value;
});

Handlebars.registerHelper("formatDate", function (date, format, timezone, locale) {
  if (lod_.isNil(date) || lod_.isNil(format)) return "";
  let dt;
  if (date instanceof Date) {
    dt = DateTime.fromJSDate(date);
  } else {
    dt = DateTime.fromISO(date);
  }
  if (timezone && typeof timezone === "string") dt = dt.setZone(timezone);
  if (locale && typeof locale === "string") dt = dt.setLocale(locale);
  const formattedDate = dt.toFormat(format);
  if (formattedDate === "Invalid DateTime") return undefined;
  return formattedDate;
});

Handlebars.registerHelper("luxon", expression => {
  try {
    const now = DateTime.now();
    const result = Function("now", `return ${expression}`)(now);
    return result.toUTC().toISO();
  } catch (err) {
    console.error(`Error evaluating expression "${expression}":`, err.message);
    return null;
  }
});

Handlebars.registerHelper("getKey", function (object, key) {
  return object[key];
});

Handlebars.registerHelper("uuidIfMissing", function (value) {
  return value ? value : generateUUID();
});

Handlebars.registerHelper("toArrayString", function (...args) {
  args.pop();
  return JSON.stringify(
    args.filter(v => v != null && v !== "").map(String)
  );
});

Handlebars.registerHelper("getArrayItemOrEmpty", function (arr, index) {
  if (!Array.isArray(arr) || !arr[index]) return "";
  return arr[index];
});

Handlebars.registerHelper("applyGeneralRulesEAU", function (text) {
  if (!text || typeof text !== "string") return "";
  text = text
    .toUpperCase()
    .normalize("NFD")
    .replaceAll("-", " ")
    .replace(/[̀-ͯ]/g, "")
    .replace(/'/g, " ")
    .replace(/[&/,%\-!@#$%^&*()+={}[\]:";'<>?\\|`~]/g, "")
    .replace(/\s+/g, " ")
    .replace("Œ", "OE")
    .trim();
  return JSON.stringify(text);
});

Handlebars.registerHelper("transformCommuneEAU", function (input) {
  if (!input || typeof input !== "string") return "";
  let result = input.toUpperCase();
  result = result.replace(/^(.+?)\s*\((LA|LE|LES)\)$/, "$2 $1");
  result = result
    .toUpperCase()
    .normalize("NFD")
    .replaceAll("-", " ")
    .replace(/[̀-ͯ]/g, "")
    .replace(/'/g, " ")
    .replace(/[&/,%\-!@#$%^&*()+={}[\]:";'<>?\\|`~]/g, "")
    .replace(/\s+/g, " ")
    .replace("Œ", "OE")
    .trim();
  result = result.replace(/-/g, " ");
  result = result.replace(/^ST\s+/g, "SAINT ");
  result = result.replace(/\sST\s/g, " SAINT ");
  result = result.replace(/\s+/g, " ").trim();
  result = result.replace(/(\d+)(?:ER|E|EME)\s+ARRONDISSEMENT/g, "").trim();
  result = result.replaceAll("CEDEX", "").trim();
  return JSON.stringify(result);
});

Handlebars.registerHelper("nowFormatDate", function (target = "fr", format = "dd/MM/yyyy HH:mm") {
  const now = DateTime.now();
  return now.setLocale(target).toFormat(format);
});

Handlebars.registerHelper("substring", function (text, start, end) {
  try {
    if (typeof text !== "string") return "";
    start = typeof start === "number" ? start : parseInt(start, 10);
    start = isNaN(start) ? 0 : start;
    const len = text.length;
    end = typeof end === "number" ? end : parseInt(end, 10);
    end = isNaN(end) ? len : end;
    if (start < 0) start = len + start;
    if (end < 0) end = len + end;
    return text.substring(start, end);
  } catch (e) {
    return "";
  }
});

Handlebars.registerHelper("includes", function (str, substr) {
  if (typeof str !== "string" || typeof substr !== "string") return "";
  return str.includes(substr);
});

Handlebars.registerHelper("checkRequired", function (obj, pathsStr) {
  if (typeof pathsStr !== "string" || lod_.isEmpty(pathsStr))
    return JSON.stringify({ success: false });
  const pathsArray = pathsStr.split(",").map(s => s.trim());
  let result = [];
  for (const path of pathsArray) {
    if (!lod_.isNil(path) && !lod_.isEmpty(path)) {
      const checkData = lod_.get(obj, path);
      if (!lod_.isNil(checkData)) {
        result.push({ success: true, path });
      } else {
        result.push({ success: false, path });
      }
    } else {
      result = { success: false };
      break;
    }
  }
  return JSON.stringify(result);
});

Handlebars.registerHelper("toFormatUtc", function (dateString, format = "dd/MM/yyyy") {
  if (!dateString) return null;
  const date = DateTime.fromFormat(dateString, format, { zone: "utc" });
  return date.toUTC().toISO();
});

Handlebars.registerHelper("ifCheck", function (...args) {
  const paths = args;
  for (const path of paths) {
    const value = lod_.get(this, path);
    if (!lod_.isNil(value) && !lod_.isEmpty(value)) {
      return JSON.stringify(value);
    }
  }
  return `"undefined"`;
});

Handlebars.registerHelper("prefer", function (...values) {
  values.pop();
  for (const v of values) {
    if (v !== null && v !== undefined && v !== "") return v;
  }
  return "";
});

/**
 * replaceInTextHbr replace tags like {{ json tag.example }} by the value in the context
 * @param {string} templateModel contains the template with possibly fields to replace
 * @param {object} context an object with all values for replacement
 * @param {boolean} isJson is true if the text is a json (parses the rendered result)
 * @returns {object|string|undefined}
 */
function replaceInTextHbr(templateModel, context, isJson = false) {
  let result;
  try {
    const template = Handlebars.compile(templateModel);
    result = template(context);
    if (isJson) {
      return JSON.parse(result);
    }
    return result;
  } catch (error) {
    console.warn(
      `renderTemplate - Unexpected error: ${error.message}. isJson = ${isJson}, templateModel is '${templateModel}', context is '${JSON.stringify(context)}', result is '${result}'`
    );
    return undefined;
  }
}

// Expose globals for use in the code window
window.handlebars = Handlebars;
window.DateTime = DateTime;
window.replaceInTextHbr = replaceInTextHbr;

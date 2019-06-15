"use strict";

const path = require("path");
const fs = require("fs");
const Q = require("q");
const cwd = process.cwd();

// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
const NEW_LINE = /\r\n|\n|\r/;
const COLON = ":";
// const COMMA = ",";
// const DQUOTE = "\"";
// const SEMICOLON = ";";
const SPACE = " ";

/**
 * Take ical string data and convert to JSON
 *
 * @param {string} source
 * @returns {Object}
 */
function convert(source) {
  let currentKey = "",
    currentValue = "",
    parentObj = {},
    splitAt;

  const output = {};
  const lines = source.split(NEW_LINE);

  let currentObj = output;
  const parents = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.charAt(0) === SPACE) {
      currentObj[currentKey] += line.substr(1);
    } else {
      splitAt = line.indexOf(COLON);

      if (splitAt < 0) {
        continue;
      }

      currentKey = line.substr(0, splitAt);
      currentValue = line.substr(splitAt + 1);

      switch (currentKey) {
        case "BEGIN":
          parents.push(parentObj);
          parentObj = currentObj;
          if (parentObj[currentValue] == null) {
            parentObj[currentValue] = [];
          }
          // Create a new object, store the reference for future uses
          currentObj = {};
          parentObj[currentValue].push(currentObj);
          break;
        case "END":
          currentObj = parentObj;
          parentObj = parents.pop();
          break;
        default:
          if (currentObj[currentKey]) {
            if (!Array.isArray(currentObj[currentKey])) {
              currentObj[currentKey] = [currentObj[currentKey]];
            }
            currentObj[currentKey].push(currentValue);
          } else {
            currentObj[currentKey] = currentValue;
          }
      }
    }
  }
  return output;
}

/**
 * Take JSON, revert back to ical
 * @param {Object} object
 * @return {String}
 */
function revert(object) {
  const lines = [];

  for (const key in object) {
    const value = object[key];
    if (Array.isArray(value)) {
      value.forEach(item => {
        lines.push(`BEGIN:${key}`);
        lines.push(revert(item));
        lines.push(`END:${key}`);
      });
    } else {
      let fullLine = `${key}:${value}`;
      do {
        // According to ical spec, lines of text should be no longer
        // than 75 octets
        lines.push(fullLine.substr(0, 75));
        fullLine = SPACE + fullLine.substr(75);
      } while (fullLine.length > 1);
    }
  }

  return lines.join("\n");
}

/**
 * Pass in options to parse and generate JSON files
 * @param {Object} options
 * @return {Promise}
 */
function run(options) {
  const filePromises = [];
  const files = options.args || [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.resolve(cwd, file);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    const stat = fs.statSync(filePath);
    const ext = path.extname(filePath);

    const isConvert = !options.revert && ext === ".ics";
    const isRevert = options.revert && ext === ".json";

    if (!stat.isFile() || (!isConvert && !isRevert)) {
      continue;
    }

    filePromises.push(
      Q.nfcall(fs.readFile, filePath)
        .then(buffer => {
          let output;
          const data = buffer.toString();

          if (isConvert) {
            output = convert(data);
            output = JSON.stringify(output, null, "  ");
          } else if (isRevert) {
            output = revert(data);
          }

          const basename = path.basename(filePath, ext);
          const dirname = path.dirname(filePath);
          const compiledExt = isConvert ? ".json" : ".ics";
          const writePath = path.join(dirname, basename) + compiledExt;

          return Q.nfcall(fs.writeFile, writePath, output);
        })
        .fail(error => {
          throw new Error(error);
        })
    );
  }

  return Q.all(filePromises);
}

module.exports = {
  run: run,
  revert: revert,
  convert: convert
};

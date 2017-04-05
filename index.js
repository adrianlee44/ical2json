'use strict';

// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
const NEW_LINE = /\r\n|\n|\r/;
const path = require("path");
const fs = require("fs");
const Q = require("q");
const cwd = process.cwd();
let convert, run, readFile;

/**
 * Take ical string data and convert to JSON
 *
 * @param {string} source
 * @returns {Object}
 */
convert = function(source) {
  let currentKey = "",
      currentValue = "",
      objectNames = [],
      output = {},
      parentObj = {},
      lines = source.split(NEW_LINE),
      splitAt;

  let currentObj = output;
  let parents = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.charAt(0) === " ") {
      currentObj[currentKey] += line.substr(1);

    } else {
      splitAt = line.indexOf(":");

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
          if(currentObj[currentKey]) {
            if(!Array.isArray(currentObj[currentKey])) {
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
};

/**
 * Pass in options to parse and generate JSON files
 * @param {Object} options
 * @return {Promise}
 */
run = function(options) {
  let ext, file, filePath, files, stat, filePromises = [];
  files = options.args || [];

  for (let i = 0; i < files.length; i++) {
    file = files[i];
    filePath = path.resolve(cwd, file);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    stat = fs.statSync(filePath);
    ext = path.extname(filePath);

    if (!(stat.isFile() && ext === ".ics")) {
      continue;
    }

    filePromises.push(Q.nfcall(fs.readFile, filePath)
    .then((buffer) => {
      let basename, dirname, output, writePath;
      output = convert(buffer.toString());
      basename = path.basename(filePath, ext);
      dirname = path.dirname(filePath);
      writePath = path.join(dirname, basename) + ".json";

      return Q.nfcall(fs.writeFile, writePath, JSON.stringify(output, null, "  "));
    })
    .fail((error) => {
      throw new Error(error);
    }));
  }

  return Q.all(filePromises);
};

module.exports = {
  run: run,
  convert: convert
};

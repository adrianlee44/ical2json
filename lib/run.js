"use strict";

const path = require("path");
const fs = require("fs");
const Q = require("q");
const cwd = process.cwd();
const {convert, revert} = require("../index");


/**
 * Pass in options to parse and generate JSON files
 * @param {Object} options
 * @return {Promise}
 */
module.exports = function run(options) {
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
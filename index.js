'use strict';

// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
const NEW_LINE = /\r\n|\n|\r/,
      path     = require('path'),
      fs       = require('fs'),
      Q        = require('q'),
      cwd      = process.cwd();

/**
 * Take ical string data and convert to JSON
 *
 * @param {string} source
 * @returns {Object}
**/
function convert(source) {
  let currentKey   = '',
      currentValue = '',
      objectNames  = [],
      output       = {},
      parentObj    = {},
      lines0       = source.split(NEW_LINE),
      splitAt;

  let currentObj = output;
  let parents = [];

  //merge multi-line items
  const lines = lines0.reduce((acc, curr, i) => {
    if (curr[0] === ' ') {
      const prev = acc.pop();
      const new_elem = prev.concat(curr.substr(1));
      acc.push(new_elem);
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    //some lines are a continuation of the previous one & start with a ' ;'
    if (line.substr(0, 2) === ' ;') {
      const nextLine = lines.splice(i+1, 1);
      line += nextLine;
    }
    if (line.charAt(0) === ' ') {
      currentObj[currentKey] += line.substr(1);
    } else {
      splitAt = line.indexOf(':');

      if (splitAt < 0) {
        continue;
      }

      //key:value
      currentKey = line.substr(0, splitAt);
      currentValue = line.substr(splitAt + 1);

      switch (currentKey) {
        case 'BEGIN':
          parents.push(parentObj);
          parentObj = currentObj;
          if (parentObj[currentValue] == null) {
            parentObj[currentValue] = [];
          }
          // Create a new object, store the reference for future uses
          currentObj = {};
          parentObj[currentValue].push(currentObj);
          break;
        case 'END':
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
 * Take JSON, revert back to ical
 * @param {Object} object
 * @return {String}
**/
function revert(object) {
  let lines = [];

  for (let key in object) {
    let value = object[key];
    if (Array.isArray(value)) {
      value.forEach((item) => {
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
        fullLine = ' ' + fullLine.substr(75);
      } while (fullLine.length > 1);
    }
  }

  return lines.join('\n');
}

/**
 * Pass in options to parse and generate JSON files
 * @param {Object} options
 * @return {Promise}
**/
function run(options) {
  let files, filePromises = [];
  files = options.args || [];

  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    let filePath = path.resolve(cwd, file);

    if (!fs.existsSync(filePath)) {
      continue;
    }

    let stat = fs.statSync(filePath);
    let ext = path.extname(filePath);

    let isConvert = !options.revert && ext === '.ics'
    let isRevert = options.revert && ext === '.json'

    if (!stat.isFile() || (!isConvert && !isRevert)) {
      continue;
    }

    filePromises.push(Q.nfcall(fs.readFile, filePath)
    .then((buffer) => {
      let output;
      let data = buffer.toString();

      if (isConvert) {
        output = convert(data);
        output = JSON.stringify(output, null, '  ');
      } else if (isRevert) {
        output = revert(data);
      }

      let basename = path.basename(filePath, ext);
      let dirname = path.dirname(filePath);
      let compiledExt = isConvert ? '.json' : '.ics';
      let writePath = path.join(dirname, basename) + compiledExt;

      return Q.nfcall(fs.writeFile, writePath, output);
    })
    .fail((error) => {
      throw new Error(error);
    }));
  }

  return Q.all(filePromises);
}

module.exports = {
  run:     run,
  revert:  revert,
  convert: convert,
}

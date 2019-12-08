"use strict";

// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
var NEW_LINE = /\r\n|\n|\r/;
var COLON = ":";
// var COMMA = ",";
// var DQUOTE = "\"";
// var SEMICOLON = ";";
var SPACE = " ";

/**
 * Take ical string data and convert to JSON
 *
 * @param {string} source
 * @returns {Object}
 */
function convert(source) {
  var currentKey = "",
    currentValue = "",
    parentObj = {},
    splitAt;

  var output = {};
  var lines = source.split(NEW_LINE);

  var currentObj = output;
  var parents = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
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
  var lines = [];

  for (var key in object) {
    var value = object[key];
    if (Array.isArray(value)) {
      if (key === "RDATE") {
        value.forEach(function(item) {
          lines.push(key + ":" + item);
        });
      } else {
        value.forEach(function(item) {
          lines.push("BEGIN:" + key);
          lines.push(revert(item));
          lines.push("END:" + key);
        });
      }
    } else {
      var fullLine = key + ":" + value;
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

module.exports = {
  revert: revert,
  convert: convert
};

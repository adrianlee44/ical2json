// Make sure lines are splited correctly
// http://stackoverflow.com/questions/1155678/javascript-string-newline-character
var NEW_LINE = /\r\n|\n|\r/,
    path = require("path"),
    fs = require("fs"),
    cwd = process.cwd(),
    convert, run, readFile;

convert = function(source) {
  var currentKey = "",
      currentObj,
      currentValue = "",
      line,
      objectNames = [],
      output = {},
      parents,
      parentObj = {},
      i,
      linesLength,
      lines = source.split(NEW_LINE),
      splitAt;

  currentObj = output;
  parents = [];

  for (i = 0, linesLength = lines.length; i < linesLength; i++) {
    line = lines[i];
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
          currentObj = {};
          parentObj[currentValue].push(currentObj);
          break;
        case "END":
          currentObj = parentObj;
          parentObj = parents.shift();
          break;
        default:
          currentObj[currentKey] = currentValue;
      }
    }
  }
  return output;
};

run = function(options) {
  var ext, file, filePath, files, stat, i, length;
  files = options.args || [];

  for (i = 0, length = files.length; i < length; i++) {
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

    fs.readFile(filePath, function(error, buffer) {
      var basename, dirname, output, writePath;
      if (error != null) {
        throw new Error(error);
      }
      output = convert(buffer.toString());
      basename = path.basename(filePath, ext);
      dirname = path.dirname(filePath);
      writePath = path.join(dirname, basename) + ".json";
      return fs.writeFile(writePath, JSON.stringify(output, null, "  "));
    });
  }
};

module.exports = {
  run: run,
  convert: convert
};

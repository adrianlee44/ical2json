(function() {
  var NEW_LINE, convert, cwd, fs, path, run;

  fs = require("fs");

  path = require("path");

  cwd = process.cwd();

  NEW_LINE = /\n\r?/;

  convert = function(source) {
    var currentKey, currentObj, currentValue, line, objectNames, output, parentObj, _i, _len, _ref, _ref1;
    output = {};
    currentObj = output;
    parentObj = {};
    currentKey = "";
    currentValue = "";
    objectNames = [];
    _ref = source.split(NEW_LINE);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      line = _ref[_i];
      if (line.charAt(0) === " ") {
        currentObj[currentKey] += line;
      } else {
        _ref1 = line.split(":"), currentKey = _ref1[0], currentValue = _ref1[1];
        switch (currentKey) {
          case "BEGIN":
            parentObj = currentObj;
            if (parentObj[currentValue] == null) {
              parentObj[currentValue] = [];
            }
            currentObj = {};
            parentObj[currentValue].push(currentObj);
            break;
          case "END":
            currentObj = parentObj;
            break;
          default:
            currentObj[currentKey] = currentValue;
        }
      }
    }
    return output;
  };

  run = function(options) {
    var ext, file, filePath, files, stat, _i, _len, _results;
    files = options.args || [];
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      filePath = path.resolve(cwd, file);
      if (!fs.existsSync(filePath)) {
        continue;
      }
      stat = fs.statSync(filePath);
      ext = path.extname(filePath);
      if (!(stat.isFile() && ext === ".ics")) {
        continue;
      }
      _results.push(fs.readFile(filePath, function(error, buffer) {
        var basename, dirname, output, writePath;
        if (error != null) {
          throw new Error(error);
        }
        output = convert(buffer.toString());
        basename = path.basename(filePath, ext);
        dirname = path.dirname(filePath);
        writePath = path.join(dirname, basename) + ".json";
        return fs.writeFile(writePath, JSON.stringify(output, null, "  "));
      }));
    }
    return _results;
  };

  module.exports = {
    run: run,
    convert: convert
  };

}).call(this);

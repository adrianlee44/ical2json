fs   = require "fs"
path = require "path"

cwd      = process.cwd()
NEW_LINE = /\n\r?/

convert = (source) ->
  output     = {}
  currentObj = output
  parentObj  = {}

  currentKey   = ""
  currentValue = ""
  objectNames  = []

  for line in source.split(NEW_LINE)
    if line.charAt(0) is " "
      currentObj[currentKey] += line

    else
      [currentKey, currentValue] = line.split ":"
      switch currentKey
        when "BEGIN"
          parentObj                = currentObj
          parentObj[currentValue] ?= []
          currentObj               = {}
          parentObj[currentValue].push currentObj
        when "END"
          currentObj = parentObj
        else
          currentObj[currentKey] = currentValue

  return output

run = (options) ->
  files = options.args or []

  for file in files
    filePath = path.resolve cwd, file
    continue unless fs.existsSync filePath

    stat = fs.statSync filePath
    ext  = path.extname filePath

    continue unless stat.isFile() and ext is ".ics"

    fs.readFile filePath, (error, buffer) ->
      throw new Error(error) if error?

      output = convert buffer.toString()

      basename  = path.basename filePath, ext
      dirname   = path.dirname filePath
      writePath = path.join(dirname, basename) + ".json"
      fs.writeFile writePath, JSON.stringify(output, null, "  ")

module.exports = {
  run
  convert
}
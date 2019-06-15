module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      files: ["test.js"]
    },
    eslint: {
      files: ["*.js", "bin/ical2json"],
    }
  });

  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-eslint");

  grunt.registerTask("default", ["eslint", "nodeunit"]);
};

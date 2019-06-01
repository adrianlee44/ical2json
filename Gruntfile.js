module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      files: ["test.js"]
    },
    eslint: {
      target: "*.js",
    }
  });

  grunt.loadNpmTasks("grunt-contrib-nodeunit");
  grunt.loadNpmTasks("grunt-eslint");

  grunt.registerTask("default", ["eslint", "nodeunit"]);
};

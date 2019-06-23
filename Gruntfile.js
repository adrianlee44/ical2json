module.exports = function(grunt) {
  grunt.initConfig({
    ava: {
      test: ["test/*.js"],
      nycTest: {
        options: {
          verbose: true,
          nyc: true
        },
        files: {
          src: ["test/*.js"]
        }
      }
    },
    eslint: {
      files: ["*.js", "bin/ical2json", "lib/*.js", "test/*.js"]
    }
  });

  grunt.loadNpmTasks("grunt-ava");
  grunt.loadNpmTasks("grunt-eslint");

  grunt.registerTask("default", ["eslint", "ava:tests"]);
};

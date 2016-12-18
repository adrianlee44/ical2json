module.exports = function(grunt) {
  grunt.initConfig({
    nodeunit: {
      files: ['test.js']
    },
    jshint: {
      options: {
        eqnull: true,
        loopfunc: true
      },
      src: 'index.js',
      test: 'test.js'
    },
    watch: {
      src: {
        files: 'index.js',
        tasks: ['jshint', 'nodeunit']
      },
      test: {
        files: 'test.js',
        tasks: ['jshint', 'nodeunit']
      }
    }
  });
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', ['jshint', 'nodeunit']);
};

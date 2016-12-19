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
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('default', ['jshint', 'nodeunit']);
};

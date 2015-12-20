module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
      app: {
        files: {
           'public/javascript/app.js': ['public/javascript/angular/initapp.js', 'public/javascript/angular/**/*.js']
        }
      }
    },
    watch: {
      files: ['<%= uglify.app.files %>'],
      tasks: ['uglify:app.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('build', ['uglify:app']);

};
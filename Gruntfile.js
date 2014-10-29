/*
 * grunt-http-server
 * https://github.com/eob/grunt-web-server
 *
 */

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-web-server');

  grunt.initConfig({
    web_server: {
      options: {
        cors: true,
        port: 8000,
        nevercache: true,
        logRequests: true
      },
      foo: 'bar' // For some reason an extra key with a non-object value is necessary
    },
  });
}
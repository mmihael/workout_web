module.exports = function (grunt) {
    grunt.initConfig({
        cssmin: {
            target: {
                files: {
                    './public/app.css': [
                        './css/bootstrap.css',
                        './css/font-awesome.css',
                        './css/app.css'
                    ]
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['cssmin']);
};
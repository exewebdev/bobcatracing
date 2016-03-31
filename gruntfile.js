module.exports = function(grunt) {
    // Project configuration. 
    grunt.initConfig({
        jshint: {
            all: ['./*.js']
        },
        htmllint: {
            all: ["public/*.html"],
            options: {
                ignore: []
            }
        },
        accessibility: {
            options : {
                accessibilityLevel: 'WCAG2A',
                 reportLevels: {
                    notice: false,
                    warning: false,
                    error: true
                },
                //the following are ignored by the accessability checker - if edited, please leave rationale for doing so!
                ignore :[
                ]
            },
            test : {
              src: ['public/*.html']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-accessibility');
    
    grunt.registerTask('default', ['jshint', 'htmllint', 'accessibility']);
};
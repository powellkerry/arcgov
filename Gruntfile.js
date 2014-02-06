module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**********\n Package Name: <%= pkg.name %> \n Version: <%=pkg.version%> \n Built: <%= grunt.template.today("yyyy-mm-dd") %> \n ********/\n',
                mangle: false
            },
            my_target: {
                files: {
                    'build/<%= pkg.name %>.min.js': ['controllers/*.js','filters/*.js']
                }

            }
        },
        sass: {
            files: {
                '/styles/stylesheets/app.css': '**/*.scss'
            }
        },
        jshint: {
            all: ['controllers/*.js', 'filters/*.js', 'node/*.js']
        },
        watch: {
            options: {
                livereload: true
            },
            css: {
                files: '**/*.sass',
                tasks: ['sass']
            },
            scripts: {
                files: ['**/*.js'],
                tasks: ['uglify', 'jshint'],
                options: {
                    spawn: false,
                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['uglify']);

};
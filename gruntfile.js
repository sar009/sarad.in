var crypto = require('crypto');
var fs = require('fs');

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            app: {
                files: {
                    'minified_assets/css/style.min.css': [
                        'assets/css/style.css'
                    ]
                }
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                }
            },
            app: [
                'assets/js/*.js'
            ]
        },
        uglify: {
            app: {
                options: {
                    mangle: false
                },
                files: {
                    'minified_assets/js/resource.min.js': [
                        'assets/js/app.js',
                        'assets/js/router.js',
                        'assets/js/controller.js',
                        'assets/js/services.js'
                    ]
                }
            }
        },
        htmlmin: {
            app: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
                    expand: true,
                    cwd: 'assets/templates',
                    src: ['**/*.html', '**/*.txt'],
                    dest: 'minified_assets/templates'
                }, {
                    'index.html': [
                        'dev_index.html'
                    ]
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            js: {
                files: [
                    'assets/js/app.js',
                    'assets/js/controller.js',
                    'assets/js/router.js',
                    'assets/js/services.js'
                ]
            },
            css: {
                files: [
                    'assets/css/style.css'
                ]
            }
        },
        csslint: {
            app: {
                options: {
                    import: 2
                },
                src: ['assets/css/style.css']
            }
        },
        bootlint: {
            options: {
                stoponerror: true,
                stoponwarning: true,
                relaxerror: []
            },
            files: ['assets/templates/*.html', 'dev_index.html']
        },
        'string-replace': {
            app: {
                files: [{
                    'index.html': [
                        'index.html'
                    ]
                }, {
                    'minified_assets/js/resource.min.js': [
                        'minified_assets/js/resource.min.js'
                    ]
                }],
                options: {
                    replacements: [{
                        pattern: '<link href="assets/css/bootstrap.min.css" rel="stylesheet">',
                        replacement: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">'
                    }, {
                        pattern: '<link href="assets/css/bootstrap-theme.min.css" rel="stylesheet">',
                        replacement: '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap-theme.min.css">'
                    }, {
                        pattern: '<link href="assets/css/font-awesome.min.css" rel="stylesheet">',
                        replacement: '<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">'
                    }, {
                        pattern: '<link href="assets/css/style.css" rel="stylesheet">',
                        replacement: '<link href="/minified_assets/css/style.min.css?id=' + getStyleHash() + '" rel="stylesheet">'
                    }, {
                        pattern: '<script src="assets/js/lib/angular.min.js"></script>',
                        replacement: '<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.13/angular.min.js"></script>'
                    }, {
                        pattern: '<script src="assets/js/lib/angular-route.min.js"></script>',
                        replacement: '<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.13/angular-route.min.js"></script>'
                    }, {
                        pattern: '<script src="assets/js/app.js"></script><script src="assets/js/router.js"></script><script src="assets/js/controller.js"></script><script src="assets/js/services.js"></script>',
                        replacement: '<script src="/minified_assets/js/resource.min.js?id=' + getResourceHash() + '"></script>'
                    }, {
                        pattern: '<script src="assets/js/lib/jquery.min.js"></script>',
                        replacement: '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>'
                    }, {
                        pattern: '<script src="assets/js/lib/bootstrap.min.js"></script>',
                        replacement: '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>'
                    }, {
                        pattern: '<script src="//localhost:35729/livereload.js"></script>',
                        replacement: ''
                    }, {
                        pattern: '@@partialChecksum@@',
                        replacement: getTemplateHash()
                    }]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: '*',
                    index: 'dev_index.html'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-bootlint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('default', [
        'connect',
        'watch'
    ]);
    grunt.registerTask('build', [
        'jshint',
        'uglify',
        'htmlmin',
        'string-replace',
        'cssmin'
    ]);
    grunt.registerTask('lint', [
        'jshint',
        'csslint',
        'bootlint'
    ]);
};

function getTemplateHash() {
    var hash = "";
    fs.readdirSync('assets/templates/').forEach(function(file) {
        hash += checksum(fs.readFileSync('assets/templates/' + file), 'md5');
    });
    return checksum(hash, 'md5');
}

function getResourceHash() {
    return checksum(fs.readFileSync('minified_assets/js/resource.min.js'), 'md5');
}

function getStyleHash() {
    return checksum(fs.readFileSync('minified_assets/css/style.min.css'), 'md5');
}

function checksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}
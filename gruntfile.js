var crypto = require('crypto');
var fs = require('fs');

module.exports = function(grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        cssmin: {
            app: {
                files: {
                    'dist/css/style.min.css': [
                        'assets/css/style.css', 'assets/css/fontello.css'
                    ]
                }
            }
        },
        jshint: {
            options: {
                bitwise: true,
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                esnext: true,
                indent: 4,
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
                files: {}
            }
        },
        htmlmin: {
            app: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: [{
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
                files: []
            },
            css: {
                files: [
                    'assets/css/**/*.css'
                ]
            },
            html: {
                files: [
                    'dev_index.html'
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
            files: ['dev_index.html']
        },

        'string-replace': {
            app: {
                files: [{
                    'index.html': [
                        'index.html'
                    ]
                }, {
                    'dist/css/style.min.css': [
                        'dist/css/style.min.css'
                    ]
                }],
                options: {
                    replacements: [{
                        pattern: /@@FONT_HASH@@/g,
                        replacement: getFileHash('font')
                    }, {
                        pattern: /\/assets\/img/g,
                        replacement: "/dist/img"
                    }, {
                        pattern: /@@IMAGE_HASH@@/g,
                        replacement: getFileHash('img')
                    }, {
                        pattern: '<link href="/assets/css/style.css" rel="stylesheet">',
                        replacement: '<link href="/dist/css/style.min.css?id=' + getFileHash('css') + '" rel="stylesheet">'
                    }, {
                        pattern: '<link href="/assets/css/fontello.css" rel="stylesheet">',
                        replacement: ''
                    }]
                }
            }
        },

        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: true,
                open: true,
                base: {
                    path: '.',
                    options: {
                        index: 'dev_index.html'
                    }
                }
            },
            livereload: {}
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'assets/',
                    src: 'font/*.*',
                    dest: 'dist/'
                }, {
                    expand: true,
                    cwd: 'assets/',
                    src: ['img/mountains.jpg', 'img/sarad.jpeg'],
                    dest: 'dist/'
                }]
            }
        },

        clean: ['dist']
    });

    grunt.loadNpmTasks('grunt-bootlint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('default', [
        'connect',
        'watch'
    ]);
    grunt.registerTask('serve', [
        'connect',
        'watch'
    ]);
    grunt.registerTask('build', [
        'clean',
        // 'jshint',
        'copy',
        'uglify',
        'htmlmin',
        'cssmin',
        'string-replace'
    ]);
    grunt.registerTask('lint', [
        // 'jshint',
        'csslint',
        'bootlint'
    ]);
};

function getFileHash(type) {
    var path = [];
    switch (type) {
        case "font":
            if (!fs.existsSync('dist/font/')) {
                return;
            }
            fs.readdirSync('dist/font/').forEach(function(file) {
                path.push('dist/font/' + file);
            });
            break;

        case "css":
            path.push('dist/css/style.min.css');
            break;

        case "img":
            if (!fs.existsSync('dist/img/')) {
                return;
            }
            fs.readdirSync('dist/img/').forEach(function(file) {
                path.push('dist/font/' + file);
            });
            break;

        default:
            return null;
    }

    var hash = "";
    path.forEach(function (eachPath) {
        if (fs.existsSync(eachPath)) {
            hash += checksum(fs.readFileSync(eachPath), 'md5');
        }
    });

    return checksum(hash, 'md5');
}

function checksum(str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}
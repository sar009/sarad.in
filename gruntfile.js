'use strict';

var crypto = require('crypto');
var fs = require('fs');
var hljs = require('highlight.js');
var marked = require('marked');
var xmlBuilder = require('xmlbuilder');

module.exports = function(grunt) {
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        cssmin: {
            app: {
                files: {
                    'dist/css/style.min.css': [
                        'assets/css/style.css',
                        'assets/css/fontello.css'
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
                'assets/js/*.js',
                'assets/json/*.json'
            ]
        },

        uglify: {
            app: {
                options: {
                    mangle: true,
                    compress: true,
                    report: 'gzip',
                    output: {
                        comments: false
                    }
                },
                files: {
                    'dist/js/script.min.js': [
                        'assets/js/blog.js',
                        'assets/js/constants.js',
                        'assets/js/util.js'
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
                    'index.html': [
                        'dev_index.html'
                    ],
                    'blog/index.html': [
                        'dev_blog.html'
                    ]
                }]
            }
        },

        'json-minify': {
            app: {
                files: 'dist/json/*.json'
            }
        },

        watch: {
            options: {
                livereload: true
            },
            js: {
                files: [
                    'assets/js/**/*.js',
                    'assets/json/**/*.json'
                ]
            },
            css: {
                files: [
                    'assets/css/**/*.css'
                ]
            },
            html: {
                files: [
                    'dev_index.html',
                    'dev_blog.html',
                    'blog/**/*.html'
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

        connect: {
            options: {
                port: 9000,
                hostname: '0.0.0.0',
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
                }, {
                    expand: true,
                    cwd: 'assets/',
                    src: ['json/blog_index.json'],
                    dest: 'dist/'
                }]
            }
        },

        clean: ['dist']
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-json-minify');

    grunt.registerTask('default', [
        'serve'
    ]);

    grunt.registerTask('serve', [
        'connect',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'lint',
        'copy',
        'blog',
        'uglify',
        'htmlmin',
        'cssmin',
        'json-minify',
        'build-cache',
        'sitemap'
    ]);

    grunt.registerTask('lint', [
        'jshint',
        'csslint'
    ]);

    grunt.registerTask('blog', 'build blog', function () {
        var blogJson = [];
        marked.setOptions({
            renderer: new marked.Renderer(),
            langPrefix:'hljs ',
            highlight: function(code, lang) {
                return hljs.highlight(lang, code).value;
            },
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            xhtml: false
        });
        var blogTemplate = fs.readFileSync('blog/blog_template.html', 'utf8');
        fs.readdirSync('blog/md/').forEach(function(file) {
            var blogName = file.substring(0, (file.length - 3));
            var blogLocation = 'blog/' + blogName;
            if (!fs.existsSync(blogLocation)) {
                fs.mkdirSync(blogLocation);
            }
            fs.writeFileSync(blogLocation + '.html', '<script type="text/javascript">' +
                'window.location = "/' + blogLocation + '/"' +
                '</script>');

            var rawMd = fs.readFileSync('blog/md/' + file, 'utf8');
            var meta = rawMd.split("---meta-end---")[0];
            var content = rawMd.split("---meta-end---")[1];
            var metaKeys = processMetaKeys(meta, ["title", "date", "desc"]);
            blogJson.push({
                "title": metaKeys.title,
                "desc": metaKeys.desc,
                "published_at": metaKeys.date,
                "href": blogLocation + "/"
            });
            var publishDate = new Date(metaKeys.date);

            var metaTags = '<meta name="description" content="Blog by Sarad Mohanan. See you on the other side :)">\n' +
                '    <meta name="keywords" content="sarad, mohanan, blog, ' + metaKeys.title.split(' ').join(', ') + '">\n' +
                '    <meta property="og:title" content="' + metaKeys.title + '" />\n' +
                '    <meta property="og:url" content="http://sarad.in/' + blogLocation + '/"/>\n' +
                '    <meta property="og:site_name" content="' + metaKeys.title + '"/>\n' +
                '    <meta property="og:description" content="' + metaKeys.desc + '"/>\n' +
                '    <title>Sarad | ' + metaKeys.title + '</title>';

            blogTemplate = blogTemplate.replace("<!--{{ meta_tags }}-->", metaTags);
            blogTemplate = blogTemplate.replace("<!--{{ blog_title }}-->", metaKeys.title);
            blogTemplate = blogTemplate.replace("<!--{{ blog_desc }}-->", metaKeys.desc);
            blogTemplate = blogTemplate.replace("<!--{{ blog_date }}-->", publishDate.toDateString());
            blogTemplate = blogTemplate.replace("<!--{{ blog_content }}-->", marked(content.trim()));
            fs.writeFileSync(blogLocation + '/index.html', blogTemplate);
        });
        fs.writeFileSync("assets/json/blog_index.json", JSON.stringify(blogJson, null, 4));
    });

    grunt.registerTask('build-cache', 'build cache task', function () {
        var fileHash = {};
        var option = ["css", "js", "font", "img"];
        var checksum = function(str, algorithm, encoding) {
            return crypto
                .createHash(algorithm || 'md5')
                .update(str, 'utf8')
                .digest(encoding || 'hex')
        };
        var hashCalculator = function(type) {
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

                case "js":
                    fs.readdirSync('dist/js/').forEach(function(file) {
                        path.push('dist/js/' + file);
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
        };

        option.forEach(function (eachOption) {
            fileHash[eachOption] = hashCalculator(eachOption);
        });

        var filesToReplace = ['index.html', 'blog/index.html', 'dist/css/style.min.css', 'dist/js/script.min.js'];
        fs.readdirSync('blog/md/').forEach(function(file) {
            var blogName = file.substring(0, (file.length - 3));
            var blogLocation = 'blog/' + blogName;
            if (fs.existsSync(blogLocation)) {
                filesToReplace.push(blogLocation + '/index.html');
            }
        });
        const replacements = [{
            pattern: /@@FONT_HASH@@/g,
            replacement: fileHash.font
        }, {
            pattern: /\/assets\/img/g,
            replacement: "/dist/img"
        }, {
            pattern: /@@IMAGE_HASH@@/g,
            replacement: fileHash.img
        }, {
            pattern: '<link href="/assets/css/style.css" rel="stylesheet">',
            replacement: '<link href="/dist/css/style.min.css?id=' + fileHash.css + '" rel="stylesheet">'
        }, {
            pattern: '<link href="/assets/css/fontello.css" rel="stylesheet">',
            replacement: ''
        }, {
            pattern: '<script src="/assets/js/constants.js"></script>',
            replacement: '<script src="/dist/js/script.min.js?id=' + fileHash.js + '"></script>'
        }, {
            pattern: '<script src="/assets/js/blog.js"></script>',
            replacement: ''
        }, {
            pattern: '<script src="/assets/js/util.js"></script>',
            replacement: ''
        }, {
            pattern: '/assets/json/',
            replacement: '/dist/json/'
        }, {
            pattern: '{{ js_version }}',
            replacement: fileHash.js
        }];

        filesToReplace.forEach(function (eachFile) {
            var fileContent = fs.readFileSync(eachFile, 'utf8');
            replacements.forEach(function(eachReplacement) {
                fileContent = fileContent.replace(eachReplacement.pattern, eachReplacement.replacement);
            });
            fs.writeFileSync(eachFile, fileContent);
        })
    });

    grunt.registerTask('sitemap', 'build sitemap', function () {
        var contents = {
            "url": [
                "https://sarad.in/",
                "https://sarad.in/blog/"
            ],
            "image": [{
                "loc": "https://sarad.in/dist/img/sarad.jpeg",
                "caption": "ME :p",
                "title": "Sarad Mohanan"
            }, {
                "loc": "https://sarad.in/dist/img/mountains.jpg",
                "caption": "background image",
                "title": "mountains"
            }]
        };

        fs.readdirSync("blog/md/").forEach(function(file) {
            var blogName = file.substring(0, (file.length - 3));
            contents.url.push("https://sarad.in/blog/" + blogName + "/");
        });

        var siteMapBuilder = xmlBuilder.create("urlset", { encoding: "UTF-8" })
            .att("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")
            .att("xmlns:image", "http://www.google.com/schemas/sitemap-image/1.1")
            .ele("url");

        contents.url.forEach(function (eachUrl) {
            siteMapBuilder = siteMapBuilder.ele("loc", eachUrl).up();
        });

        contents.image.forEach(function (eachImage) {
            siteMapBuilder = siteMapBuilder.ele("image:image");
            for (var key in eachImage) {
                if (eachImage.hasOwnProperty(key)) {
                    siteMapBuilder = siteMapBuilder.ele("image:" + key, eachImage[key]).up();
                }
            }
            siteMapBuilder = siteMapBuilder.up();
        });

        fs.writeFileSync("sitemap.xml", siteMapBuilder.end({
            pretty: true
        }));
    });
};

function processMetaKeys(metaContent, allowedKeys) {
    var availableKeys = {};
    metaContent.trim().split("\n").forEach(function (eachContent) {
        var parts = eachContent.split(":");
        var key = parts[0];
        var value = parts.slice(1, parts.length).join(":");
        availableKeys[key.trim()] = value.trim();
    });
    var metaKeys = {};
    allowedKeys.forEach(function (eachKey) {
        metaKeys[eachKey] = availableKeys[eachKey];
    });
    return metaKeys;
}

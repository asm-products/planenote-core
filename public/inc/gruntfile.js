module.exports = function(grunt) {
    
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    var tasks = {
        css: [
            // home
            'concat:build_home_css',
            'sass:build_home',
            'cssmin:build_home',
            
            // main
            'concat:build_main',
            'sass:build_main',
            'cssmin:build_main'
        ],
        js: [
            'uglify:build_home',
            'uglify:build_main_lib',
            'uglify:build_main'
        ]
    };
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        concat: {
            build_home_css: {
                src: [
                    'lib/bower_components/sweetalert/lib/sweet-alert.css',
                    'styles/global_styles.scss',
                    'styles/home.scss'
                ],
                dest: 'styles/min/home.join.scss'
            },
            build_main: {
                src: [
                    'lib/bower_components/nprogress/nprogress.css',
                    'styles/global_styles.scss',
                    'styles/main_styles.scss',
                    'styles/components/topbar.scss',
                    'styles/components/content_item.scss',
                    'styles/components/notification.scss',
                    'styles/components/dialog.scss',
                    
                    'styles/dashboard_home.scss',
                    'styles/profile.scss',
                    'styles/view.scss',
                ],
                dest: 'styles/min/main.join.scss'
            }
        },
        
        sass: {
            options: {
                sourcemap: 'none'
            },
            build_home: {
                files: {
                    'styles/min/home.css': 'styles/min/home.join.scss'
                }
            },
            build_main: {
                files: {
                    'styles/min/main.css': 'styles/min/main.join.scss'
                }
            }
        },
        
        cssmin: {
            build_home: {
                files: {
                    'styles/min/home.css': ['styles/min/home.css']
                }
            },
            build_main: {
                files: {
                    'styles/min/main.css': ['styles/min/main.css']
                }
            }
        },
        
        uglify: {
            options: {
                sourceMap: false
            },
            
            // main home screen
            build_home: {
                files: {
                    'scripts/min/home.js': [
                        'lib/bower_components/sweetalert/lib/sweet-alert.min.js',
                        'scripts/home.js',
                        'scripts/alert.js'
                    ]
                }
            },
            
            // main libraries
            build_main_lib: {
                files: {
                    'scripts/min/main_lib.js': [
                        'lib/bower_components/underscore/underscore-min.js',
                        'lib/bower_components/nprogress/nprogress.js',
                        'lib/simple_ajax_uploader/SimpleAjaxUploader.min.js'
                    ]
                }
            },
            
            // main
            build_main: {
                files: {
                    'scripts/min/main.js': [
                        'scripts/helper.js',
                        'scripts/sitewide.js',
                        'scripts/pages_handler.js',
                        'scripts/notification_handler.js',
                        
                        'scripts/lib/bpopup.min.js',
                        'scripts/dialog_handler.js',
                        
                        'scripts/dashboard.js',
                        'scripts/dashboard_home.js',
                        'scripts/profile_page.js'
                    ]
                }
            }
        }
    });
    
    grunt.registerTask('css', tasks.css);
    grunt.registerTask('js', tasks.js);
    
};

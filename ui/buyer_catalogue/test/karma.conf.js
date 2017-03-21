// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2016-01-25 using
// generator-karma 1.0.1

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/slick-carousel/slick/slick.js',
      'bower_components/angular-slick-carousel/dist/angular-slick.js',
      'bower_components/angular-rangeslider/angular.rangeSlider.js',
      'bower_components/angularjs-slider/dist/rzslider.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-filter/dist/angular-filter.js',
      'bower_components/angularUtils-pagination/dirPagination.js',
      'bower_components/myforce-angularjs-dropdown-multiselect/dist/angularjs-dropdown-multiselect.min.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/ng-file-upload-shim/ng-file-upload-shim.js',
      'bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      'bower_components/lodash/lodash.js',
      'bower_components/markerclustererplus/src/markerclusterer.js',
      'bower_components/google-maps-utility-library-v3-markerwithlabel/dist/markerwithlabel.js',
      'bower_components/google-maps-utility-library-v3-infobox/dist/infobox.js',
      'bower_components/google-maps-utility-library-v3-keydragzoom/dist/keydragzoom.js',
      'bower_components/js-rich-marker/src/richmarker.js',
      'bower_components/angular-google-maps/dist/angular-google-maps.js',
      'bower_components/angular-breadcrumb/release/angular-breadcrumb.js',
      'bower_components/bootstrap-sweetalert/dist/sweetalert.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};

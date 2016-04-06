console.log( 'fisheye/main.js loading...')

$(document).ready(function () {
  console.log( 'fisheye/main.js document ready...')

  var app = angular.module('fisheyeApp', [
    'fisheye.views'
  ]).controller('fisheyeAppController', function() {
    console.log( 'fisheyeAppController begin')
  })
  // No ng-app in index page. Bootstrap manually after RequireJS has dependencies loaded.
  angular.bootstrap(document, [ app.name /*'ReefAdmin'*/])
  // Because of RequireJS we need to bootstrap the app app manually
  // and Angular Scenario runner won't be able to communicate with our app
  // unless we explicitly mark the container as app holder
  // More info: https://groups.google.com/forum/#!msg/angular/yslVnZh9Yjk/MLi3VGXZLeMJ
  //document.addClass('ng-app');
})

console.log( 'fisheye/main.js loading...')

$(document).ready(function () {
  console.log( 'fisheye/main.js document ready...')

  // We inject navigationLayerService so it will be initialized.
  //
  var app = angular.module('fisheyeApp', [
    'fisheye.views'
  ]).controller('fisheyeAppController', [ 'svgedit', 'navigationLayerService', 'voltageService', 'pointService', 'saveSchematic', function( svgedit, navigationLayerService, voltageService, pointService, saveSchematic) {
    console.log( 'fisheyeAppController begin')

    svgedit.editor.addExtension( "ext-fisheye-base", function ( S ) {

      //Register namespace whitelist
      svgedit.sanitize.addWhiteListException( "svg", FV.namespace, FV.attributes.pointName )
      svgedit.sanitize.addWhiteListException( "g", FV.namespace, FV.attributes.pointName )

      svgedit.sanitize.addWhiteListException( "g", FV.namespace, FV.attributes.uri )
      svgedit.sanitize.addWhiteListException( "path", FV.namespace, FV.attributes.uri )
      svgedit.sanitize.addWhiteListException( "ellipse", FV.namespace, FV.attributes.uri )
      svgedit.sanitize.addWhiteListException( "circle", FV.namespace, FV.attributes.uri )
      svgedit.sanitize.addWhiteListException( "rect", FV.namespace, FV.attributes.uri )

      svgedit.sanitize.addWhiteListException( "g", FV.namespace, FV.attributes.schematicType )
      svgedit.sanitize.addWhiteListException( "svg", FV.namespace, FV.attributes.schematicType )
      svgedit.sanitize.addWhiteListException( "path", FV.namespace, FV.attributes.schematicType )
      svgedit.sanitize.addWhiteListException( "ellipse", FV.namespace, FV.attributes.schematicType )
      svgedit.sanitize.addWhiteListException( "circle", FV.namespace, FV.attributes.schematicType )
      svgedit.sanitize.addWhiteListException( "rect", FV.namespace, FV.attributes.schematicType )

      svgedit.sanitize.addWhiteListException( "svg", FV.namespace, FV.attributes.symbolType )
      svgedit.sanitize.addWhiteListException( "g", FV.namespace, FV.attributes.symbolType )

      svgedit.sanitize.addWhiteListException( "g", FV.namespace, FV.attributes.state )

      svgedit.sanitize.addWhiteListException( "g", FV.namespace, FV.attributes.destination )

      svgedit.sanitize.addWhiteListException( "g", FV.namespace, FV.attributes.voltageGroup )
      svgedit.sanitize.addWhiteListException( "g", "xmlns", "x" )
      svgedit.sanitize.addWhiteListException( "g", "xmlns", "y" )
      svgedit.sanitize.addWhiteListException( "g", "xmlns", "name" )

      svgedit.sanitize.addWhiteListException( "svg", FV.namespace, FV.attributes.action );
      return {}
    } )


  }])
  // No ng-app in index page. Bootstrap manually after RequireJS has dependencies loaded.
  angular.bootstrap(document, [ app.name /*'ReefAdmin'*/])
  // Because of RequireJS we need to bootstrap the app app manually
  // and Angular Scenario runner won't be able to communicate with our app
  // unless we explicitly mark the container as app holder
  // More info: https://groups.google.com/forum/#!msg/angular/yslVnZh9Yjk/MLi3VGXZLeMJ
  //document.addClass('ng-app');
})

/*
 * greenbus-views
 * https://github.com/gec/fisheye-views

 * Version: 0.1.0-SNAPSHOT - 2016-04-13
 * License: Apache-2.0
 */
angular.module("fisheye.views", ["fisheye.views.tpls", "fisheye.views.core","fisheye.views.model","fisheye.views.navigationLayer","fisheye.views.openSchematic","fisheye.views.point","fisheye.views.property","fisheye.views.saveSchematic","fisheye.views.selection","fisheye.views.svgedit","fisheye.views.symbol","fisheye.views.voltage"]);
angular.module("fisheye.views.tpls", ["fisheye.views.template/openSchematic/openSchematic.html","fisheye.views.template/property/properties.html","fisheye.views.template/symbol/addSymbol.html"]);
/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */



/**
 *
 */

angular.module('fisheye.views.core', ['ngResource']).

  factory( 'jquery', [ function () {
    'use strict';

    return $
  }]).

  factory( 'browser', [ function () {
    'use strict';

    var exports = {}

    exports.prompt = function ( arg ) {
      return prompt( arg )
    }

    exports.alert = function ( arg ) {
      return window.alert( arg )
    }

    exports.stylesheets = function () {
      return document.styleSheets
    }

    exports.addStyleElement = function (css) {
      $( '<style type="text/css" title="voltage"></style>' )
        .html( css )
        .appendTo( 'head' )
    }

    return exports

  }]).

  factory( 'assets', ['$http', function ( $http ) {
    'use strict';
    return {
      get: function ( assetName, notifySuccess, notifyFailure ) {
        $http.get( 'fisheye/data/asset/' + assetName ).then( notifySuccess, notifyFailure);
      }
    }
  }]).

  factory( 'schematicPersistence', ['$resource', function ( $resource ) {
    'use strict';
    return $resource( 'fisheye/data/schematic/:schematic', {}, {
      query:{method:'GET', params:{query:true}, isArray:true}
    } )
  }])




/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */



/**
 *
 */

angular.module('fisheye.views.dialog', ['ngDialog']).


factory('fvDialog', ['ngDialog',  function(ngDialog){
  'use strict';

  var exports = {}


  exports.open = function(options){
    return ngDialog.open(options)
  }

  exports.close = function(id, value){
    ngDialog.close(id, value)
  }

  return exports

}])

var SVG_NS = 'http://www.w3.org/2000/svg',
    svgDomRclass = /[\n\t\r]/g,
    svgDomRspace = /\s+/

var svgDomMethods = {

  setAttrNs : function(namespace, attribute, value){
    var i, l, elem;
    if (value && typeof value === 'string' && attribute && typeof attribute === 'string') {
      for (i = 0, l = this.length; i < l; i++) {
        elem = this[i];
        if ( elem.nodeType === 1 ) {
          elem.setAttributeNS( namespace, attribute, value);
        }
      }
    }
    return this;
  },

  getSvgClass : function(){
    if ( this.length == 1) {
      return this[0].getAttributeNS( null, 'class' );
    }
  },
  //Heavily inspired by jQuery. See jQuery 1.7.1 addClass for original
  addSvgClass : function(value) {
    var classNames, i, l, elem, setClass, c, cl;
    if (value && typeof value === 'string') {
      classNames = value.split(svgDomRspace);
      for (i = 0, l = this.length; i < l; i++) {
        elem = this[i];

        if ( elem.nodeType === 1 ) {
          if ( !elem.getAttributeNS( null, 'class' )  && classNames.length === 1) {
            elem.setAttributeNS( null, 'class', value );

          } else {
            setClass = ' ' + elem.getAttributeNS( null, 'class' ) + ' ';

            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
              if ( !~setClass.indexOf( ' ' + classNames[c]+ ' ')) {
                setClass += classNames[c] + ' ';
              }
            }
            elem.setAttributeNS( null, 'class', jQuery.trim(setClass));
          }
        }
      }
    }
    return this;
  },
  //Heavily inspired by jQuery. See jQuery 1.7.1 removeClass for original
  removeSvgClass : function(value){
    var classNames, i, l, elem, className, c, cl;

    if ( (value && typeof value === 'string') || value === undefined ) {
      classNames = ( value || '' ).split( svgDomRspace );

      for ( i = 0, l = this.length; i < l; i++ ) {
        elem = this[ i ];

        if ( elem.nodeType === 1 && elem.getAttributeNS( null, 'class' ) ) {
          if ( value ) {
            className = (' ' +elem.getAttributeNS( null, 'class' )  + ' ').replace( svgDomRclass, ' ' );
            for ( c = 0, cl = classNames.length; c < cl; c++ ) {
              className = className.replace(' ' + classNames[ c ] + ' ', ' ');
            }
            elem.setAttributeNS( null, 'class', jQuery.trim(className));

          } else {
            elem.setAttributeNS( null, 'class', '' );
          }
        }
      }
    }
    return this;
  }
}

$.fn.svgdom = function(method) {
  this.each(function() {
    if ( this.nodeType !== 1 || this.namespaceURI !== SVG_NS) {
      $.error(this + ' is not a valid svg object, svgdom does not apply.');
      return;
    }
  });
  if (svgDomMethods[method]) {
    return svgDomMethods[method].apply(this, Array.prototype.slice.call( arguments, 1 ) );
  } else if ( typeof method === 'object' || !method ) {
    return svgDomMethods.init.apply( this, arguments );
  } else {
    $.error( 'Method ' + method + ' does not exist on jQuery.svgdom' );
  }
}


var FV = {
  namespace: {
    uri : 'http://www.totalgrid.org',
    prefix : 'tgs',
    xmlns : 'xmlns:tgs'
  },
  svgNamespace: {
    uri : 'http://www.w3.org/2000/svg',
    prefix : ''
  },
  attributes: {
    nsAction : 'tgs:action',
    action : 'action',
    nsDestination : 'tgs:destination',
    destination : 'destination',
    nsPointName : 'tgs:point-name',
    pointName : 'point-name',
    nsSchematicType : 'tgs:schematic-type',
    schematicType : 'schematic-type',
    nsSymbolType : 'tgs:symbol-type',
    symbolType : 'symbol-type',
    nsState : 'tgs:state',
    state : 'state',
    nsUri : 'tgs:uri',
    uri : 'uri',
    nsVoltageGroup: 'tgs:voltageGroup',
    voltageGroup: 'voltageGroup'
  },
  attributeSelector: {
    nsAction : 'tgs\\:action',
    action : 'action',
    nsDestination : 'tgs\\:destination',
    destination : 'destination',
    nsPointName : 'tgs\\:point-name',
    pointName : 'point-name',
    nsSchematicType : 'tgs\\:schematic-type',
    schematicType : 'schematic-type',
    nsSymbolType : 'tgs\\:symbol-type',
    symbolType : 'symbol-type',
    nsState : 'tgs\\:state',
    state : 'state',
    nsUri : 'tgs\\:uri',
    uri : 'uri',
    nsVoltageGroup: 'tgs\\:voltageGroup',
    voltageGroup: 'voltageGroup'
  },
  NAVIGATION_LAYER_NAME: 'navigation',
  MODELING_LAYER_NAME: 'modeling'
}
/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */

/**
 *
 */


angular.module('fisheye.views.model', ['fisheye.views.core']).

factory( 'model', [ 'svgedit', 'jquery', function (svgedit, jquery) {
  'use strict';

  var exports = {}

  exports.HasVoltage = function ( element, voltageGroups, jquery ) {

    var self = this;
    self.element = element

    if( ! element || ! voltageGroups)
      throw 'Undefined object'

    self.getVoltageGroupNames = function () {
      return Object.keys( voltageGroups );
    }

    self.hasVoltage = function () {
      return Object.keys( voltageGroups ).length > 0;
    }

    self.hasVoltageGroup = function ( groupName ) {
      return !!voltageGroups[ groupName ];
    }

    /**
     * @return the ChangeElementCommand to undo this change.
     */
    self.applyVoltageToGroup = function ( voltage, groupName ) {
      checkVoltageGroupExists( groupName );
      var formattedVoltage = voltage.selectorText.replace( /^\./, '' );
      var currentVoltage = getVoltageForGroup( groupName );
      var voltageGroup = voltageGroups[ groupName ];
      var $$voltageGroup = jquery( voltageGroup );
      $$voltageGroup.svgdom( 'removeSvgClass' );
      $$voltageGroup.svgdom( 'addSvgClass', formattedVoltage );
      return new svgedit.history.ChangeElementCommand( voltageGroup, { 'class':currentVoltage }, 'Apply Voltage' );
    }

    function getVoltageForGroup( groupName ) {
      return jquery( voltageGroups[ groupName ] ).svgdom( 'getSvgClass' );
    }

    function checkVoltageGroupExists( groupName ) {
      if ( !self.hasVoltageGroup( groupName ) ) {
        throw 'Unknown voltage group: ' + groupName + '. Supported groups for this line are: ' + voltageGroups;
      }
    }
  }

  exports.HasStates = function ( element, stateInfo, jquery ) {
    var self = this;
    var G_WITH_STATE_ATTRIBUTE = 'g[' + FV.attributeSelector.nsState + ']';
    if( ! element)
      throw 'Undefined object'

    self.states = stateInfo.states;
    self.visibleState = stateInfo.visibleState;
    self.hasMultipleStates = self.states.length > 1; // ignore single states

    self.changeState = function ( newState ) {
      if ( !self.hasMultipleStates || !newState ) return;

      jquery( element ).children( G_WITH_STATE_ATTRIBUTE ).each( function () {
        var stateElement = jquery( this );
        var state = stateElement.attr( FV.attributes.nsState );
        // Sometimes state is null even though we're iterating children with g[tgs:state]
        if ( state === newState ) {
          stateElement.removeAttr( 'display' );
        } else {
          stateElement.attr( 'display', 'none' )
        }
      } );
    }
  }

  exports.HasAction = function ( element,  jquery ) {
    var ACTION_NONE = 'none';
    var self = this;
    self.action = '';
    self.isActionable = false;

    if( ! jquery(element).is('.point')) {
      self.isActionable = true;
      self.action = element.getAttribute( FV.attributes.nsAction );
      if( ! self.action || self.action === '')
        self.action = ACTION_NONE;
    }

    self.setAction = function( action) {
      if( self.isActionable) {
        // set action
        self.action = action;
        element.setAttributeNS( FV.namespace.uri, FV.attributes.nsAction, action );

        // class should include clickable if action != 'none'
        var $$element = jquery( element );
        if( action && action !== '' && action !== ACTION_NONE) {
          $$element.svgdom( 'addSvgClass', 'clickable' );
        } else {
          $$element.svgdom( 'removeSvgClass', 'clickable' );
        }
      }
    }
  }

  exports.NavigationElement = function ( element, $$ ) {
    var self = this;
    //ensure that we are a valid navigation element by setting required attributes and classes
    var $$element = $$( element );
    $$element.svgdom( 'setAttrNs', FV.namespace.uri, FV.attributes.nsSchematicType, 'navigation-area' );
    $$element.svgdom( 'addSvgClass', 'navigation-area clickable' );

    self.setUri = function ( value ) {
      element.setAttributeNS( FV.namespace.uri, FV.attributes.nsUri, value );
    }

    self.getUri = function () {
      var uri = element.getAttributeNS( FV.namespace.uri, FV.attributes.nsUri );
      if(uri === ''){
        uri = element.getAttribute(FV.attributes.nsUri);
      }
      return uri;
    }

    self.getAttribute = function ( attrName ) {
      return element.getAttribute( attrName );
    }
  }

  exports.SelectedLine = function ( element, $$ ) {
    var self = this;
    var hasVoltage = new exports.HasVoltage( element, {'line':element}, $$ );



    self.getAttribute = function ( attrName ) {
      return element.getAttribute( attrName );
    }

    self.getVoltageGroupNames = function () {
      return hasVoltage.getVoltageGroupNames();
    }

    self.hasVoltage = function () {
      return hasVoltage.hasVoltage();
    }

    self.hasVoltageGroup = function ( groupName ) {
      return hasVoltage.hasVoltageGroup( groupName );
    }

    self.applyVoltageToGroup = function ( voltage, groupName ) {
      return hasVoltage.applyVoltageToGroup( voltage, groupName );
    }
  }


  exports.SelectedSymbol = function ( element, $$ ) {
    // This jQuery selector doesn't always work. It will return <g>
    // elements without a tgs:state attribute
    var G_WITH_STATE_ATTRIBUTE = 'g[' + FV.attributeSelector.nsState + ']';
    var self = this;
    var hasVoltage = new exports.HasVoltage( element, findVoltageGroups(), $$ );
    var hasStates = new exports.HasStates( element, findStates(), $$ );
    var hasAction = new exports.HasAction( element, $$ );


    /* The states for each <svg class="symbol"> element are stored in
     * <g tgs:state="*"> elements. The visible state is the <g> element
     * that does NOT have display="none".
     */
    function findStates() {
      var states = [];
      var visibleState = self.STATE_UNKNOWN;
      // Iterate over immediate <g> children with attribute 'state'
      var gElements = $$( element ).children( G_WITH_STATE_ATTRIBUTE );
      gElements.each( function () {
        var stateElement = $$( this );
        var state = stateElement.attr( FV.attributes.nsState );
        if ( !state ) {
          warnOnInvalidStateAttr( stateElement, this.attributes );
        }
        // Sometimes state is null even though we're iterating children with g[tgs:state]
        if ( state && state !== 'maintenance' ) {
          var display = stateElement.attr( 'display' );
          if ( !display || display.toLowerCase() !== 'none' ) {
            visibleState = state;
          }
          states.push( state );
        }
      } );
      states = states.sort();
      return {states:states, visibleState:visibleState};
    }

    function warnOnInvalidStateAttr( stateElement, attributes ) {
      var noNameSpaceState = stateElement.attr( 'state' );
      if ( noNameSpaceState ) {
        var attrs = $$.map( attributes, function ( obj, index ) {
          return obj.nodeName + '=\'' + obj.nodeValue + '\''
        } );
        console.log( 'ERROR: schematic symbol must use "tgs:" namespace for state attribute: <g ' + attrs.join( ' ' ) + '>' );
      }
    }

    function findVoltageGroups() {
      var voltageGroups = {};
      var voltageNs = FV.attributes.nsVoltageGroup;
      var voltageGroupElements = $$( element ).find( 'g', 'g[' + voltageNs + ']' );
      if ( voltageGroupElements.length > 0 ) {
        voltageGroupElements.each( function () {
          //our selector may pickup things that have children that supportvoltage, but may not themselves,
          //this ensures we only capture things that directly support voltage
          var voltageGroupName = $$( this ).attr( voltageNs );
          if ( voltageGroupName ) {
            voltageGroups[ voltageGroupName ] = this;
          }
        } );
      }
      return voltageGroups;
    }

    self.changeState = function ( newState ) {
      hasStates.changeState( newState );
    }

    self.setAction = function ( action ) {
      hasAction.setAction( action);
    }

    self.getAction = function () {
      return hasAction.action;
    }

    self.isActionable = function () {
      return hasAction.isActionable;
    }

    self.setPointName = function ( pointName ) {
      element.setAttributeNS( FV.namespace.uri, FV.attributes.nsPointName, pointName );
    }

    self.getPointName = function () {
      return element.getAttributeNS( FV.namespace.uri, FV.attributes.nsPointName);
    }

    self.getAttribute = function ( attrName ) {
      return element.getAttribute(  attrName );
    }
    self.getStates = function () {
      return hasStates.states;
    }
    self.getVisibleState = function () {
      return hasStates.visibleState;
    }

    self.hasMultipleStates = function () {
      return hasStates.hasMultipleStates;
    }

    self.getVoltageGroupNames = function () {
      return hasVoltage.getVoltageGroupNames();
    }

    self.hasVoltage = function () {
      return hasVoltage.hasVoltage();
    }

    self.hasVoltageGroup = function ( groupName ) {
      return hasVoltage.hasVoltageGroup( groupName );
    }

    self.applyVoltageToGroup = function ( voltage, groupName ) {
      return hasVoltage.applyVoltageToGroup( voltage, groupName );
    }
  }

  return exports

}])

/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */



/**
 *
 */

angular.module('fisheye.views.navigationLayer', ['fisheye.views.core']).

factory( 'navigationLayerToolbar', [ function () {
  'use strict';

  return {
    element: angular.element
  }

}]).


factory( 'navigationLayerService', [ 'svgedit', '$rootScope', 'navigationLayerToolbar', function (svgedit, $rootScope, navigationLayerToolbar) {
  'use strict';

  var exports = {}


  var isNavigationLayerShowing = false,
      unsupportedTools = [
        '#tool_fhpath',
        '#tools_line_show',
        '#tools_shapelib_show',
        '#tool_text',
        '#tool_image',
        '#tool_zoom',
        '#tool_eyedropper',
        '#status_point_icon',
        '#analog_point_icon'],
      disabledTools = [];


  function toggleButton() {
    if ( isNavigationLayerShowing ) {
      $( '#navigation_layer_icon' ).addClass( 'push_button_pressed' ).removeClass( 'tool_button' );
    } else {
      $( '#navigation_layer_icon' ).removeClass( 'push_button_pressed' ).addClass( 'tool_button' );
    }
  }

  function toggleNavigationMode() {
    isNavigationLayerShowing = !isNavigationLayerShowing;
    toggleButton();
    toggleNavigationLayer();
  }

  function disableOtherTools() {
    //all tools except rect,polyline,circle/ellipse, zoom should be disabled
    disabledTools = [];
    unsupportedTools.forEach( function ( item ) {
      var tool = navigationLayerToolbar.element( item );
      if ( !tool.hasClass( 'disabled' ) ) {
        tool.addClass( 'disabled' );
        //only want to re-enable the ones we had to disable to leave state like we found it.
        disabledTools.push( tool );
      }
    } );
  }

  function enableOtherTools() {
    disabledTools.forEach( function ( item ) {
      item.removeClass( 'disabled' );
    } );
  }

  function toggleNavigationLayer() {
    if ( isNavigationLayerShowing ) {
      svgedit.canvas.setLayerVisibility( FV.NAVIGATION_LAYER_NAME, true );
      svgedit.canvas.setCurrentLayer( FV.NAVIGATION_LAYER_NAME );
      $rootScope.$broadcast('navigationModeActivated');
      disableOtherTools();
    } else {
      svgedit.canvas.setLayerVisibility( FV.NAVIGATION_LAYER_NAME, false );
      svgedit.canvas.setCurrentLayer( FV.MODELING_LAYER_NAME );
      $rootScope.$broadcast('navigationModeDeactivated');
      enableOtherTools();
    }
  }

  function findAllLayers() {
    var i,
        layers = [],
        count = svgedit.canvas.getNumLayers();
    for ( i = 0; i < count; i++ ) {
      layers.push( svgedit.canvas.getLayerName( i ) );
    }
    return layers;
  }

  function hasCorrectLayers( layers ) {
    return layers.indexOf( FV.MODELING_LAYER_NAME ) >= 0 && layers.indexOf( FV.NAVIGATION_LAYER_NAME ) >= 0;
  }

  function normalizeLayers() {
    svgedit.canvas.renameCurrentLayer( FV.MODELING_LAYER_NAME );
    svgedit.canvas.createLayerDirectly( FV.NAVIGATION_LAYER_NAME );
  }

  function initializeNavigationLayer() {
    var layers = findAllLayers();
    if ( !hasCorrectLayers( layers ) ) {
      normalizeLayers();
    }
    svgedit.canvas.setLayerVisibility( FV.NAVIGATION_LAYER_NAME, false );
    svgedit.canvas.setCurrentLayer( FV.MODELING_LAYER_NAME );
  }

  $rootScope.$on( 'documentLoaded', initializeNavigationLayer );

  svgedit.editor.addExtension( 'ext-fisheye-navigation-layer', function () {
    var button = {
      id:'navigation_layer_icon',
      type:'context',
      panel:'editor_panel',
      title:'Show/Hide Navigation',
      events:{ 'click': toggleNavigationMode}
    }
    return {
      name:'navigation-layer',
      svgicons:'fisheye/fisheye-icons.xml',
      buttons:[button]
    };
  } );

  //ensure that the first time we come up that all layers are correct.
  initializeNavigationLayer();


  return exports

}])



/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */


/**
 * Open a schematic from the server.
 */

angular.module('fisheye.views.openSchematic', ['fisheye.views.core', 'fisheye.views.svgedit', 'fisheye.views.dialog']).

controller('fvOpenSchematicController', ['$scope', '$rootScope', 'svgedit', 'schematicPersistence', 'fvDialog',
  function($scope, $rootScope, svgedit, schematicPersistence, fvDialog) {
    'use strict';

    var dialogId = '#open-schematic-dialog',
        debug = true
    $scope.schematics = schematicPersistence.query();
    $scope.selectedSchematic = null;

    function openDialog() {
      loadAvailableSchematics()

      fvDialog.open({
        template: 'fisheye.views.template/openSchematic/openSchematic.html',
        scope: $scope
      }).closePromise.then(
        function( data) {
          console.log( 'success ' + JSON.stringify( data))
          if( data.value !== 'Cancel') {
            //$scope.selectedSchematic = data.value
            schematicPersistence.get({
              schematic : data.value.name + '.svg'
            }, onSchematicLoaded, onSchematicLoadFailure);
          }
        },
        function( data) {
          console.log( 'open schematic failure ' + JSON.stringify( data))
        }
      )
    }

    function loadAvailableSchematics() {
      schematicPersistence.query(
        function(data) {
          $scope.schematics = data;
          if (data.length > 0) {
            $scope.selectedSchematic = data[0];
          }
        },
        function(data) {
          console.log( 'loadAvailableSchematics failure ' + JSON.stringify( data))
          if( debug) {
            $scope.schematics = [{name:'One'}, {name: 'Two'}];
            $scope.selectedSchematic = $scope.schematics[0];
          }
        }
      )
    }

    function onSchematicLoaded(data) {
      svgedit.loadFromString(data.schematic);
      $rootScope.$broadcast('documentLoaded')
    }
    function onSchematicLoadFailure(data) {
      console.log( 'load schematic failure ' + JSON.stringify( data))
      if( debug) {
        var minimalSvg = '<svg height="480" width="640" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:tgs="http://www.totalgrid.org" style="background-color:black"  name="One" version="1.0"><g><title>Layer 1</title><text x="40" y="14" font-size="10" font-family="serif" font-weight="bold" fill="white">Debug Schematic</text></g></svg>'
        svgedit.loadFromString( minimalSvg)
        $rootScope.$broadcast('documentLoaded')
      }
    }

    function init() {
      svgedit.editor.addExtension('ext-fisheye-opensave', {
        callback : function() {
          svgedit.setCustomHandlers({
            open : openDialog
          });
        }
      });
    }
    init();

  }
]).

directive('fvOpenSchematic', function() {
  'use strict';
  return {
    restrict:    'E', // Element name
    scope:       true,
    templateUrl: 'fisheye.views.template/openSchematic/openSchematic.html',
    controller:  'fvOpenSchematicController'
  }
})



/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */



/**
 *
 */

angular.module('fisheye.views.point', ['fisheye.views.core']).

factory( 'pointService', [ '$rootScope', 'svgedit', 'jquery', function ($rootScope, svgedit, jquery) {
  'use strict';

  var exports = {}


  var DEFAULT_QUALITY_SIZE = {
        width: 10,
        height: 10
      },
      QUALITY_INVALID      = '' +
        '<svg xmlns="http://www.w3.org/2000/svg">' +
        ' <title>Quality Invalid</title>' +
        ' <g id="quality_invalid" stroke-opacity="1">' +
        '  <path id="svg_21" d="m7.5,5c0,0 2.5,0 5,0c2.5,0 2.5,0 2.5,2.5c0,2.5 0,2.5 0,5c0,2.5 0,2.5 -2.5,2.5c-2.5,0 -2.5,0 -5,0c-2.5,0 -2.5,0 -2.5,-2.5c0,-2.5 0,-2.5 0,-5c0,-2.5 0,-2.5 2.5,-2.5z" stroke="#999999" fill="#FF0000"/>' +
        '  <text id="svg_22" fill="#FFFFFF" stroke="#999999" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="10" y="14" font-size="10" font-family="serif" text-anchor="middle" space="preserve" fill-opacity="1" stroke-opacity="1" transform="" font-weight="bold">X</text>' +
        ' </g>' +
        '</svg>',
      QUALITY_QUESTIONABLE = '' +
        '<svg xmlns="http://www.w3.org/2000/svg">' +
        ' <title>Quality Questionable</title>' +
        ' <g id="quality_questionable" stroke-opacity="1">' +
        '  <path id="svg_23" d="m7.5,5c0,0 2.5,0 5,0c2.5,0 2.5,0 2.5,2.5c0,2.5 0,2.5 0,5c0,2.5 0,2.5 -2.5,2.5c-2.5,0 -2.5,0 -5,0c-2.5,0 -2.5,0 -2.5,-2.5c0,-2.5 0,-2.5 0,-5c0,-2.5 0,-2.5 2.5,-2.5z" stroke="#999999" fill="#FFFF00"/>' +
        '  <text id="svg_24" fill="#000000" stroke="#999999" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="10" y="14" font-size="10" font-family="serif" text-anchor="middle" space="preserve" fill-opacity="1" stroke-opacity="1" transform="" font-weight="bold">?</text>' +
        ' </g>' +
        '</svg>',
      // We need an empty symbol for use element to reference #quality_good at Atoll run time.
      QUALITY_GOOD         = '' +
        '<svg xmlns="http://www.w3.org/2000/svg">' +
        ' <title>Quality Good</title>' +
        '</svg>'
  // Green box with check mark for debugging.
  // <g id="quality_good" stroke-opacity="1">
  //  <path id="svg_23" d="m7.5,5c0,0 2.5,0 5,0c2.5,0 2.5,0 2.5,2.5c0,2.5 0,2.5 0,5c0,2.5 0,2.5 -2.5,2.5c-2.5,0 -2.5,0 -5,0c-2.5,0 -2.5,0 -2.5,-2.5c0,-2.5 0,-2.5 0,-5c0,-2.5 0,-2.5 2.5,-2.5z" stroke="#999999" fill="#00DD00"/>
  //  <text id="svg_24" fill="#000000" stroke="#999999" stroke-width="0" stroke-dasharray="null" stroke-linejoin="null" stroke-linecap="null" x="10" y="14" font-size="10" font-family="serif" text-anchor="middle" space="preserve" fill-opacity="1" stroke-opacity="1" transform="" font-weight="bold">&#x2713;</text>
  // </g>

  var MODE_ID = 'fisheye-point-add',
      SVGNS = 'http://www.w3.org/2000/svg';

  var symbolQualityInvalid,
      symbolQualityQuestionable,
      symbolQualityGood;


  // Privates from svgCanvas passed in via addExtension() below.
  var svgcontent,
      addSvgElementFromJson,
      addCommandToHistory,
      findDefs,
      getNextId,
      InsertElementCommand;

  // TODO: svgCanvas needs to make svgdoc public.
  var svgdoc = document.getElementById( 'svgcanvas' ).ownerDocument;
  var buttonAnalog = {
    // Must match the icon ID in fisheye-icons.xml
    id:'analog_point_icon',

    // This indicates that the button will be added to the 'mode'
    // button panel on the left side
    type:'mode',

    // Tooltip text
    title:'Add a analog point',

    // Events
    events:{
      'click':function () {
        // The action taken when the button is clicked on.
        // For 'mode' buttons, any other button will
        // automatically be de-pressed.
        svgedit.canvas.setMode( MODE_ID );
      }
    }
  };
  var buttonStatus = {
    id:'status_point_icon', //match the icon ID in fisheye-icons.xml
    type:'mode',
    title:'Add a status point', // Tooltip text
    events:{
      'click':function () {
        svgedit.canvas.setMode( MODE_ID );
      }
    }
  };

  svgEditor.addExtension( 'fisheye.ext-point', function ( S ) {
    // Get privates from svgCanvas
    svgcontent = S.svgcontent;
    addSvgElementFromJson = S.addSvgElementFromJson;
    addCommandToHistory = S.addCommandToHistory;
    findDefs = S.findDefs;
    getNextId = S.getNextId;
    InsertElementCommand = S.InsertElementCommand;

    exports.ensureQualitySymbolsInDefs();

    return {
      name:'Point',
      svgicons:'fisheye/fisheye-icons.xml',

      // Multiple buttons can be added in this array
      buttons:[ buttonAnalog, buttonStatus],
      // This is triggered when the main mouse button is pressed down
      // on the editor canvas (not the tool panels)
      mouseDown:function () {
        // Check the mode on mousedown
        if ( svgedit.canvas.getMode() == MODE_ID ) {

          // The returned object must include 'started' with
          // a value of true in order for mouseUp to be triggered
          return {started:true};
        }
      },

      // This is triggered from anywhere, but 'started' must have been set
      // to true (see above). Note that 'opts' is an object with event info
      mouseUp:function ( opts ) {
        // Check the mode on mouseup
        if ( svgedit.canvas.getMode() == MODE_ID ) {
          exports.ensureQualitySymbolsInDefs();

          var origin = getMouseOrigin( opts );
          var g = makePointElements( origin );
          svgedit.canvas.selectOnly( [g], true );  // true: showGrips

          addCommandToHistory( new InsertElementCommand( g ) );
          svgedit.canvas.call( 'changed', [svgcontent] );

          return {
            keep:true,
            element:g,
            started:false
          }

        }
      }

    };  // end return


  } );	// end addExtension


  /**
   * Conver a string svg content into a symbol.
   *
   * Code modeled after svgCanvas.importSvgString, but doesn't create a use element
   * and doesn't insert into defs.
   *
   * @param id     The xlink:href reference the use element will use.
   * @param xmlString  String of svg representing the symbol.
   * @returns The symbol object
   */
  function makeSymbolFromString( id, xmlString ) {

    //var svg = svgedit.canvas.makeSvgElementFromString( xmlString );
    var svg = svgedit.utilities.text2xml(xmlString).firstChild

    var innerw = svgedit.canvas.convertToNum( 'width', svg.getAttribute( 'width' ) ),
        innerh = svgedit.canvas.convertToNum( 'height', svg.getAttribute( 'height' ) ),
        innervb = svg.getAttribute( 'viewBox' ),
        // if no explicit viewbox, create one out of the width and height
        vb = innervb ? innervb.split( ' ' ) : [0, 0, innerw, innerh];
    for ( var j = 0; j < 4; ++j )
      vb[j] = +(vb[j]);

    var symbol = svgdoc.createElementNS( SVGNS, 'symbol' );

    // Move children of imported svg to symbol.
    while ( svg.firstChild ) {
      var first = svg.firstChild;
      symbol.appendChild( first );
      /*
       * Can't get ID from group because svg-edit already replaced it during makeSvgElementFromString
       if( /g/i.test( first.tagName)) {
       symbol.id = first.id;
       uid = symbol.id;
       }
       */
    }
    symbol.id = id;

    var attrs = svg.attributes;
    for ( var i = 0; i < attrs.length; i++ ) {
      var attr = attrs[i];
      symbol.setAttributeNS( attr.namespaceURI, attr.nodeName, attr.nodeValue );
    }

    // Store data
    /* We don't have access to this container.
     var uid = id;
     import_ids[uid] = {
     symbol: symbol,
     xform: ts
     }
     */

    return symbol;
  }

  function getMouseOrigin( opts ) {
    var zoom = svgedit.canvas.getZoom();

    // Get the actual coordinate by dividing by the zoom value
    var x = opts.mouse_x / zoom;
    var y = opts.mouse_y / zoom;

    return { x:x, y:y};
  }

  function makePointElements( origin ) {
    var text = makeTextElement( origin );
    var quality = makeQualityUseElement( origin );
    var g = makeGroupElementWithChildren( [quality, text] );
    return g;
  }

  function makeTextElement( origin ) {
    var text = addSvgElementFromJson( {
      'element':'text',
      'curStyles':false,
      'attr':{
        'x':origin.x,
        'y':origin.y,
        'id':getNextId(),
        /*
         'text-anchor': 'start',
         'fill': canvas.cur_text.fill,
         'stroke-width': canvas.cur_text.stroke_width,
         'font-size': canvas.cur_text.font_size,
         'font-family': canvas.cur_text.font_family,
         'opacity': canvas.cur_shape.opacity,
         */
        'xml:space':'preserve'
      }
    } );
    text.textContent = 'xxxxxx uu';
    text.setAttribute( 'class', 'data-label' );

    return text;
  }

  function makeUseElementForSymbol( symbol, transform) {

    var use_el = svgdoc.createElementNS(SVGNS, 'use');
    use_el.id = getNextId();
    // This can't be any href. It must be xlink:href for the getBBox call to work!
    svgedit.utilities.setHref( use_el, '#' + symbol.id)
    if( transform && transform !== '') {
      use_el.setAttribute('transform', transform);
    }

    $(use_el).data('symbol', symbol).data('ref', symbol);

    return use_el;
  }

  function getQualityBBox( qualityUse) {
    var bBox = svgedit.utilities.getBBox( qualityUse );
    if( bBox.width === 0)
      bBox.width = DEFAULT_QUALITY_SIZE.width
    if( bBox.height === 0)
      bBox.height = DEFAULT_QUALITY_SIZE.height
    return bBox
  }

  function makeQualityUseElement( origin ) {
    // The quality box origin is top left. The text origin is lower left (not including descenders).
    // Translate quality to be left of text and bottom aligned.
    //
    var transform = '';
    var qualityUse = makeUseElementForSymbol( symbolQualityQuestionable, transform );
    // Append to actual document so the bBox will work (zero otherwise).
    // Later, we group it with text.
    svgedit.canvas.getCurrentLayer().appendChild(qualityUse);
    var bBox = getQualityBBox( qualityUse );
    var margin = bBox.width / 2;
    var tx = origin.x - bBox.x - bBox.width - margin;
    var ty = origin.y - bBox.y - bBox.height + 2;  // add 2 and it's perfect!
    qualityUse.setAttributeNS( null, 'transform', 'translate(' + tx + ',' + ty + ')' );
    qualityUse.setAttributeNS( null, 'class', 'quality-display' );
    qualityUse.setAttributeNS( FV.namespace.uri, FV.attributes.nsSchematicType, 'quality-display' );

    return qualityUse;
  }

  function makeGroupElementWithChildren( children ) {
    // Modeled from svgCanvas.groupSelectedElements()

    var g = addSvgElementFromJson( {
      'element':'g',
      'attr':{
        'id':getNextId()
      }
    } );
    jquery.each( children, function ( index ) {
      g.appendChild( this );
    } );
    g.setAttributeNS( null, 'class', 'point' );
    g.setAttributeNS( FV.namespace.uri, FV.attributes.nsSchematicType, 'point' );
    g.setAttributeNS( FV.namespace.uri, FV.attributes.nsPointName, '' );

    return g;
  }


  // Create the quality symbols and insert them into the defs section
  //
  exports.ensureQualitySymbolsInDefs = function () {
    var defs = findDefs();
    var defs$ = jquery( defs );
    if ( defs$.children( '#quality_invalid' ).length <= 0 ) {
      symbolQualityInvalid = makeSymbolFromString( 'quality_invalid', QUALITY_INVALID );
      defs.appendChild( symbolQualityInvalid );
    }
    if ( defs$.children( '#quality_questionable' ).length <= 0 ) {
      symbolQualityQuestionable = makeSymbolFromString( 'quality_questionable', QUALITY_QUESTIONABLE );
      defs.appendChild( symbolQualityQuestionable );
    }
    if ( defs$.children( '#quality_good' ).length <= 0 ) {
      symbolQualityGood = makeSymbolFromString( 'quality_good', QUALITY_GOOD );
      defs.appendChild( symbolQualityGood );
    }
  };

  $rootScope.$on( 'documentLoaded', exports.ensureQualitySymbolsInDefs );

  return exports

}])



/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */


/**
 * A table of key/value properties for one piece of equipment.
 */
angular.module('fisheye.views.property', ['fisheye.views.core', 'fisheye.views.svgedit', 'fisheye.views.selection', 'fisheye.views.voltage']).

controller('fvPropertiesController', ['$scope', 'svgedit', 'selectionService', 'voltageService',
  function($scope, svgedit, selectionService, voltageService) {

    var DO_NOT_APPLY = '',
        ACTION_NONE = 'none',
        selectionState = {};
    $scope.shouldShowProperties = false;

    $scope.symbolsSelected = false;
    $scope.isMultiselected = false;

    $scope.commonStates = { selected:null, states:[ DO_NOT_APPLY ] };
    $scope.commonStates.selected = $scope.commonStates.states[0];

    $scope.pointName = '';
    $scope.isActionable = false;
    $scope.action = ACTION_NONE;
    $scope.actions = [ACTION_NONE, 'command', 'summary'];

    $scope.voltageableItemSelected = false;
    $scope.voltages = []
    voltageService.voltages.then( function( voltages) {
      $scope.voltages = voltages
    });
    $scope.voltageGroups = [];
    $scope.selectedVoltageGroup = null;

    $scope.navUri = '';
    $scope.selectedNavigationElements = false;


    /* User updated point name. Apply it to selected elements. */
    $scope.applyPointName = function () {
      if ( selectionState.selectedSymbols ) {
        selectionState.selectedSymbols.forEach( function ( symbol ) {
          symbol.setPointName( $scope.pointName );
        } );

      }
    }

    /* User updated point name. Apply it to selected elements. */
    $scope.applyAction = function () {
      if ( $scope.isActionable && selectionState.selectedSymbols ) {
        selectionState.selectedSymbols.forEach( function ( symbol ) {
          symbol.setAction( $scope.action );
        } );

      }
    };

    $scope.applyNavUri = function () {
      if ( selectionState.selectedNavigationElements ) {
        selectionState.selectedNavigationElements.forEach( function ( navElement ) {
          navElement.setUri( $scope.navUri );
        } );
      }
    };

    /* User updated visible state. Apply it to selected elements. */
    $scope.applyVisibleState = function () {
      var newState = $scope.commonStates.selected;
      if ( newState && newState !== selectionService.STATE_DO_NOT_APPLY ) {
        selectionState.commonVisibleState = newState;
        selectionState.selectedSymbols.forEach( function ( symbol ) {
          symbol.changeState( newState );
        } );
      }
    };

    /* User clicked voltage. Apply it to selected elements. */
    $scope.applyVoltage = function ( voltage, voltageGroup ) {
      var batchCommand = svgedit.makeHistoryBatchCommand( 'Apply voltage' );
      selectionState.supportsVoltage.forEach( function ( element ) {
        setVoltageOnElement( element, voltage, voltageGroup, batchCommand );
      } );
      svgedit.addCommandToHistory( batchCommand );
    };

    function setVoltageOnElement( element, voltage, voltageGroup, batchCommand ) {
      if ( element.hasVoltageGroup( voltageGroup ) ) {
        var undoCmd = element.applyVoltageToGroup( voltage, voltageGroup );
        batchCommand.addSubCommand( undoCmd );
      }
    }

    function init() {
      $scope.$on( 'selectionChanged', onSelectionChangedEvent );
      svgedit.editor.addExtension( 'ext-fisheye-scheamticproperties', function ( S ) {
        svgedit.addContextMenu( { id:'open_properties', label:'Properties...', shortcut:'SHFT+CTRL+P', action:function(){} } );
        return {};
      } );
    }

    function updateMenu() {
      if ( selectionState.selectedSymbols ) {
        svgedit.enableContextMenuItems( '#open_properties' );
      } else {
        svgedit.disableContextMenuItems( '#open_properties' );
      }
    }

    function updateStates() {
      $scope.commonStates.states = selectionState.commonStates.sort();
      $scope.commonStates.selected = selectionState.commonVisibleState;
      if ( selectionState.commonVisibleState === selectionService.STATE_DO_NOT_APPLY ) {
        $scope.commonStates.states.splice( 0, 0, DO_NOT_APPLY );
        $scope.commonStates.selected = DO_NOT_APPLY;
      }
      if ( !$scope.commonStates.states.length ) {
        $scope.commonStates.states.splice( 0, 0, DO_NOT_APPLY );
        $scope.commonStates.selected = DO_NOT_APPLY;
      }
    }

    function updateNavAreaUris() {
      if($scope.selectedNavigationElements && !selectionState.isMultiselected){
        $scope.navUri = selectionState.selectedNavigationElements[0].getUri();
      }
    }

    function updatePointNameAndAction() {
      if ( $scope.symbolsSelected && !selectionState.isMultiselected ) {
        var symbol = selectionState.selectedSymbols[0];
        $scope.pointName = symbol.getAttribute( FV.attributes.nsPointName );
        $scope.action = symbol.getAction();
        $scope.isActionable = symbol.isActionable();
      } else {
        $scope.pointName = '';
        $scope.action = '';
        $scope.isActionable = false;
      }
    }

    function updateVoltageableSegments() {
      $scope.voltageGroups = [];
      if ( $scope.voltageableItemSelected ) {
        var groupNames = {};
        selectionState.supportsVoltage.forEach( function ( item ) {
          item.getVoltageGroupNames().forEach( function ( groupName ) {
            groupNames[groupName] = true;
          } );
        } );
        $scope.voltageGroups = Object.keys( groupNames ).sort();
        //need to handle multi-selection which could include several single segmented elements.
      }
    }

    function onSelectionChangedEvent(event, newSelectionState) {
      selectionState = newSelectionState;
      $scope.symbolsSelected = !!selectionState.selectedSymbols.length;
      $scope.voltageableItemSelected = !!selectionState.supportsVoltage.length;
      $scope.selectedNavigationElements = !!selectionState.selectedNavigationElements.length;
      $scope.shouldShowProperties = $scope.symbolsSelected || $scope.voltageableItemSelected || $scope.selectedNavigationElements;
      $scope.isMultiselected = selectionState.isMultiselected;
      updateVoltageableSegments();
      updatePointNameAndAction();
      updateNavAreaUris();
      updateStates();
      updateMenu();
    }

    init();

  }
]).

directive('fvProperties', function() {
  return {
    restrict:    'E', // Element name
    // The template HTML will replace the directive.
    scope:       true,
    templateUrl: 'fisheye.views.template/property/properties.html',
    controller:  'fvPropertiesController'
  }
})



/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */



/**
 *
 */

angular.module('fisheye.views.saveSchematic', ['fisheye.views.core']).

factory( 'saveSchematic', [ '$rootScope', 'svgedit', 'schematicPersistence', 'browser', 'jquery', function( $rootScope, svgedit, schematicPersistence, browser, jquery) {
  'use strict';

  var exports = {}

  var widthRE = new RegExp( /width='(\d+)'/ );
  var heightRE = new RegExp( /height='(\d+)'/ );

  //ensure totalgrid namspace is present on svgcontent.
  svgedit.setSvgContentAttr(  FV.namespace.xmlns, FV.namespace.uri );
  $rootScope.$on( 'documentLoaded', function () {
    svgedit.setSvgContentAttr(  FV.namespace.xmlns, FV.namespace.uri );
  } );

  exports.save = function() {
    var titleIsSet = ensureDocumentHasTitle();
    if ( titleIsSet ) { //if title is not set then user has canceled the save.
      var svg = prepareSvgDocument();
      var title = svgedit.canvas.getDocumentTitle();
      var filename = title.replace( /[^a-z0-9\.\_\-]+/gi, '_' );
      schematicPersistence.save( {name:filename, schematic:svg}, function () {
        browser.alert( 'File Saved.' );
      } );
    }
  }
  // Bind to svgedit.
  svgedit.setCustomHandlers( { save: exports.save})

  function prepareSvgDocument() {
    ensureSvgBackgroundColorIsBlack();
    var svgStr = getSvgCanvasAsString();
    //Have to convert in string form because altering the viewBox on the live svgcontent will result in a very messed up display.
    //Also this operation is asymmetrical because the import will properly convert viewbox back to dimensions but then the svgedit
    //forgets how the dimensions were set so we convert back to viewBox from height,width here.
    return '<?xml version="1.0"?>\n' + svgStr;
  }

  function getSvgCanvasAsString() {
    // We don't want the grid in the saved file.
    var gridPattern = removeGridPatternFromDefs();
    var svgStr = svgedit.canvas.svgCanvasToString();
    restoreGridPatternInDefs( gridPattern );
    return svgStr;
  }

  function removeGridPatternFromDefs() {
    var defs = svgedit.findDefs();
    if ( !defs )
      return null;
    var defs$ = jquery( defs );
    var gridPattern$ = defs$.children( '#gridpattern' );
    gridPattern$.detach();
    return gridPattern$;
  }

  function restoreGridPatternInDefs( gridPattern$ ) {
    if ( !gridPattern$ )
      return;
    var defs$ = jquery( svgedit.findDefs() );
    defs$.append( gridPattern$ );
    //var zoomLevel = svgedit.canvas.getZoom();
    //svgedit.canvas.runExtensions('zoomChanged', zoomlevel);
  }


  //A bit of a hack but this is the best place to set background-color.
  //If you try to set in <defs><style/></defs> it will affect the entire svg-edit canvas which is undesirable.
  //A future feature should add background color picking to document properties dialog.
  function ensureSvgBackgroundColorIsBlack() {
    jquery( '#svgcontent' ).attr( 'style', 'background-color:black;' );
  }

  function ensureDocumentHasTitle() {
    var title = svgedit.canvas.getDocumentTitle();
    if ( !documentTitleValid( title ) ) {
      var newTitle = browser.prompt( 'What is the name of this document?', '' );
      if ( newTitle == null ) {//implies that user canceled save.
        return false;
      }
      //The only way it out is giving the document a title or canceling, so we need to keep prompting.
      if ( !documentTitleValid( newTitle ) ) {
        return ensureDocumentHasTitle();
      } else {
        svgedit.canvas.setDocumentTitle( newTitle );
        return true;
      }
    }
    //title was okay
    return true;
  }

  function documentTitleValid( title ) {
    return !(typeof title === 'undefined' || title == null || !title.length);
  }


  return exports

}])



/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */

Array.prototype.compareArrays = function(arr) {

  if (this.length != arr.length) return false;
  for (var i = 0; i < arr.length; i++) {
    if (this[i].compareArrays) { //likely nested array
      if (!this[i].compareArrays(arr[i])) return false;
      else continue;
    }
    if (this[i] != arr[i]) return false;
  }
  return true;
}



function FvSelectionObjectFactory( model, jquery) {
  this.model = model
  this.$ = jquery
}


FvSelectionObjectFactory.prototype.parse = function ( element, navLayerActive ) {
  if( !element)
    return null

  var symbol = this.findActualSymbol( element);

  if ( symbol ) {
    return new this.model.SelectedSymbol( symbol, this.$ );
  } else if ( this.$( element ).is( 'line' ) ) {
    return new this.model.SelectedLine( element, this.$ );
  } else if ( navLayerActive && this.isNavigationArea( element, this.$ ) ) {
    return new this.model.NavigationElement( element, this.$ );
  }
  //this object is not interesting;
  return null;
}

FvSelectionObjectFactory.prototype.isNavigationArea = function ( element) {
  if ( element.tagName === 'rect' ||
    element.tagName === 'ellipse' ||
    element.tagName === 'circle' ||
    element.tagName === 'path' ) {
    return true;
  }
  return false;
}

FvSelectionObjectFactory.prototype.findActualSymbol = function ( element) {
  if( !element)
    return null

  var gElementOrSymbol = this.$( element );

  // The list of selected elements from svg-edit could be a list of svg
  // elements or a list of groups, each containing one svg element.
  if ( gElementOrSymbol.is( 'svg.symbol' ) || gElementOrSymbol.is( 'g.point' ) ) {
    return element;
  }

  // If there are multiple symbols inside a group, foundSymbols will have
  // a jQuery selector with multiple symbols. We only want groups with
  // one symbol.
  var foundSymbols = gElementOrSymbol.find( 'svg.symbol' );
  if ( foundSymbols.length == 1 )
    return foundSymbols[0]; else
    return null;
}



function fvHasAtLeastOneElement( opts ) {
  return opts.elems && opts.elems.length > 0 && opts.elems[0]
}



/**
 * if list of selected symbols each contain the exact same set of states then this
 * function will return an array with the names of those states.
 *
 * e.g. if symbol1.states = ['open','closed'] & symbol2.states = ['open','closed'] then commonStates = ['open','closed']
 * However if symbol1.states = ['open','closed'] & symbol2.states = ['open','maintenance'] then commonStates = []
 * @return {Array} The list of commons states.
 */
function fvSelectionState_findCommonStatesForSelectedSymbols( selectedSymbols) {
  var selectedSymbol, index,
      candidateStates = []

  if ( !selectedSymbols.length)
    return []

  //A single candidate state means at least one selected symbol had only a single state and therefore cant be changed,
  //and as a result isn't counted as a commonState.
  for( index = 0; index < selectedSymbols.length; index++) {
    selectedSymbol = selectedSymbols[index]
    // Ignore symbols with 0 or one states.
    if ( !selectedSymbol.hasMultipleStates() )
      continue;

    if ( candidateStates.length === 0 ) {
      // Initialize candidate states.
      candidateStates = selectedSymbol.getStates()
    } else if ( !candidateStates.compareArrays( selectedSymbol.getStates() ) ) {
      // Found a symbol which doesn't share exactly the same states as initial candidate states.
      candidateStates = []
      break
    }

  }
  return candidateStates
}

function fvFindCommonVisibleState( selectedSymbols, defaultCommonState) {
  if( ! selectedSymbols || selectedSymbols.length === 0)
    return defaultCommonState

  // TODO: commonVisibleState is not from all selected symbols, just ones with multiple states.   The first may not even have states.
  var i, symbol,
      commonVisibleState = selectedSymbols[0].getVisibleState()
  for( i = 1; i < selectedSymbols.length; i++) {
    symbol = selectedSymbols[i]
    if ( commonVisibleState !== symbol.getVisibleState() ) {
      commonVisibleState = defaultCommonState
      break
    }
  }
  return commonVisibleState
}
function fvIsSelectionEvent( selectionOpts ) {
  return ! ( !selectionOpts.elems || selectionOpts.elems.length === 0 || (selectionOpts.elems.length == 1 && selectionOpts.elems[0] == null ) )
}


function FvSelectionState( model, jquery, rawSelection, isMultiselected, navLayerIsActive, defaultCommonState) {
  this.model = model
  this.rawSelection = rawSelection
  this.isMultiselected = isMultiselected
  this.selectedSymbols = []
  this.supportsVoltage = []
  this.selectedNavigationElements = []
  this.commonStates = null
  this.commonVisibleState = defaultCommonState
  this.containsSelection = false

  var self = this,
      selectionObjectFactory = new FvSelectionObjectFactory( model, jquery)

  if ( fvHasAtLeastOneElement( this.rawSelection ) ) {
    this.rawSelection.elems.forEach( function( item) {
      var mightBeInteresting = selectionObjectFactory.parse( item, navLayerIsActive )
      if ( mightBeInteresting ) {
        if ( mightBeInteresting.hasVoltage && mightBeInteresting.hasVoltage() ) {
          self.supportsVoltage.push( mightBeInteresting )
        }
        if ( mightBeInteresting instanceof model.SelectedSymbol ) {
          self.selectedSymbols.push( mightBeInteresting )
        }
        if ( mightBeInteresting instanceof model.NavigationElement ) {
          self.selectedNavigationElements.push( mightBeInteresting )
        }
      }

    })
  }


  // If multiple selected symbols each have a different visible state,
  // visibleState is set to STATE_DO_NOT_APPLY. If an operator
  // does not want to update multiple states at once, the select
  // drop-down is set to STATE_DO_NOT_APPLY.

  this.commonStates = fvSelectionState_findCommonStatesForSelectedSymbols( this.selectedSymbols)
  if ( this.commonStates.length > 0 ) {
    this.commonVisibleState = fvFindCommonVisibleState( this.selectedSymbols, defaultCommonState)
  }
  this.containsSelection = fvIsSelectionEvent( this.rawSelection)
}

/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */

/**
 *
 */




angular.module('fisheye.views.selection', ['fisheye.views.core', 'fisheye.views.model']).

factory( 'selectionService', [ 'svgedit', 'model', '$rootScope', 'jquery', '$timeout', function (svgedit, model, $rootScope, jquery, $timeout) {
  'use strict';

  var exports = {
    STATE_DO_NOT_APPLY: 'DO_NOT_APPLY',
    SelectionState: FvSelectionState
  }

  var self = this


  function isNavLayerActive() {
    return svgedit.canvas.getCurrentLayerName() === FV.NAVIGATION_LAYER_NAME
  }



  /**
   * opts.SelectedElement is null or a valid symbol.
   */
  function onCanvasObjectSelectionChanged( selectionOpts ) {
    var selectionState = new FvSelectionState( model, jquery, selectionOpts, selectionOpts.multiselected, isNavLayerActive, exports.STATE_DO_NOT_APPLY)
    fireSelectionEvent( selectionState )
  }

  function fireSelectionEvent( selectionState ) {
    // Don't do this. Use $timeout and it will fire with the next $digest cycle.
    //
    ////If already in phase don't need to apply scope. See angular RootScopeProvider.flagPhase
    ////This is generally the case if this selection was triggered from within an angular controller.
    ////If the selection came from some outside event we need to process the handler in a scope for
    ////bindings to occur.
    //if ( $rootScope.$$phase ) {
    //  $rootScope.$broadcast( 'selectionChanged', selectionState )
    //} else {
    //  $rootScope.$apply( function () {
    //    $rootScope.$broadcast( 'selectionChanged', selectionState )
    //  } )
    //}

    $timeout( function(){
      $rootScope.$broadcast( 'selectionChanged', selectionState )
    })

  }

  function registerWithSvgEdit() {
    return {
      selectedChanged:onCanvasObjectSelectionChanged
    }
  }

  function init() {
    svgedit.editor.addExtension( 'ext-fisheye-selection-service', registerWithSvgEdit )
  }

  init()


  return exports

}])

/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */



/**
 *
 */

angular.module('fisheye.views.svgedit', ['fisheye.views.core']).

factory( 'svgedit', [ '$rootScope', 'jquery', function ($rootScope, jquery) {
  'use strict';

  var exports = {},
      svgCanvas = svgEditor.canvas


  exports.utilities = svgedit.utilities;
  exports.sanitize = svgedit.sanitize;
  exports.history = svgedit.history;

  /* cmd - normal or batch history command */
  exports.addCommandToHistory = function( cmd){
    // Don't add an empty batch command
    if (cmd.type !== exports.history.BatchCommand.type || !cmd.isEmpty())
      svgCanvas.undoMgr.addCommandToHistory(cmd);
  }

  /* text - An optional string visible to user related to this change */
  exports.makeHistoryBatchCommand = function( text){
    return new exports.history.BatchCommand( text);
  }

  exports.setSvgContentAttrNS = function(ns, attr,value){
    jquery('#svgcontent' ).svgdom('setAttrNs',ns,attr,value);
  }

  exports.setSvgContentAttr = function(attr,value){
    jquery('#svgcontent' ).attr(attr,value);
  }

  exports.canvas = {

    bind: function(eventName,callback){
      svgCanvas.bind(eventName,callback);
    },

    setMode: function(mode){
      svgCanvas.setMode(mode);
    },

    getMode: function (){
      return svgCanvas.getMode();
    },

    getCurrentLayer: function(){
      return svgCanvas.getCurrentDrawing().getCurrentLayer();
    },

    getCurrentLayerName: function(){
      return svgCanvas.getCurrentDrawing().getCurrentLayerName();
    },

    /**
     * bypass undo mechanism in svgedit and directly add new layer.
     * @param newLayerName  name of the new layer to add
     */
    createLayerDirectly: function(newLayerName){
      svgCanvas.getCurrentDrawing().createLayer(newLayerName);
    },

    setCurrentLayer: function(layerToSelect){
      svgCanvas.setCurrentLayer(layerToSelect);
    },

    setLayerVisibility: function(layer,visible){
      svgCanvas.setLayerVisibility(layer,visible);
    },

    renameCurrentLayer: function(newName){
      svgCanvas.renameCurrentLayer(newName);
    },

    setCurrentLayerPosition: function(newPosition){
      svgCanvas.setCurrentLayerPosition(newPosition);
    },

    getLayerName: function(position){
      return svgCanvas.getCurrentDrawing().getLayerName(position);
    },

    getNumLayers: function(){
      return svgCanvas.getCurrentDrawing().getNumLayers();
    },

    getZoom: function(){
      return svgCanvas.getZoom();
    },

    selectOnly: function (elems,showGrips){
      svgCanvas.selectOnly(elems,showGrips);
    },

    call: function (event,arg){
      svgCanvas.call(event,arg);
    },

    callChanged: function (){
      var svgcontent = svgCanvas.getContentElem()
      svgCanvas.call('changed',[svgcontent]);
    },

    addUseElementForSymbol: function(symbol,ts){
      return svgCanvas.addUseElementForSymbol(symbol,ts);
    },

    makeSvgElementFromString: function(xmlString){
      return svgCanvas.makeSvgElementFromString(xmlString);
    },

    convertToNum: function(attr,value){
      return svgCanvas.convertToNum(attr,value);
    },

    getDocumentTitle: function(){
      return svgCanvas.getDocumentTitle();
    },
    setDocumentTitle: function(title){
      svgCanvas.setDocumentTitle(title);
    },

    importSvgStringAsSvgElement: function(xmlString, scaleToCanvas){
      svgCanvas.importSvgStringAsSvgElement(xmlString, scaleToCanvas);
    },

    svgCanvasToString: function(){
      return svgCanvas.svgCanvasToString();
    }
  }

  exports.editor = {

    addExtension: function (extname, factoryFunction) {
      svgEditor.addExtension(extname, factoryFunction)
    }

  }

  ////Register for editor events that we want to share with the rest of the application.
  //exports.editor.addExtension( 'ext-svgedit-service', {
  //    elementChanged:function(args){
  //        //there are lots of reasons this event gets triggered and we want to create more meaningful events.
  //        if(args.elems instanceof Array){
  //            if(args.elems.length == 1 &&  jquery(args.elems[0] ).is('svg')){
  //                $rootScope.$broadcast('imageImported') ;
  //            }
  //        }
  //    }
  //} );


  exports.addContextMenu = function(menuItem){
    svgedit.contextmenu.add(menuItem)
  }

  exports.enableContextMenuItems = function(items){
    $('#cmenu_canvas li').enableContextMenuItems(items);
  }

  exports.disableContextMenuItems = function(items){
    $('#cmenu_canvas li').disableContextMenuItems(items);
  }

  exports.addExtension = function(name,extension){
    svgEditor.addExtension(name, extension);
  }

  exports.setCustomHandler = function(customHandler){
    svgEditor.setCustomHandler(customHandler)
  }

  exports.setCustomHandlers = function(handlers){
    svgEditor.setCustomHandlers(handlers);
  }

  exports.loadFromString = function(svg,callback){
    svgEditor.loadFromString(svg,callback);
  }

  exports.findDefs = function(){
    //TODO: can we use svgutils here instead of direct private method access?
    return svgCanvas.getPrivateMethods().findDefs();
  }


  svgCanvas.bind('documentLoaded',function(){
    $rootScope.$broadcast('documentLoaded') ;
  });


  return exports

}])



/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */


/**
 * A table of key/value properties for one piece of equipment.
 */
angular.module('fisheye.views.symbol', ['fisheye.views.svgedit', 'ngResource']).


factory( 'symbolLibrary', ['$resource', function ( $resource ) {
  'use strict';
  return $resource( 'fisheye/data/symbol/:symboluri', {}, {
    query:{method:'GET', params:{query:true}, isArray:true}
  })
}]).

controller('fvAddSymbolController', ['$scope', 'svgedit', 'symbolLibrary',
  function($scope, svgedit, symbolLibrary) {
    'use strict';

    var isDisabled = false,
        debug = true,
        defaultSymbols = [
          { 'name': 'Capacitor', 'uri': 'capacitor'},
          { 'name': 'Circuitbreaker', 'uri': 'circuitbreaker'},
          { 'name': 'Transformer', 'uri': 'transformer'}
        ],
        defaultSymbolSvg = {

          capacitor:
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:tgs="http://www.totalgrid.org" tgs:symbol-type="capacitor" tgs:schematic-type="equipment-symbol" class="symbol" preserveAspectRatio="xMaxYMax">' +
            '<g tgs:state="default" >' +
              '<line x1="10" y1="0" x2="10" y2="15" /><line x1="0" y1="21" x2="20" y2="21" /><line x1="10" y1="21" x2="10" y2="36" />' +
              '<path d="M 0 5 A 5 5 0 0 0 20 5" fill="none"/>' +
            '</g>' +
          '</svg>',

          circuitbreaker:
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:tgs="http://www.totalgrid.org" tgs:symbol-type="circuitbreaker" tgs:schematic-type="equipment-symbol" class="symbol" preserveAspectRatio="xMaxYMax">' +
            '<g tgs:state="open" display="none"><rect x="2" y="2" width="30" height="30" fill="#00FF00" /></g>' +
            '<g tgs:state="closed" ><rect x="2" y="2" width="30" height="30" fill="#A40000" /></g>' +
          '</svg>',

          transformer:
          '<svg xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:tgs="http://www.totalgrid.org" tgs:symbol-type="transformer" tgs:schematic-type="equipment-symbol" class="symbol" preserveAspectRatio="xMaxYMax">' +
            '<g tgs:state="default" >' +
              '<g fill="none" stroke-width="2px" tgs:voltageGroup="high">' +
                '<path d="M 1 0.5 A 5 5 0 0 1 0 14"/> <path d="M 1 14 A 5 5 0 0 1 0 27.5"/> <path d="M 1 27.5 A 5 5 0 0 1 0 41"/> <path d="M 1 41 A 5 5 0 0 1 0 54.5"/> <path d="M 14 0.5 L 14 54.5"/>' +
              '</g>' +
              '<g fill="none" stroke-width="2px" tgs:voltageGroup="low">' +
                '<path d="M 22 0.5 L 22 54.5"/> <path d="M 35 0.5 A 5 5 0 0 0 34 14"/> <path d="M 35 14 A 5 5 0 0 0 34 27.5"/> <path d="M 35 27.5 A 5 5 0 0 0 34 41"/> <path d="M 35 41 A 5 5 0 0 0 34 54.5"/>' +
              '</g>' +
            '</g>' +
          '</svg>'
        }

    $scope.symbols = symbolLibrary.query(
      function() {},
      function() {
        // Error callback. Let's have some defaults for easier testing.
        if( debug)
          $scope.symbols = defaultSymbols
      }
    )
    $scope.symbolFilter = ''

    $scope.placeSymbol = function(symbol) {
      if(isDisabled){
        return;
      }
      var svg = symbolLibrary.get({'symboluri' : symbol.uri}, addSymbolToDocument, addSymbolToDocumentError)
    }

    $scope.$on('navigationModeActivated',function(){
      isDisabled = true
    });

    $scope.$on('navigationModeDeactivated',function(){
      isDisabled = false
    });

    function addSymbolToDocument(result) {
      svgedit.canvas.setMode('select')
      svgedit.canvas.importSvgStringAsSvgElement(result.data)
    }

    function addSymbolToDocumentError(result) {
      if( debug) {
        var slash = result.config.url.lastIndexOf( '/'),
            symbolUri = result.config.url.substr( slash+1)
        svgedit.canvas.setMode('select')
        svgedit.canvas.importSvgStringAsSvgElement(defaultSymbolSvg[symbolUri], false)
      }
    }

  }
]).

directive('fvAddSymbol', function() {
  return {
    restrict:    'E', // Element name
    // The template HTML will replace the directive.
    scope:       true,
    templateUrl: 'fisheye.views.template/symbol/addSymbol.html',
    controller:  'fvAddSymbolController'
  }
})

/**
 * Copyright 2014-2016 Green Energy Corp.
 *
 * Licensed to Green Energy Corp (www.greenenergycorp.com) under one or more
 * contributor license agreements. See the NOTICE file distributed with this
 * work for additional information regarding copyright ownership. Green Energy
 * Corp licenses this file to you under the Apache License, Version 2.0 (the
 * 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 *
 * Author: Flint O'Brien
 */



/**
 *
 */

angular.module('fisheye.views.voltage', ['fisheye.views.core']).

factory( 'voltageService', [ 'browser', 'assets', '$q', function (browser, assets, $q) {
  'use strict';

  var exports = {},
      debug = true,
      defaultVoltagesCSS =
        '.voltage-220k  { stroke-width:1px; stroke:red; }' +
        '.voltage-1v    { stroke-width:1px; stroke:blue; }' +
        '.voltage-10mv  { stroke-width:1px; stroke:yellow; }' +
        '.voltage-22kV  { stroke-width:1px; stroke:#ef2929;  }' +
        '.voltage-7_2kV { stroke-width:1px; stroke:#fce94f; }' +
        '.voltage-277V  { stroke-width:1px; stroke:aqua;  }' +
        '.voltage-240V  { stroke-width:1px; stroke:#729fcf;  }' +
        '.voltage-208V  { stroke-width:1px; stroke:deeppink; }' +
        '.voltage-120V  { stroke-width:1px; stroke:purple;  }'

  //css file should end in voltage.css
  var voltageCssNameRegEx = new RegExp( '^voltage$'),
      voltageRuleNameRegEx = new RegExp( '^.voltage-' )

  var deferredVoltages = $q.defer();
  exports.voltages = deferredVoltages.promise;

  function loadVoltageFromCss() {
    var styleSheets = browser.stylesheets();
    for ( var i = 0; i < styleSheets.length; i++ ) {
      var stylesheet = styleSheets.item( i );
      if ( stylesheet.title && stylesheet.title.match( voltageCssNameRegEx ) ) {
        registerVoltages( stylesheet );
      }
    }
  }

  function registerVoltages( stylesheet ) {
    var registeredVoltages = {};
    for ( var i = 0; i < stylesheet.cssRules.length; i++ ) {
      var cssrule = stylesheet.cssRules.item( i );
      if ( cssrule.selectorText.match( voltageRuleNameRegEx ) ) {
        console.log( 'Registered voltage: ' + cssrule.selectorText );
        registeredVoltages[cssrule.selectorText] = cssrule;
      }
    }
    deferredVoltages.resolve( registeredVoltages );
  }

  function loadCssFromServer( onCssLoaded ) {
    assets.get( 'voltagecss',
      function ( result ) {
        var css = result.data
        //Must insert CSS for it to be available during parsing.
        //TODO: Is there a more direct way of getting a reference to this style element as a StyleSheetList
        //  other than going through the browser? After all we are creating it right here, but jQuery doesn't give us an easy answer.
        browser.addStyleElement( css )
        onCssLoaded()
      },
      function ( result ) {
        if( debug) {
          browser.addStyleElement( defaultVoltagesCSS )
          onCssLoaded()
        }
      }
    )
  }

  loadCssFromServer( loadVoltageFromCss );

  return exports

}]).

filter( 'voltageStyleDisplay', function () {
  return function ( input ) {
    if ( input ) {
      return input.replace( '.voltage-', '' );
    }
  }
}).

filter( 'voltageColorExtractor', function () {
  return function ( voltage ) {
    //voltages are instance of CssRule and voltage.style is an instance of CSSStyleDeclaration
    if ( voltage && voltage.style && voltage.style.getPropertyValue && voltage.style.getPropertyValue( 'stroke' ) ) {
      return voltage.style.getPropertyValue( 'stroke' );
    }
    return'';
  }
})



angular.module("fisheye.views.template/openSchematic/openSchematic.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("fisheye.views.template/openSchematic/openSchematic.html",
    "<div  id=\"open-schematic-dialog\" class=\"ngdialog-message\" title=\"Open Schematic\" style-=\"display: none;\">\n" +
    "    <h3 style=\"margin-top:0; margin-bottom: 0.5em;\">Open Schematic</h3>\n" +
    "    <select id=\"schematic-selector\" size=\"10\" style=\"width: 100%;margin-bottom:1em;\"  ng-multiple=\"true\" ng-options=\"s.name for s in schematics\" ng-model=\"selectedSchematic\"></select>\n" +
    "    <div class=\"ngdialog-buttons\">\n" +
    "        <button type=\"button\" class=\"ngdialog-button ngdialog-button-secondary\" ng-click=\"closeThisDialog('Cancel')\">Cancel</button>\n" +
    "        <button type=\"button\" class=\"ngdialog-button ngdialog-button-primary\" ng-click=\"closeThisDialog(selectedSchematic)\">Open</button>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("fisheye.views.template/property/properties.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("fisheye.views.template/property/properties.html",
    "<div id=\"schematic-properties\" title=\"Edit Properties\"\n" +
    "     class=\"toolpalette\">\n" +
    "    <div class=\"properties-panel-container ui-widget ui-helper-reset ui-corner-top\">\n" +
    "        <h3 tabindex=\"0\" aria-selected=\"true\" aria-expanded=\"true\" role=\"tab\"\n" +
    "            class=\"ui-accordion-header ui-helper-reset ui-state-active ui-corner-top\">\n" +
    "            <div>Properties</div>\n" +
    "        </h3>\n" +
    "        <div class=\"properties-panel-content ui-helper-reset ui-widget-content ui-corner-bottom\" role=\"tab\">\n" +
    "            <form id=\"properties\" name=\"properties\" ng-submit=\"applyPropertiesToSvg()\" ng-show=\"shouldShowProperties\">\n" +
    "                <div id=\"navigationProperties\" ng-show=\"selectedNavigationElements\">\n" +
    "                    <label for=\"properties-nav-uri\">Uri:</label>\n" +
    "                    <input id=\"properties-nav-uri\" ng-model=\"navUri\" ng-change=\"applyNavUri()\"/>\n" +
    "                </div>\n" +
    "                <div id=\"symbolProperties\" ng-show=\"symbolsSelected\">\n" +
    "                    <label for=\"properties-point-name\">Point Name</label>\n" +
    "                    <input id=\"properties-point-name\" ng-model=\"pointName\" ng-change=\"applyPointName()\" ng-disabled=\"isMultiselected\"/>\n" +
    "                    <div id=\"properties-actions\" ng-show=\"isActionable\">\n" +
    "                        <label for=\"properties-action\">Action</label>\n" +
    "                        <select  id=\"properties-action\" ng-model=\"action\" ng-change=\"applyAction()\" ng-options=\"action for action in actions\" ng-disabled=\"! isActionable\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                    <div id=\"properties-states\" ng-show=\"commonStates.states.length>1\">\n" +
    "                        <label >State</label>\n" +
    "                        <select ng-model=\"commonStates.selected\" ng-change=\"applyVisibleState()\"\n" +
    "                                ng-options=\"state for state in commonStates.states\">\n" +
    "                        </select>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div id=\"properties-voltage-levels\" ng-show=\"voltageableItemSelected\">\n" +
    "                    <label >Voltage Levels</label>\n" +
    "                    <div class=\"voltage-group\" ng-repeat=\"group in voltageGroups\">\n" +
    "                        <h3 tabindex=\"0\" aria-selected=\"true\" aria-expanded=\"true\" role=\"tab\"\n" +
    "                            class=\"ui-accordion-header ui-helper-reset ui-state-default ui-corner-top\">\n" +
    "                            <div>{{group}}</div>\n" +
    "                        </h3>\n" +
    "                        <ul class=\"listbox voltages\">\n" +
    "                            <li id=\"voltage{{voltage.selectorText}}\" ng-click=\"applyVoltage(voltage,group)\"\n" +
    "                                ng-repeat=\"voltage in $parent.voltages\" class=\"voltage-list-item\">\n" +
    "                                <div class=\"paint-chip\"\n" +
    "                                     style=\"background-color: {{voltage|voltageColorExtractor}}\"></div>\n" +
    "                                {{voltage.selectorText|voltageStyleDisplay}}\n" +
    "                            </li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("fisheye.views.template/symbol/addSymbol.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("fisheye.views.template/symbol/addSymbol.html",
    "<div id=\"symbollibrary\" title=\"Symbol Library\">\n" +
    "    <div class=\"properties-panel-container ui-widget ui-helper-reset ui-corner-top\">\n" +
    "        <h3 tabindex=\"0\" aria-selected=\"true\" aria-expanded=\"true\" role=\"tab\"\n" +
    "            class=\"ui-accordion-header ui-helper-reset ui-state-active ui-corner-top\">\n" +
    "            <div>Symbol Library</div>\n" +
    "        </h3>\n" +
    "        <div class=\"properties-panel-content ui-helper-reset ui-widget-content ui-corner-bottom\" role=\"tab\">\n" +
    "            <input id=\"symbollibrary-filter-input\" type=\"text\" ng-model=\"symbolFilter\"/>\n" +
    "            <div id=\"symbollist\">\n" +
    "                <ul class=\"listbox symbols\">\n" +
    "                    <li id=\"{{symbol.uri}}\" class=\"symbollibrary-list-item\" ng-click=\"placeSymbol(symbol)\" ng-repeat=\"symbol in symbols | orderBy:'name' | filter:symbolFilter\">{{symbol.name}}</li>\n" +
    "                </ul>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

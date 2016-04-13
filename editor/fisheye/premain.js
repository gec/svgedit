/**
 * This file contains all code that MUST be run immediately on page load and cannot wait until require or angular come to life
 */

function configureConsoleLog(){
    var logMethods = [ 'trace', 'debug', 'log', 'info', 'warn', 'error' ], i;

    if(!window.console){
        window.console = {log:function(args){}}; //noop
    }

    for(i = 0; i < logMethods.length; i++){
        if(!window.console[logMethods[i]]){
            window.console[logMethods[i]]= window.console.log;
        }
    }
}

configureConsoleLog();
//see http://benalman.com/code/projects/javascript-debug/docs/files/ba-debug-js.html#debug.setLevel
console.debug("running fisheye pre-main.");
if (window.svgEditor) {
	svgEditor.setConfig({
		bkgd_color : '#000',
		gridSnapping : true,
		gridColor : "#555",
		showGrid : true,
		initFill : {
			color : 'FFFFFF',
			opacity : 1
		},
		initStroke : {
			color : "FFFFFF",
			width : 1
		},
		noStorageOnLoad: true
	});
}


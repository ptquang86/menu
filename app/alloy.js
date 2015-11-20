/*
(function() {
	
	var displayCaps = Ti.Platform.displayCaps,
		platformWidth = displayCaps.platformWidth,
		platformHeight = displayCaps.platformHeight;
	
	Ti.API.info('ScreenSize: ' + JSON.stringify( [platformWidth, platformHeight] ));
	
	if (OS_ANDROID) {
		var measurement = require('alloy/measurement');
		platformWidth = Math.floor(measurement.pxToDP(platformWidth));
		platformHeight = Math.floor(measurement.pxToDP(platformHeight));
		Ti.API.info('ScreenSize: ' + JSON.stringify( [platformWidth, platformHeight] ));
		Ti.API.info('if ( ScreenSize == ScreenSize scaled ) { Delete the [build] + [Resources] folders and build again. }'); 
	}
	
  	Alloy.Globals.UI = {
  		Win: {
  			Width: platformWidth,
  			Height: platformHeight
  		}
  	};
  	
})();
*/
/*
(function() {
	
	var displayCaps = Ti.Platform.displayCaps,
		platformWidth = displayCaps.platformWidth,
		platformHeight = displayCaps.platformHeight;
	
	Ti.API.info('ScreenSize 1: ' + JSON.stringify( [platformWidth, platformHeight] ));
	
	if (OS_ANDROID) {
		var measurement = require('alloy/measurement');
		platformWidth = Math.floor(measurement.pxToDP(platformWidth));
		platformHeight = Math.floor(measurement.pxToDP(platformHeight));
		
		Ti.API.info('ScreenSize 2: ' + JSON.stringify( [platformWidth, platformHeight] ));
		
		if (platformWidth == displayCaps.platformWidth && platformHeight == displayCaps.platformHeight) {
			Ti.API.error('alloy.js: Delete the [build] + [Resources] folders then build again.');
		}
	}
	
  	Alloy.Globals.UI = {
  		Win: {
  			Width: platformWidth,
  			Height: platformHeight
  		}
  	};
  	
})();
*/
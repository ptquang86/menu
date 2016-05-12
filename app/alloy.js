// /*
(function() {
	
	// var displayCaps = Ti.Platform.displayCaps,
		// platformWidth = displayCaps.platformWidth,
		// platformHeight = displayCaps.platformHeight;
	// Ti.API.info('ScreenSize 1: ' + JSON.stringify( [platformWidth, platformHeight] ));
	// if (OS_ANDROID) {
		// var measurement = require('alloy/measurement');
		// platformWidth = Math.floor(measurement.pxToDP(platformWidth));
		// platformHeight = Math.floor(measurement.pxToDP(platformHeight));
		// Ti.API.info('ScreenSize 2: ' + JSON.stringify( [platformWidth, platformHeight] ));
		// if (platformWidth == displayCaps.platformWidth && platformHeight == displayCaps.platformHeight) {
			// Ti.API.error('alloy.js: Delete the [build] + [Resources] folders then build again.');
		// }
	// }
	
	// var IsScreen320 = false, //  640 × 960
		// IsScreen375 = false, //  750 × 1334
		// IsScreen414 = false; // 1242 × 2208
	// if (platformWidth >= 414) {
		// IsScreen414 = true;
	// } else if (platformWidth >= 375) {
		// IsScreen375 = true;	
	// } else if (platformWidth >= 320) {
		// IsScreen320 = true;
	// }
	
	// var originalWidth = 414;
	// var scaleFactor = (platformWidth / originalWidth).toFixed(1);
	// var ScreenScale = Ti.UI.create2DMatrix().scale(scaleFactor, scaleFactor);
	
  	Alloy.Globals.UI = {
  		// IsScreen320: IsScreen320,
  		// IsScreen375: IsScreen375,
  		// IsScreen414: IsScreen414,
  		// ScreenScale: ScreenScale,
  		// platformWidth: platformWidth,
  		// platformHeight: platformHeight
  	};
  	
  	Ti.API.info('=== Alloy.Globals.UI ' + JSON.stringify( Alloy.Globals.UI ));
  	
})();
// */
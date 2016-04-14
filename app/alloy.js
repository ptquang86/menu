// /*
(function() {
	
	// var displayCaps = Ti.Platform.displayCaps,
		// platformWidth = displayCaps.platformWidth,
		// platformHeight = displayCaps.platformHeight;
	// Ti.API.info('ScreenSize: ' + JSON.stringify( [platformWidth, platformHeight] ));
	// if (OS_ANDROID) {
		// var measurement = require('alloy/measurement');
		// platformWidth = Math.floor(measurement.pxToDP(platformWidth));
		// platformHeight = Math.floor(measurement.pxToDP(platformHeight));
		// Ti.API.info('ScreenSize: ' + JSON.stringify( [platformWidth, platformHeight] ));
		// Ti.API.info('if ( ScreenSize == ScreenSize scaled ) { Delete the [build] + [Resources] folders and build again. }'); 
	// }
	
  	// var originalWidth = 414;
	// var IsScreen320 = false, //  640 × 960
		// IsScreen375 = false, //  750 × 1334
		// IsScreen414 = false, // 1242 × 2208
		// IsScreenBig = false, // > 1242
		// ScreenScale = null;
	// if (platformWidth < originalWidth) {
		// if (platformWidth <= 320) {
			// IsScreen320 = true;
		// } else if (platformWidth <= 375) {
			// IsScreen375 = true;
		// } else if (platformWidth <= 414) {
			// IsScreen414 = true;
		// } else {
			// IsScreenBig = true;
		// }
		// var scaleFactor = (platformWidth / originalWidth).toFixed(1);
		// ScreenScale = Ti.UI.create2DMatrix().scale(scaleFactor, scaleFactor);
	// }
	
  	Alloy.Globals.UI = {
  		// IsScreen320: IsScreen320,
  		// IsScreen375: IsScreen375,
  		// IsScreen414: IsScreen414,
  		// IsScreenBig: IsScreenBig,
  		// ScreenScale: ScreenScale,
  		// Win: {
  			// Short: platformHeight <= 480,
  			// Width: platformWidth,
  			// Height: platformHeight
  		// }
  	};
  	
})();
// */
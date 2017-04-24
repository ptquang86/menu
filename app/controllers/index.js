init();
function init() {
	Ti.UI.setBackgroundColor('#fff');

	//

	var oWindowManager = require('managers/window'),
		winManager = new oWindowManager();

	OS_ANDROID && winManager.on('window:exit', exitConfirm);

	Alloy.Globals.WinManager = winManager;

    // load UI
    if (0) {
    	winManager.load({
	    	url: 'home',
	    	data: {
			 	url: 'home/page',
			 	data: {}
	    	},
	    	reset: true
	    });
    } else {
    	winManager.load({ url: 'login', reset: true });
    }
};

function exitConfirm() {
    // var dialog = Ti.UI.createAlertDialog({
        // cancel : 0,
        // buttonNames : ['NO', 'YES'],
        // title : 'Quit?',
        // message: 'Are you sure?',
    // });
	// dialog.addEventListener('click', function(e) {
		// if (e.index !== e.source.cancel) {
			Alloy.Globals.WinManager.exit();
		// }
	// });
	// dialog.show();
}

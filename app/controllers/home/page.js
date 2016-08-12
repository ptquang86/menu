exports.load = function() {
	// Alloy.Globals.UI.Home.setCenter({
		// url:  'home/notification',
		// data: {}
	// }, false);
	
  	loadMenu();
};

exports.cleanup = function() {
	
};

exports.reload = function() {
	
};

exports.unload = function() {
	
};

function loadMenu() {
  	Alloy.Globals.UI.Home.updateNav({
  		title: '',
  		rightNavButtons: []
  	});
}
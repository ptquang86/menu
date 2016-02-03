exports.init = function() {
	// Alloy.Globals.UI.setCenterWindow({
		// url:  'home/notification',
		// params: {}
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
  	Alloy.Globals.UI.updateNav({
  		title: '',
  		rightNavButtons: []
  	});
}
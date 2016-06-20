/*
 args = {
 	url: 'window url',
 	params: OBJ,
 	leftDrawerWidth: null,
 	classes: 'win nav-visible nav-button nav-title'
 }
 * */
var args = arguments[0],
	classes = args.classes || 'win nav-visible nav-button nav-title', 
	// currentUrl,
	controller;

init();
function init() {
	menuLoad();
}

exports.init = function(cache) {
	menuInit(cache);
};

exports.cleanup = function(e) {
	menuCleanup(e);
};

exports.reload = function(e) {
	menuReload(e);
};

exports.unload = function(e) {
	menuUnload(e);
};

// exports.orientationchange = function(e) {
	// menuOrientationchange(e);
// };

// == MENU

/* TODO: download these widgets + modules
Widget: 
	https://github.com/FokkeZB/nl.fokkezb.drawer
Modules:
 	- iOS: https://github.com/viezel/NappDrawer
 	- Android: https://github.com/manumaticx/Ti.DrawerLayout
*/

exports.getView = function() {
    return getCenterWindow();
};

function menuLoad() {
	// set left window width
	if (args.leftDrawerWidth) {
		$.drawer.setLeftDrawerWidth(args.leftDrawerWidth);
	}
	
	if (OS_ANDROID) {
		// apply styles for window
		var centerWindow = getCenterWindow();
		centerWindow.title = ''; // remove default title
		centerWindow.applyProperties( $.createStyle({ classes: classes }) );
	}
	
	Alloy.Globals.UI.updateNav = updateNav;
	Alloy.Globals.UI.getCenterWindow = getCenterWindow;
	Alloy.Globals.UI.setCenterWindow = setCenterWindow;
	Alloy.Globals.UI.toggleLeftWindow = toggleLeftWindow;
	
	setCenterWindow(args, false);
	setLeftWindow();
}

function menuInit(cache) {
}

function menuCleanup(e) {
  	if (controller && controller.cleanup) {
		controller.cleanup(e);
	}
}

function menuReload(e) {
  	if (controller && controller.reload) {
		controller.reload(e);
	}
}

function menuUnload(e) {
  	if (controller) {
		controller.cleanup && controller.cleanup();
		controller.unload && controller.unload();
		controller = null;
	}
	// Alloy.Globals.UI.toggleLeftWindow = null;
	// Alloy.Globals.UI.getCenterWindow = null;
	// Alloy.Globals.UI.setCenterWindow = null;
	// Alloy.Globals.UI.updateNav = null;
	// Alloy.Globals.UI.Menu = null;
}

function menuOrientationchange(e) {
  	if (controller && controller.orientationchange) {
		controller.orientationchange(e);
	}
}

function setLeftWindow() {
	var menu = Alloy.createController('home/menu');
	
	Alloy.Globals.UI.Menu = {
		reload: menu.reload || function(){},
		update: menu.update || function(data){},
		toggle: menu.toggle || function(visible){}
	};
	
	var left = $.UI.create(OS_IOS ? 'Window' : 'View', { classes: classes });
	left.add( menu.getView() );
	
	$.drawer.setLeftWindow(left);
}

function toggleLeftWindow(e) {
    $.drawer.toggleLeftWindow();
}

function setCenterWindow(params, hideDrawer, closeOtherWindows) {
	if (hideDrawer !== false && $.drawer.isLeftWindowOpen()) {
		toggleLeftWindow();
	}
	
	// if (currentUrl == params.url) { return; }
	// currentUrl = params.url;
	
	menuUnload();

	Ti.API.info('Home: setCenterWindow ' + JSON.stringify( params ));
	
	controller = Alloy.createController(params.url, params.params);
	
	var center;
	if (OS_IOS) {
		center = $.UI.create('Window', { classes: classes });
		center.addEventListener('open', centerWindowReady);
		center.add( controller.getView() );
	} else {
		center = $.UI.create('View', { classes: classes });
		center.addEventListener('postlayout', centerWindowReady);
		center.add( controller.getView() );
	}
	$.drawer.setCenterWindow(center);
	
  	// cleanup children windows
  	if (closeOtherWindows) {
  		var cache = Alloy.Globals.WinManager.getCache();
	  	if (cache.length > 1) {
	  		Alloy.Globals.WinManager.loadPrevious(null, cache.length - 1, false);
	  	}
  	}
}

function getCenterWindow() {
	if (OS_IOS) { 
		return $.drawer.getCenterWindow();
	} else if (OS_ANDROID) {
		return $.drawer.window;
	} else {
		Ti.API.error('error: drawer is not ready!!');
		return null;
	}
}

function centerWindowReady(e) {
  	if (controller) {
  		var center = controller.getView().parent;
  		if (OS_IOS) {
  			center.removeEventListener('open', centerWindowReady);
  		} else {
  			center.removeEventListener('postlayout', centerWindowReady);
  		}
  		controller.init && controller.init();
  	}
}

function updateNav(nav, iosAddMenuButton, androidResetMenuItems, G) {
	if (OS_IOS) {
		if (iosAddMenuButton !== false && nav.leftNavButtons == null) {
			nav.leftNavButtons = [{
				icon: '/images/menu.png',
				callback: toggleLeftWindow
			}];
		}
	} else if (androidResetMenuItems !== false) {
		if (nav.leftNavButtons == null) {
			nav.leftNavButtons = [];
		}
		if (nav.rightNavButtons == null) {
			nav.rightNavButtons = [];
		}
	}
	
	var centerWindow = getCenterWindow();
	if (centerWindow) {
		require('managers/nav').load(centerWindow, nav, G || $);
	} else {
		Ti.API.error('updateNav: drawer is not ready, call updateNav in exports.init !!');
	}
}

function windowDidOpen(e) {
  	Alloy.Globals.UI.Menu.toggle(true);
}

function windowDidClose(e) {
  	Alloy.Globals.UI.Menu.toggle(false);
}
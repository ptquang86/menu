/*
 args = {
 	url: 'window url',
 	params: OBJ
 }
 * */
var args = arguments[0],
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
    return $.drawer.window;
};

function menuLoad() {
  	if (OS_IOS) {
		// hack navigationWindow for window manager
		$.drawer.window.hasNavigationWindow = 'false';
	}
	
	Alloy.Globals.UI.updateNav = updateNav;
	Alloy.Globals.UI.getCenterWindow = getCenterWindow;
	Alloy.Globals.UI.setCenterWindow = setCenterWindow;
	Alloy.Globals.UI.toggleLeftWindow = toggleLeftWindow;
	
	setCenterWindow(args, false);
	setLeftWindow();
}

function menuInit(cache) {
  	if (OS_IOS) {
		// hack navigationWindow for window manager
		cache.navigationWindow = $.drawer.getCenterWindow();
	}
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
		reloadMenu: menu.reload,
		updateMenu: menu.update
	};
	
	var left = $.UI.create(OS_IOS ? 'Window' : 'View', { classes: 'win nav-visible' });
	left.add( menu.getView() );
	
	$.drawer.setLeftWindow(left);
}

function toggleLeftWindow(e) {
    $.drawer.toggleLeftWindow();
}

function setCenterWindow(params, hideDrawer) {
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
		var win = $.UI.create('Window', { classes: 'win nav-visible' });
		win.addEventListener('open', centerWindowReady);
		win.add( controller.getView() );
		center = Ti.UI.iOS.createNavigationWindow({ window: win });
		
		// hack navigationWindow for window manager
		var cache = Alloy.Globals.WinManager.getCache(0); // page home
		cache && (cache.navigationWindow = center);
	} else {
		center = $.UI.create('View', { classes: 'win nav-visible' });
		center.addEventListener('postlayout', centerWindowReady);
		center.add( controller.getView() );
	}
	
	$.drawer.setCenterWindow(center);
	
  	// cleanup children windows
  	var cache = Alloy.Globals.WinManager.getCache();
  	if (cache.length > 1) {
  		Alloy.Globals.WinManager.loadPrevious(null, cache.length - 1, false);
  	}
}

function getCenterWindow() {
	var drawer = OS_IOS ? $.drawer.getCenterWindow() : $.drawer;
	if (drawer) { 
		return drawer.window;
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

function updateNav(nav) {
	// if (OS_IOS && (!nav.leftNavButton || !nav.leftNavButtons)) {
		// nav.leftNavButtons = [{
			// icon: '/images/menu.png',
			// callback: toggleLeftWindow
		// }];
	// }
	
	var centerWindow = getCenterWindow();
	if (centerWindow) {
		require('managers/nav').load(centerWindow, nav);
	} else {
		Ti.API.error('updateNav: drawer is not ready, call updateNav in exports.init !!');
	}
}


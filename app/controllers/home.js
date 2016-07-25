/* Download these modules:
 	- iOS: https://github.com/viezel/NappDrawer
 	- Android: https://github.com/manumaticx/Ti.DrawerLayout
* */

/*
 Changes log:
 - 22/07/16
 	+ Remove the use of widget nl.fokkezb.drawer
 	+ Add [config] parameter
 	+ Remove [leftDrawerWidth] parameter, use [config] parameter instead
 	+ Deprecate [params] parameter
 	+ Add [data] parameter to replace [params] parameter
 	+ Removed [Alloy.Globals.UI.getCenterWindow]
 	+ Deprecate [Alloy.Globals.UI.setCenterWindow]
 	+ Add [Alloy.Globals.UI.Home.setCenter] to replace [Alloy.Globals.UI.setCenterWindow] function
 	+ Deprecate [Alloy.Globals.UI.toggleLeftWindow]
 	+ Add [Alloy.Globals.UI.Home.toggleLeft] to replace [Alloy.Globals.UI.toggleLeftWindow] function
 	+ Deprecate [Alloy.Globals.UI.updateNav]
 	+ Add [Alloy.Globals.UI.Home.updateNav] to replace [Alloy.Globals.UI.updateNav] function
 	+ Removed [Alloy.Globals.UI.Menu.toggle]
 	+ Add [events] parameter to replace [Alloy.Globals.UI.Menu.toggle]
 * */

/*
 args = {
 	url: 'window url',
 	data: {},
 	classes: 'win nav-visible nav-button nav-title',
 	config: {},
 	events: {}
 }
 * */
var args = arguments[0],
	// currentUrl,
	controller;

init();
function init() {
	// TODO: Deprecate
	if (args.params) {
		Ti.API.error('Home: [params] parameter is deprecated.\nPlease use [data] parameter instead.');
		args.data = args.params;
	}
	Alloy.Globals.UI.updateNav = function(nav, iosAddMenuButton, androidResetMenuItems, G) {
		Ti.API.error('Home: [Alloy.Globals.UI.updateNav] is deprecated.\nPlease use [Alloy.Globals.UI.Home.updateNav] instead.');
		updateNav(nav, iosAddMenuButton, androidResetMenuItems, G);
	};
	Alloy.Globals.UI.getCenterWindow = function() {
		Ti.API.error('Home: [Alloy.Globals.UI.getCenterWindow] is removed.');
	};
	Alloy.Globals.UI.setCenterWindow = function(params, hideDrawer, closeOtherWindows) {
		Ti.API.error('Home: [Alloy.Globals.UI.setCenterWindow] is deprecated.\nPlease use [Alloy.Globals.UI.Home.setCenter] instead.');
		setCenter(params, hideDrawer, closeOtherWindows);
	};
	Alloy.Globals.UI.toggleLeftWindow = function() {
		Ti.API.error('Home: [Alloy.Globals.UI.toggleLeftWindow] is deprecated.\nPlease use [Alloy.Globals.UI.Home.toggleLeft] instead.');
		toggleLeft();
	};
	
	if (args.classes == null) {
		args.classes = 'win nav-visible nav-button nav-title';
	}
	
	if (OS_IOS) {
		
	} else {
		$.win.applyProperties( $.createStyle({ classes: args.classes }) );
		args.classes = null;
	}
	
	var config = args.config;
	if (config) {
		var module;
		if (OS_IOS) {
			module = require('dk.napp.drawer');
		} else {
			module = require('com.tripvi.drawerlayout');
		}
		for (var prop in config) {
			var func = 'set' + prop.charAt(0).toUpperCase() + prop.substr(1);
			if (typeof $.drawer[func] == 'function') {
				var value = config[prop];
				$.drawer[func]( typeof value != 'string' ? value : module[value] );
			} else {
				Ti.API.error('Home: prop [' + prop + '] - func [' + func + '] is not exists.');
			}
		}
		args.config = null;
	}
	
	var events = args.events;
	if (events) {
		for (var ev in events) {
			$.drawer.addEventListener(ev, events[ev]);
		}
		args.events = null;
	}
	
	setCenter(args, false);
	args.url = null;
	args.data = null;
	
	setLeft();
	
	Alloy.Globals.UI.Home = {
		toggleLeft: toggleLeft,
		setCenter: setCenter,
		updateNav: updateNav
	};
}

exports.load = function(cache) {};

exports.cleanup = function(e) {
	cleanupCenter(e);
};

exports.reload = function(e) {
	reloadCenter(e);
};

exports.unload = function(e) {
	unloadCenter(e);
	unloadLeft(e);
	
	Alloy.Globals.UI.Home = null;
};

exports.orientationchange = function(e) {
	orientationchangeCenter(e);
};

function getView() {
  	return OS_IOS ? controller.getView().parent : $.win;
}
exports.getView = getView;

OS_IOS && (exports.getNavigationWindow = function() {
    return $.drawer.getCenterWindow();
});

exports.doShow = function(params, win) {
	if (OS_IOS) {
		$.drawer.open(params.openAnimation);
	} else {
		$.win.open(params.openAnimation);
	}
};

exports.doHide = function(params, win) {
	if (OS_IOS) {
		$.drawer.close(params.closeAnimation);
	} else {
		$.win.close(params.closeAnimation);
	}
};

// == LEFT

function setLeft() {
	var menu = Alloy.createController('home/menu');
	
	Alloy.Globals.UI.Menu = {
		reload: menu.reload || function(){},
		update: menu.update || function(data){},
		toggle: menu.toggle || function(visible){
			Ti.API.error('Home: [Alloy.Globals.UI.Menu.toggle] is removed.\nPlease use [events] params instead.');
		}
	};
	
	if (OS_IOS) {
		var left = $.UI.create('Window');
			left.add( menu.getView() );
		$.drawer.setLeftWindow(left);
	} else {
		$.drawer.setLeftView( menu.getView() );
	}
}

function toggleLeft() {
	$.drawer.toggleLeftWindow();
}

function unloadLeft(e) {
  	Alloy.Globals.UI.Menu = null;
}

// == CENTER

function cleanupCenter(e) {
  	if (controller && controller.cleanup) {
  		controller._alreadyCleanup = true;
		controller.cleanup(e);
	}
}

function reloadCenter(e) {
  	if (controller && controller.reload) {
  		controller._alreadyCleanup = false;
		controller.reload(e);
	}
}

function unloadCenter(e) {
  	if (controller) {
		controller._alreadyCleanup !== true && controller.cleanup && controller.cleanup();
		controller.unload && controller.unload();
		// controller = null; // TODO: this cause conflict with Win Manager - winDestroy, controller.getView() is null 
	}
}

function orientationchangeCenter(e) {
  	if (controller && controller.orientationchange) {
		controller.orientationchange(e);
	}
}

function setCenter(params, hideDrawer, closeOtherWindows) {
	if (hideDrawer !== false) {
		if ( $.drawer[OS_IOS ? 'isLeftWindowOpen' : 'getIsLeftDrawerOpen']() ) {
			toggleLeft();
		}
	}
	
	// if (currentUrl == params.url) { return; }
	// currentUrl = params.url;
	
	unloadCenter();

	Ti.API.info('Home: setCenter ' + JSON.stringify( params ));
	
	if (params.params) {
		Ti.API.error('Home: [params] parameter is deprecated.\nPlease use [data] parameter instead.');
		params.data = params.params;
	}
	
	controller = Alloy.createController(params.url, params.data);
	
	if (OS_IOS) {
		var win = $.UI.create('Window', { classes: args.classes });
		win.addEventListener('open', centerReady);
		win.add( controller.getView() );
		var center = Ti.UI.iOS.createNavigationWindow({ window: win });
		$.drawer.setCenterWindow(center);
	} else {
		var center = controller.getView();
		center.addEventListener('postlayout', centerReady);
		$.drawer.setCenterView(center);
	}
	
  	// cleanup children windows
  	if (closeOtherWindows) {
  		var cache = Alloy.Globals.WinManager.getCache();
	  	if (cache.length > 1) {
	  		Alloy.Globals.WinManager.loadPrevious(null, cache.length - 1, false);
	  	}
  	}
}

function centerReady(e) {
  	if (controller) {
  		this.removeEventListener(OS_IOS ? 'open' : 'postlayout', centerReady);
  		controller.load && controller.load();
  	}
}

function updateNav(nav, iosAddMenuButton, androidResetMenuItems, G) {
	if (OS_IOS) {
		if (iosAddMenuButton !== false && nav.leftNavButtons == null) {
			nav.leftNavButtons = [{
				icon: '/images/menu.png',
				callback: toggleLeft
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
	
	require('managers/nav').load(getView(), nav, G || $);
}

/* Download this module:
 	- iOS: https://github.com/viezel/NappDrawer
* */

/*
WARNING: NAVIGATION BAR MAY COVER THE WINDOW CONTENT IF
- DO NOT TOGGLE THE STATUS BAR
- DO NOT SHOW FULLSCREEN WINDOW IF THE OTHERS IS NOT FULLSCREEN
*/

/*
 Changes log:
 - 14/09/2017
    + Remove Ti.DrawerLayout module - https://github.com/manumaticx/Ti.DrawerLayout
	+ Use [Titanium.UI.Android.DrawerLayout] to replace [Ti.DrawerLayout] module
	+ Required Titanium SDK 6.2.0
 - 18/08/2017
 	+ add custom function fireControllerEvent
 - 02/06/2017
 	+ add Alloy.Globals.UI.Home.toggleMenuButton
 - 15/08/16
 	+ Lazy load Left Window
 	+ Deprecate [Alloy.Globals.UI.Menu.reload]
 	+ Add [Alloy.Globals.UI.Menu.load] to replace [Alloy.Globals.UI.Menu.reload] function
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
	+ We have to call [Alloy.Globals.UI.Home.updateNav] manually
 	+ Removed [Alloy.Globals.UI.Menu.toggle]
 	+ Add [events] parameter to replace [Alloy.Globals.UI.Menu.toggle]
 * */

/*
 args = {
 	url: 'window url',
 	data: {},
 	classes: 'win nav-visible nav-button nav-title',
 	config: OS_IOS ? 
		// https://github.com/viezel/NappDrawer/tree/master/ios#api-properties
		{
			animationMode: 'ANIMATION_SLIDE',
			animationVelocity: 400,
			centerHiddenInteractionMode: 'OPEN_CENTER_MODE_FULL',
			closeDrawerGestureMode: 'CLOSE_MODE_ALL',
			leftDrawerWidth: 160,
			openDrawerGestureMode: 'OPEN_MODE_NONE',
			orientationModes: [Ti.UI.PORTRAIT, Ti.UI.UPSIDE_PORTRAIT],
			rightDrawerWidth: 160,
			shouldStretchDrawer: true,
			showShadow: false,
			statusBarStyle: 'STATUSBAR_WHITE'
		} : 
		// https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.Android.DrawerLayout
		{
			drawerIndicatorEnabled: true,
			drawerLockMode: 'LOCK_MODE_UNDEFINED',
			leftWidth: 160,
			rightWidth: 160,
			toolbarEnabled: true
		},
 	events: OS_IOS ?
		// https://github.com/viezel/NappDrawer/tree/master/ios#events
		{
			windowDidOpen: function(e){},
			windowDidClose: function(e){}
		} : 
		// https://docs.appcelerator.com/platform/latest/#!/api/Titanium.UI.Android.DrawerLayout
		null
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
			module = $.drawer;
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

	Alloy.Globals.UI.Home = {
		isLeftOpen: isLeftOpen,
		toggleLeft: toggleLeft,
		getView: getView,
		setCenter: setCenter,
		updateNav: updateNav,
		toggleMenuButton: toggleMenuButton
	};

	setCenter(args, false);
	args.url = null;
	args.data = null;

	setLeft();
}

exports.load = function(cache) {};

exports.cleanup = function(e) {
	return cleanupCenter(e);
};

exports.reload = function(e) {
	return reloadCenter(e);
};

exports.fireControllerEvent = function(nameFunc, params) {
    if (controller && controller[nameFunc]) {
        return controller[nameFunc](params);
    }
};

exports.unload = function(e) {
	unloadLeft(e);
	unloadCenter(e);

	// comment this to prevent undefined call
	// Alloy.Globals.UI.Home = null;
};

exports.orientationchange = function(e) {
	return orientationchangeCenter(e);
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
		return $.drawer.open(params.openAnimation);
	} else {
		return $.win.open(params.openAnimation);
	}
};

exports.doHide = function(params, win) {
	if (OS_IOS) {
		return $.drawer.close(params.closeAnimation);
	} else {
		return $.win.close(params.closeAnimation);
	}
};

exports.androidback = function(e) {
    if ( $.drawer.getIsLeftOpen() ) {
    	$.drawer.closeLeft();
    	return false;
    } else {
		return backCenter(e);
	}
};

// == LEFT

function setLeft() {
	var menu = Alloy.createController('home/menu');

	Alloy.Globals.UI.Menu = {
		load: menu.load || function(force){},
		unload: menu.unload || function(){},
		reload: function(){
			Ti.API.error('Home: [Alloy.Globals.UI.Menu.reload] is removed.\nPlease use [Alloy.Globals.UI.Menu.load] instead.');
		},
		update: menu.update || function(data){},
		toggle: function(visible){
			Ti.API.error('Home: [Alloy.Globals.UI.Menu.toggle] is removed.\nPlease use [events] params instead.');
		}
	};

	if (OS_IOS) {
		var left = $.UI.create('Window', { classes: args.classes });
			left.add( menu.getView() );
		return $.drawer.setLeftWindow(left);
	} else {
		return $.drawer.setLeftView( menu.getView() );
	}
}

var isLeftLoaded = false;

function toggleLeft() {
	if (OS_IOS) {
		$.drawer.toggleLeftWindow();
	} else {
		$.drawer.toggleLeft();
	}

	// lazy load left window
	if (!isLeftLoaded) {
		isLeftLoaded = true;
		return setTimeout(function() {
			return Alloy.Globals.UI.Menu.load(false);
		}, 0);
	}
}

function unloadLeft(e) {
	Alloy.Globals.UI.Menu.unload();

	// comment this to prevent undefined call
  	// Alloy.Globals.UI.Menu = null;
}

function isLeftOpen() {
	if (OS_IOS) {
		return $.drawer.isLeftWindowOpen();
	} else {
		return $.drawer.getIsLeftOpen();
	}
}

// == CENTER

function cleanupCenter(e) {
  	if (controller && controller.cleanup) {
  		controller._alreadyCleanup = true;
		return controller.cleanup(e);
	}
}

function reloadCenter(e) {
  	if (controller && controller.reload) {
  		controller._alreadyCleanup = false;
		return controller.reload(e);
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
		return controller.orientationchange(e);
	}
}

function backCenter(e) {
  	if (controller && controller.androidback) {
		return controller.androidback(e);
	}
}

function setCenter(params, hideDrawer, closeOtherWindows) {
	if (hideDrawer !== false) {
		if ( $.drawer[OS_IOS ? 'isLeftWindowOpen' : 'getIsLeftOpen']() ) {
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

	if (params.data == null) { params.data = {}; }
	if (params.data.isHomePage == null) { params.data.isHomePage = true; }

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
  		if (controller.load) {
  			return controller.load();
  		}
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

	return require('managers/nav').load(getView(), nav, G || $);
}

function toggleMenuButton(visible) {
	if (OS_IOS) {

	} else {
		$.drawer.setDrawerIndicatorEnabled(visible);
	}
}

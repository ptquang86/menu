init();

init();
function init() {
  	toggleAI(true);
}

function toggleAI(visible) {
  	if (visible) {
		$.ai.height = Titanium.UI.SIZE;
		$.ai.top = 153;
		$.ai.show();
	} else {
		$.ai.hide();
		$.ai.height = 0;
		$.ai.top = 0;
	}
}

var isLeftLoaded = false;

// one section
exports.load = function(force) {
    if (force === false && isLeftLoaded === true) { return; }
    isLeftLoaded = true;
    
   	var items = [
  		{ properties: { itemId: 'home/page' }, title: { text: 'Test page' }, icon: { image: '/images/menu/timeline.png' } },
  	];
  	
  	$.lv.sections = [ Ti.UI.createListSection({ items: items }) ];
  	
  	toggleAI(false);
};

/*
// multiple sections
exports.load = function(force) {
    if (force === false && isLeftLoaded === true) { return; }
    isLeftLoaded = true;
    
   	var menu = [
		{ 
			headerTitle: 'Account', 
			items: [
				{ itemId: 'home/page', title: 'Test page', image: '/images/menu/timeline.png' }
			] 
		}
	];
	
	var sections = [];
	for(var i=0,ii=menu.length; i<ii; i++){
	  	var section = menu[i],
	  		items = section.items,
	  		sectionItems = [];
	  	
	  	for(var j=0,jj=items.length; j<jj; j++){
			var item = items[j];
			sectionItems.push({ properties: { itemId: item.itemId }, title: { text: item.title }, icon: { image: item.image } });
		};
	  	
	  	sections.push( Ti.UI.createListSection({
	  		headerView: Alloy.createController('home/menu_header', { headerTitle: section.headerTitle }),
	  		items: sectionItems
	  	}) );
	};
	
  	$.lv.sections = sections;
  	
  	toggleAI(false);
};
*/

/*
 params = {
 	sectionIndex: 0,
 	index: 0,
 	title: ''
 }
 * */
exports.update = function(params) {
	var section = $.lv.sections[params.sectionIndex || 0],
		item = section.getItemAt( params.index );
	
	if (params.title) {
		item.title.text = params.title;
	}
		
	section.updateItemAt(params.index, item, { animated: false });	
};

function menuClick(e) {
	var url = e.itemId;
	
	switch (url) {
		// case 'newsletter':
			// Ti.Platform.openURL('');
			// Alloy.Globals.UI.Home.toggleLeft();
			// break;
			
		default:
			// var item = e.section.getItemAt(e.itemIndex);
		  	Alloy.Globals.UI.Home.setCenter({
	  			url: url,
	  			// data: null
	  		});
			break;		
	}
}

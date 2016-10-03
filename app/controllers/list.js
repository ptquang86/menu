var items = [];

for (var i = 0, ii = 10; i < ii; i++) {
	items.push({
		avatar: { image: 'http://res.vtc.vn/media/vtcnews/2012/12/06/avatar.jpg' },
		title: { text: 'title' },
		subtitle: { text: 'subtitle' }
	});
}

$.lv.sections = [ Ti.UI.createListSection({ items: items }) ];
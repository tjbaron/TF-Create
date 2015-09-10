
var dom = require('tfdom');
var statemanagerinstance = require('../statemanagerinstance');
var sm = null;

var isActive = false;

module.exports = function(prop) {
	sm = statemanagerinstance()
	sm.setState('popover');
	dom.get('popover').onclick = close;
	var c = dom.get('popoverContainer');
	c.innerHTML = '';
	
	dom.create('div', {
		parent: c,
		style: 'position: relative; color: white;',
		innerText: 'Equation'
	});
	dom.create('input', {
		parent: c,
		style: 'position: relative; width: 100%; padding: 5px; box-sizing: border-box;',
		placeholder: 'Equation'
	});

	c.style.height = '50px';
	isActive = true;
};

dom.on(document.body, 'keyup', function(e) {
	if (!isActive) return;
	if (e.keyCode === 13) {
		close();
	}
});

function close() {
	sm.setState('project');
	isActive = false;
}

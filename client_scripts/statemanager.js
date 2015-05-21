/*	# State Manager Script

	This is used to transition our UI between states. Some more
	complex transitions include multiple CSS transitions, so they
	must be manually timed here.

	Note that this script does not deal with the procedural generation
	of any DOM elements. It simply calls CSS transitions on our core
	DOM elements to do major view changes.
*/

var dom = require('tfdom');

var cmds = {};
var currentState = '';
var visibleItems = [];
var defaults = null;
var states = null;
var flows = null;
var flowstack = [];

/*	## State Manager
	@param domDefaults The default values for each css parameter that is manipulated.
	@param domStates All the states we can want the DOM to have at any point in time.
		Note that we only need to define non-default css parameters on objects that
		will be visible.
	@param stateFlows Any non-direct state transitions. For example, if you have to go
		through state 2 to get from state 1 to state 3.
*/
function initManager(domDefaults, domStates, stateFlows) {
	defaults = domDefaults;
	states = domStates;
	flows = stateFlows;

	for (var e in defaults) {
		var ele = dom.get(e);
		ele.style.display = 'none';
	}

	return cmds;
}

function doState() {
	var stateName = flowstack.shift();
	for (var i=0; i<visibleItems.length; i++) {
		(function(nm) {
			if (!states[stateName][nm]) {
				var ele = dom.get(nm);
				var cssValues = defaults[nm];
				for (var c in cssValues) {
					ele.style[c] = cssValues[c].default;
				}
				setTimeout(function() {
					ele.style.display = 'none';
				}, 1000);
			}
		})(visibleItems[i]);
	}
	visibleItems = [];
	for (var e in states[stateName]) {
		if (e === 'waittime') continue;
		(function(e, cssValues) {
			var ele = dom.get(e);
			visibleItems.push(e);
			ele.style.display = 'inline-block';
			setTimeout(function() {
				// If no value is defined for this css property in this state use default.
				var def = defaults[e];
				for (var c in def) {
					if (!cssValues[c]) ele.style[c] = def[c].default;
				}
				// Otherwise use the defined css value for this state.
				for (var c in cssValues) {
					ele.style[c] = cssValues[c];
				}
			}, 50);
		})(e, states[stateName][e]);
	}
	var wait = states[stateName].waittime;
	setTimeout(function() {
		if (flowstack.length > 0) doState();
	}, wait ? wait*1000 : 1000);
	currentState = stateName;
}

var setQueue = null;
cmds.setState = function(stateName) {
	if (setQueue) {
		clearTimeout(setQueue);
		setQueue = null;
	}
	setTimeout(function() {
		setQueue = null;
		// Get a list of all the states to transition through.
		var flow = currentState+'-'+stateName;
		if (flows[flow]) flowstack = flows[flow].concat([stateName]);
		else flowstack = [stateName];
		doState();
		if (changeCallback) changeCallback(stateName);
	}, 1);
};

cmds.getState = function() {
	return currentState;
};

changeCallback = null;
cmds.onChange = function(callback) {
	changeCallback = callback;
};

module.exports = initManager;

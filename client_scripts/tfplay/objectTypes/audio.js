
var dom = require('tfdom');

exports.setup = function(utils) {
	this.player = new Audio();

	(function(that) {
		Object.defineProperty(that.properties, 'src', {
			set: function(x) {
				that.player.src = x;
				that.player.onplay = function() {
					console.log('playing');
					var audioCtx = new webkitAudioContext();
					that.analyser = audioCtx.createAnalyser();
					var source = audioCtx.createMediaElementSource(that.player);
					source.connect(that.analyser);
				};
				that.player.play();
			},
			get: function() {
				return '{{Audio File}}';
			},
			enumerable: true
		});
		Object.defineProperty(that.properties, 'playing', {
			set: function(x) {
				if (x === 'true') {
					that.player.play();
				} else {
					that.player.pause();
				}
				that.playing = x;
			},
			get: function() {
				return that.playing;
			},
			enumerable: true
		});
	})(this);
}

exports.draw = function(ctx) {
	if (!this.analyser) return;
	var dataArray = new Float32Array(this.analyser.fftSize);
	this.analyser.getByteTimeDomainData(dataArray);
	for (var i=0; i<dataArray.length; i++) {
		console.log(dataArray[i]);
		ctx.fillRect(i*5,0,dataArray[i],5);
	}
}

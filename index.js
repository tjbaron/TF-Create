#! /usr/bin/env node

var http = require('http');
var connect = require('connect')();
var connectStatic = require('connect-static');
var browserify = require('browserify-middleware');
var tfcss = require('tfcss');
var async = require('async');

var options = {
	dir: 'www',
	aliases: [
		['/', '/index.html'],
	],
};

var css = '';

function loadAssets() {
	async.parallel([
		function(cb) {
			connectStatic(options, cb);
		},
		function(cb) {
			tfcss.bundle('client_styles/config.json', cb);
		}
	], startServer);
}

function startServer(err, res) {
	var staticFiles = res[0];
	css = res[1];

	connect.use('/', staticFiles);
	connect.use('/bundle.js', browserify('client_scripts/index.js', process.env.DYNO ? browserify.settings.production : browserify.settings.development));
	connect.use('/bundle.css', sendCSS);
	connect.use('/hue/updateLight', updateLight);

	var app = http.createServer(connect);
	app.listen(process.env.PORT ? Number(process.env.PORT) : 8888);
}

function sendCSS(req, resp) {
	resp.writeHead(200, {'Content-Type': 'text/css'});
	resp.end(css);
}

function updateLight(req, resp) {
	req.setEncoding('utf8');
	req.on("data", function(chunk) {
		var nr = http.request({
			hostname: '10.0.1.2',
			port: 80,
			path: '/api/thomasbaron/lights/4/state',
			method: 'PUT'
		});
		nr.write(chunk);
		nr.end();

		resp.writeHead(200, {'Content-Type': 'text/plain'});
		resp.end('OK');
	});
}

loadAssets();

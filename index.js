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

	var app = http.createServer(connect);
	app.listen(process.env.PORT ? Number(process.env.PORT) : 8888);
}

function sendCSS(req, resp) {
	resp.writeHead(200, {'Content-Type': 'text/css'});
	resp.end(css);
}

loadAssets();

#! /usr/bin/env node

var http = require('http');
var connect = require('connect')();
var connectStatic = require('connect-static');
var browserify = require('browserify-middleware');
var tfcss = require('tfcss');

var app = http.createServer(connect);

var options = {
	dir: 'www',
	aliases: [
		['/', '/index.html'],
	],
};
connectStatic(options, function(err, res) {
	tfcss.bundle('client_styles/config.json', function(err, css) {
		connect.use('/', res);
		connect.use('/bundle.js', browserify('client_scripts/index.js', process.env.DYNO ? browserify.settings.production : browserify.settings.development));
		connect.use('/bundle.css', function(req, resp) {
			resp.writeHead(200, {'Content-Type': 'text/css'});
			resp.end(css);
		});
	});
});

app.listen(process.env.PORT ? Number(process.env.PORT) : 8888);

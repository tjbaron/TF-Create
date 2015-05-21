#! /usr/bin/env node

var fileserver = require('tffileserver');

var server = fileserver.init(null, './www');

fileserver.compileJavascript('./client_scripts/index.js', '/bundle.js', true, true);
fileserver.compileCSS('./client_styles/config.json', '/bundle.css', true);

server.listen(process.env.PORT ? Number(process.env.PORT) : 8888);

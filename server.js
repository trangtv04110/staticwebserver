"use strict";
const http = require('http');
const fs = require('fs');
const url = require('url');

function htmlEscape(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

function writeFile(res, path) {
	let extension = path.split('.').pop().toLowerCase();
	var contentType;
	var viewClass;
	switch(extension) {
		case 'js':
			contentType = 'text/javascript';
			viewClass = 'javascript';
			break;
		case 'htm':
		case 'html':
			contentType = 'text/html';
			viewClass = 'html';
			break;
		case 'jpg':
		case 'jpeg':
			contentType = 'image/jpeg';
			break;
		case 'png':
			contentType = 'image/png';
			break;
		case 'css':
			contentType = 'text/css';
			viewClass = 'css';
			break;
		default:
			contentType = 'unknown';
			res.end();
			return;
	}

	if(viewClass && !path.includes('lib')) {
		contentType = 'text/html';
		res.writeHead(200, {'Content-Type': contentType});
		res.write('<pre><code class="' + viewClass + '">');
	} else {
		res.writeHead(200, {'Content-Type': contentType});
	}

	fs.readFile('.' + path, function (err, data) {
		if (err) throw err;
		if(viewClass && !path.includes('lib')) {
			data = htmlEscape(data);
			res.write(data);
			res.write('</code></pre><link rel="stylesheet" type="text/css" href="lib/monokai_sublime.css"><script type="text/javascript" src="http://code.jquery.com/jquery-2.1.4.min.js"></script><script type="text/javascript" src="lib/highlight.pack.js"></script><script type="text/javascript">$(document).ready(function() {$("pre code").each(function(i, block) {hljs.configure({tabReplace: "    "});hljs.highlightBlock(block);});});</script>');
			res.end();
			return;
		}
		res.write(data);
		res.end();
	});
}

function handleGETrequest(res, url_parsed) {
	let path = url_parsed.pathname;
	switch(path) {
		case '/':
			res.writeHead(200, {'Content-Type': 'text/html'});
			fs.readdir('.', function(err, files){
				for (var i=0; i < files.length; i++){
					res.write('<a href="/' + files[i] + '">' + files[i] + '</a></br>');
				}
				res.end();
			});
			break;
		default:
			if(path.includes('.')) {
				writeFile(res, path);
			}
			break;
	}
}

const server = http.createServer();
server.on('request', function(req, res) {
	if(req.method === 'GET') {
		handleGETrequest(res, url.parse(req.url, true));
	}
});

var port = 3000;
server.listen(port);
console.log('Server running at http://localhost:3000');
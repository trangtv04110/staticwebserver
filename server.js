"use strict";
const http = require('http');
const fs = require('fs');
const url = require('url');

function writeFile(res, path) {
	let extension = path.split('.').pop().toLowerCase();
	var contentType;
	switch(extension) {
		case 'js':
			contentType = 'text/javascript';
			break;
		case 'htm':
		case 'html':
			contentType = 'text/html';
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
			break;
		default:
			contentType = 'unknown';
			res.end();
			return;
	}
	res.writeHead(200, {'Content-Type': contentType});

	let stream = fs.createReadStream('.' + path);
	stream.on('open', function() {
		stream.pipe(res);
	});

	stream.on('end', function() {
	});

	stream.on('error', function(err) {
		console.log('Error at: .' + path);
		res.end(err);
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
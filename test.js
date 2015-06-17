const server = http.createServer();
server.on('request', function(req, res) {
	if(req.method === 'GET') {
		handleGETrequest(res, url.parse(req.url, true));
	}
});

var port = 3000;
server.listen(port);
console.log('Server running at http://localhost:3000');
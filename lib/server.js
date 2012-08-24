(function(){
	"use strict";

	var pkg = require('./../package.json'),
		http = require('http'),
		url = require('url'),
		request = require('request'),
		nodeStatic = require('node-static'),
		socketIO = require('socket.io'),
		
		fileServer = new(nodeStatic.Server)('.'),

		server = http.createServer(function (req, res) {
			if (req.url.indexOf('/db') === 0) {

				var dbUrl = url.format({
					protocol	: pkg.couch.protocol,
					hostname	: pkg.couch.hostname,
					port		: pkg.couch.port,
					pathname	: req.url.replace(/^\/(db)/, 'test1')
				});
				
				request({
					url: dbUrl,
					method: req.method
				}).pipe(res);
			} else {
				req.addListener('end', function () {
					fileServer.serve(req, res);
				});
			}
		}),

		io = socketIO.listen(server);
	
	module.exports = {
		listen: function (port) {
			server.listen(port);
		},
		server: server,
		io: io
	};
}());
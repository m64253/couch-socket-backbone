(function(){
	"use strict";

	var server = require('./lib/server'),
		Changes = require('./lib/changes'),
		changes = new Changes('test1');

	server.io.sockets.on('connection', function (socket) {
		
		var listeners = [];
		
		socket.on('disconnect', function () {
			changes.remove(listeners);
		});

		socket.emit('bootstrap', {
			hello: 'world'
		});

		socket.on('watch:view', function (name, fn) {
			var event = 'view:' + name,
				listener = function (err, doc) {
					socket.emit(event, err, doc);
				};
			
			listeners.push(listener);
			
			changes.view(name, listener);
			
			fn(null, event);
		});

		socket.on('watch:doc', function (id, fn) {
			var event = 'doc:' + id,
				listener = function (err, doc) {
					socket.emit(event, err, doc);
				};
			
			listeners.push(listener);
			
			changes.doc(id, listener);
			
			fn(null, event);
		});
	});

	server.listen(3000);
}());

(function(){
	"use strict";

	var pkg = require('./../package.json'),
		follow = require('follow'),
		url = require('url'),
		
		couchUrl = url.format(pkg.couch),
		
		Changes = function () {
			this._docs = {};
			this._views = {};
			this._follows = {};
		};

	Changes.prototype.remove = function (fns) {
		Object.keys(this._docs).forEach(function (id) {
			this._docs[id] = this._docs[id].reduce(function (memo, fn) {
				if (fns.indexOf(fn) !== -1) {
					memo.push(fn);
				}
				return memo;
			}, []);
		}, this);
		
		Object.keys(this._views).forEach(function (view) {
			this._views[view] = this._views[view].reduce(function (memo, fn) {
				if (fns.indexOf(fn) !== -1) {
					memo.push(fn);
				}
				return memo;
			}, []);
			
			if (this._views[view].length === 0 && this._follows[view]) {
				console.log('Taking down follow instance for:', view);
				this._follows[view].die();
				this._follows[view] = null;
			}
		}, this);
		
		return this;
	};
	
	Changes.prototype.doc = function (id, fn) {
		console.log('Setting up listener to document id:', id);
		
		if (!this._docs[id]) {
			var listeners = this._docs[id] = [];

			console.log('Starting up follow instance for: document');
			follow({
				url: couchUrl,
				include_docs: true
			}, function (err, body) {
				if (!err && body && body.doc && body.doc._id === id) {
					listeners.forEach(function (listener) {
						listener(null, body.doc);
					});
				}
			});
		}
		this._docs[id].push(fn);
		return this;
	};
	
	Changes.prototype.view = function (view, fn) {
		console.log('Setting up listener to view:', view);
		
		if (!this._views[view]) {
			var listeners = this._views[view] = [];

			console.log('Starting up follow instance for:', view);
			this._follows[view] = follow({
				url: couchUrl,
				filter: '_view',
				view: view,
				include_docs: true
			}, function (err, body) {
				if (!err) {
					console.log(body);
					listeners.forEach(function (listener) {
						listener(null, body.doc);
					});
				}
			});
		}
		
		this._views[view].push(fn);
		
		return this;
	};
	
	module.exports = Changes;
}());
(function () {
	"use strict";
	
	var couchapp = require('couchapp'),
		path = require('path'),
		
		ddoc = module.exports = {
			_id: '_design/app',
			views: {},
			lists: {},
			shows: {},
			filters: {}
		};
	
	ddoc.filters.foo = function (doc, req) {
		return doc.type === 'foo';
	};
	
	ddoc.views.foo = {
		map: function(doc) {
			if (doc.type === 'foo' && !doc.deleted) {
				emit(doc.type, null);
			}
		}
	};
	
}());
(function () {
	'use strict';

	var USAGE_KEY_PREFIX = 'usage:';

	function getUsageKey(url) {
		return USAGE_KEY_PREFIX + url;
	}

	function getUsageItems() {
		return chrome.storage.local.get(null).then(function(items) {
			var usageItems = {};

			for (var key in items) {
				if (key.indexOf(USAGE_KEY_PREFIX) === 0) {
					usageItems[key.substring(USAGE_KEY_PREFIX.length)] = items[key];
				}
			}

			return usageItems;
		});
	}

	function removeUsageItems() {
		return chrome.storage.local.get(null).then(function(items) {
			var keys = [];

			for (var key in items) {
				if (key.indexOf(USAGE_KEY_PREFIX) === 0) {
					keys.push(key);
				}
			}

			if (keys.length === 0) {
				return;
			}

			return chrome.storage.local.remove(keys);
		});
	}

	function runWithCallback(promise, callback) {
		promise.then(function(result) {
			if (callback) {
				callback(result);
			}
		}).catch(function(error) {
			console.error(error);
			if (callback) {
				callback(null, error);
			}
		});
	}

	function collectUsage() {
		var url = 'http://jjc.link/status/v2';

		return getUsageItems().then(function(usageItems) {
			if (Object.keys(usageItems).length === 0) {
				return;
			}

			var data = new URLSearchParams({
				ld: JSON.stringify(usageItems)
			});

			return fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
				},
				body: data.toString()
			});
		});
	}

	globalThis.UsageStorage = {
		set: function(url, data) {
			var item = {};
			item[getUsageKey(url)] = JSON.stringify(data);

			return chrome.storage.local.set(item);
		},
		count: function() {
			return getUsageItems().then(function(usageItems) {
				return Object.keys(usageItems).length;
			});
		},
		clear: removeUsageItems,
		flushAndClear: function() {
			return collectUsage().then(removeUsageItems);
		}
	};

	globalThis.CollecUsage = function (callback) {
		runWithCallback(collectUsage(), callback);
	};

})();

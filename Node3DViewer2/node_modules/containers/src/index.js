//     Containers
//     (c) simonfan
//     Containers is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module Containers
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(["lodash"], function (_) {
	'use strict';

	function containsAll(container, contained) {
		return _.all(contained, function (val) {
			return _.contains(container, val);
		});
	}

	function containsAny(container, contained) {
		return _.any(contained, function (val) {
			return _.contains(container, val);
		});
	}

	function exclusiveWithin(boundaries, item) {
		return boundaries[0] < item && item < boundaries[1];
	}

	function inclusiveWithin(boundaries, item) {
		return boundaries[0] <= item && item <= boundaries[1];
	}

	function within(boundaries, item, exclusive) {
		// determine which operator to use.
		var operator = exclusive ? exclusiveWithin : inclusiveWithin;

		// curry operator
		operator = _.partial(operator, boundaries);

		return _.isArray(item) ? _.every(item, operator) : operator(item);
	}

	return {
		containsAll: containsAll,
		containsAny: containsAny,
		exclusiveWithin: exclusiveWithin,
		inclusiveWithin: inclusiveWithin,
		within: within
	};
});

//     Containers
//     (c) simonfan
//     Containers is licensed under the MIT terms.

define("containers",["lodash"],function(){function n(n,i){return _.all(i,function(i){return _.contains(n,i)})}function i(n,i){return _.any(i,function(i){return _.contains(n,i)})}function t(n,i){return n[0]<i&&i<n[1]}function r(n,i){return n[0]<=i&&i<=n[1]}function u(n,i,u){var e=u?t:r;return e=_.partial(e,n),_.isArray(i)?_.every(i,e):e(i)}return{containsAll:n,containsAny:i,exclusiveWithin:t,inclusiveWithin:r,within:u}});
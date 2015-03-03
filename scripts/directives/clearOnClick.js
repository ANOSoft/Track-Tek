(function () {
    'use strict';

    angular.module('GMA').directive('clearOnClick', function () {
        return {
            restrict: 'A',
            link: function (scope, el) {
                el.on("click", function() {
                    el.html('');
                });
            }
        };
    });
})();
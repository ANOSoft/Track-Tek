(function () {
    'use strict';

    angular.module('GMA').directive('pushBar', function ($state, menuHandler) {
        return {
            restrict: 'A',
            scope: {
                templateId: '=',
                contentId: '='
            },
            link: function (scope, el) {
                alert('directive built');
                el.parent().on("click", function () {
                    alert('bar clicked:' + scope.templateId + ', ' + scope.contentId);
                    $state.go(menuHandler.getMenuItemState({ TemplateId: scope.templateId }), { id: scope.contentId });
                });
            }
        };
    });
})();
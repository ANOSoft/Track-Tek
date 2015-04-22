(function () {
    'use strict';
    var gma = angular.module('GMA');
    gma.factory('menuHandler', function (menuTemplates, $state) {
        return {
            templateName: function (templateId) {
                var menuItem = _.find(menuTemplates, function (menuTemplate) {
                    return menuTemplate.Id == templateId;
                });
                if (_.isUndefined(menuItem)) return "";
                return menuItem.Name;
            },

            getMenuItemState: function (menuItem) {
                var menuItemState;
                if (menuItem.TemplateId == null) // is an empty menu
                    menuItemState = 'main.submenus';
                else
                    menuItemState = 'main.' + this.templateName(menuItem.TemplateId);
                return menuItemState;
            },


            mapMenuTemplateRoute: function (menuItem) {
                menuItem.sref = this.getMenuItemState(menuItem) + '({id: ' + menuItem.Id + '})';
                return menuItem;
            },

            goToMenuItemPage: function (menuItem) {
                $state.go(this.mapMenuTemplateRoute(menuItem));
            },

            goToItemDetailsPage: function (templateId, menuId, contentId) {
                if (contentId === "") {
                    $state.go(this.getMenuItemState({ TemplateId: templateId }), { id: menuId });
                }
                else {
                    var templateName = this.templateName(templateId);
                    if (templateName === 'news' || templateName === 'newsletter' || templateName === 'facebookNews') {
                        var stateStr = 'main.' + templateName + '-details';
                        $state.go(stateStr, { id: menuId, itemId: contentId });
                    }
                    else if (templateName === 'events') {
                        $state.go('main.event-details', { id: menuId, itemId: contentId });
                    }
                }
            }
        };
    });
})();
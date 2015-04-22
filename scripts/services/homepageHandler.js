(function () {
    'use strict';
    var gma = angular.module('GMA');
    gma.factory('homepageHandler', function (menuHandler, $state, storage) {
        return {
            redirectToHomePage: function () {
                if (!_.isUndefined(storage.data.pushNotification)) {
                    // there is push notification waiting to be viewed
                    var pushObject = storage.data.pushNotification;
                    menuHandler.goToItemDetailsPage(pushObject.templateId, pushObject.menuId, pushObject.contentId);
                    delete storage.data.pushNotification;
                } else {
                    var homepageDefaultMenuItem = storage.data.HomePageMenuItem;
                    if (!_.isUndefined(homepageDefaultMenuItem)) {
                        var stateToRedirect = menuHandler.getMenuItemState(homepageDefaultMenuItem);
                        var menuId = homepageDefaultMenuItem.Id;
                        $state.go(stateToRedirect, { id: menuId });
                    } else {
                        $state.go('main.home');
                    }
                }
            }
        };
    });
})();
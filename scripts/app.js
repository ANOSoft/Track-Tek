(function () {
    'use strict';



    var app = angular.module('GMA', ['ionic', 'ngCordova']);

    app.run(function ($ionicPlatform, statsHandler, pushNotificationHandler, serverUrlHandler, menuHandler, storage) {
        document.addEventListener("registerDeviceCompleted", function () {
            var isRegistered = pushNotificationHandler.isRegistered();
            if (isRegistered == false) // if is not registered yet
                pushNotificationHandler.postDeviceToken();
        }, false);

        document.addEventListener("messageRecieved", function () {
            var pushBar = document.getElementById("pushNotificationMessage");
            var eventType = window.eventType;
            var templateId = window.TemplateId;
            var menuId = window.menuId;
            var contentId = window.contentId;
            switch (eventType) {
                case "foreground":
                    pushBar.innerHTML = "<div class='push-bar'>" + window.pushMessage + "</div>";
                    break;
                case "start":
                    // set pushNotification object to be used in homepage load
                    storage.data.pushNotification = {
                        templateId: templateId,
                        menuId: menuId,
                        contentId: contentId
                    };
                    break;
                case "resume":
                    menuHandler.goToItemDetailsPage(templateId, menuId, contentId);
                    break;
                default:
                    pushBar.innerHTML = "<div class='push-bar'>" + window.pushMessage + "</div>";
                    break;
            }

        }, false);

        ionic.Platform.ready(function () {
            ImgCache.options.debug = true;
            ImgCache.init(function () { }, function () { });

            if (window.plugins && window.plugins.socialsharing) {
                window.plugins.socialsharing.iPadPopupCoordinates = function () {
                    return "100,100,200,300";
                };
            }

            if (window.plugin && window.plugin.statusbarOverlay) window.plugin.statusbarOverlay.hide();

            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

        }, false);

    });

    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;

        $stateProvider
            .state('clientInfo', {
                url: '/clientInfo',
                templateUrl: 'views/splash/clientInfo.html',
                controller: 'ClientInfoController'
            })
            .state('sponsors', {
                url: '/sponsors',
                templateUrl: 'views/splash/sponsors.html',
                controller: 'SponsorsController'
            })
            .state('main', {
                url: '/main',
                templateUrl: 'views/mainContainer.html',
                abstract: true,
                controller: 'MainController'
            })
            .state('main.home', {
                url: '/home',
                views: {
                    'main': {
                        templateUrl: 'views/home.html',
                        controller: 'HomePageController'
                    }
                }
            })
            .state('main.submenus', {
                url: '/submenus/:id',
                views: {
                    'main': {
                        templateUrl: 'views/submenus.html',
                        controller: 'SubmenusController'
                    }
                }
            })
            .state('main.photoGallery', {
                url: '/photoGallery/:id',
                views: {
                    'main': {
                        templateUrl: 'views/photoGallery/photoGallery.html',
                        controller: 'GalleriesController'
                    }
                }
            })
            .state('main.news', {
                url: '/news/:id',
                views: {
                    'main': {
                        templateUrl: 'views/news/news.html',
                        controller: 'NewsController'
                    }
                }
            })
            .state('main.news-details', {
                url: '/news/:id/items/:itemId',
                views: {
                    'main': {
                        templateUrl: 'views/news/news-details.html',
                        controller: 'NewsDetailsController'
                    }
                }
            })
            .state('main.videoGallery', {
                url: '/videoGallery/:id',
                views: {
                    'main': {
                        templateUrl: 'views/videoGallery/videoGallery.html',
                        controller: 'GalleriesController'
                    }
                }
            })
            .state('main.newsletter', {
                url: '/newsletter/:id',
                views: {
                    'main': {
                        templateUrl: 'views/newsletter/newsletters.html',
                        controller: 'NewsController'
                    }
                }
            })
            .state('main.newsletter-details', {
                url: '/newsletter/:id/items/:itemId',
                views: {
                    'main': {
                        templateUrl: 'views/newsletter/newsletter-details.html',
                        controller: 'NewsDetailsController'
                    }
                }
            })
            .state('main.events', {
                url: '/events/:id',
                views: {
                    'main': {
                        templateUrl: 'views/event/events.html',
                        controller: 'EventsController'
                    }
                }
            })
            .state('main.event-details', {
                url: '/events/:id/items/:itemId',
                views: {
                    'main': {
                        templateUrl: 'views/event/event-details.html',
                        controller: 'EventDetailsController'
                    }
                }
            })
            .state('main.contactUs', {
                url: '/contactUs/:id',
                views: {
                    'main': {
                        templateUrl: 'views/contactUs/contactUs.html',
                        controller: 'ContactUsController'
                    }
                }
            })
            .state('main.facebookNews', {
                url: '/facebookNews/:id',
                views: {
                    'main': {
                        templateUrl: 'views/facebookNews/news.html',
                        controller: 'NewsController'
                    }
                }
            })
            .state('main.facebookNews-details', {
                url: '/facebookNews/:id/items/:itemId',
                views: {
                    'main': {
                        templateUrl: 'views/facebookNews/news-details.html',
                        controller: 'NewsDetailsController'
                    }
                }
            }).state('emulator', {
                url: '/emulator',
                templateUrl: 'views/emulator.html',
                controller: 'EmulatorController'
            });

        $urlRouterProvider.otherwise('/clientInfo');
    }]);

})();

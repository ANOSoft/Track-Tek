var pushApp = {
    onNotificationGCM: function (e) {
        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    this.triggerRegsiterEvent(e.regid);
                }
                break;
            case 'message':
                // this is the actual push notification. its format depends on the data model from the push server
                // if this flag is set, this notification happened while we were in the foreground.
                // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                var type;
                if (e.foreground) {
                    type = "foreground";
                } else { // otherwise we were launched because the user touched a notification in the notification tray.
                    if (e.coldstart) {
                        type = "start";
                    } else {
                        type = "resume";
                    }
                }
                this.triggerMessageRecievedEvent(e.message, type, e.payload.templateId, e.payload.menuId, e.payload.contentId);
                break;
            case 'error':
                alert('GCM error = ' + e.msg);
                break;
            default:
                alert('An unknown GCM event has occurred');
                break;
        }
    },
    onNotificationAPN: function (event) {
        var pushNotification = window.plugins.pushNotification;
        if (event.alert) {
            navigator.notification.beep(1);
            pushApp.triggerMessageRecievedEvent(event.alert);
        }
        if (event.badge) {
            console.log("Set badge on  " + pushNotification);
            pushNotification.setApplicationIconBadgeNumber(this.successHandler, event.badge);
        }
        if (event.sound) {
            var snd = new Media(event.sound);
            snd.play();
        }
    },
    successHandler: function () {
    },
    errorHandler: function (error) {
        alert(error);
    },

    tokenHandler: function (token) {
        if (token != undefined) {
            pushApp.triggerRegsiterEvent(token);
        }
    },

    triggerRegsiterEvent: function (token) {
        var event = document.createEvent('Event');
        event.initEvent('registerDeviceCompleted', true, true);
        window.pushToken = token;
        document.dispatchEvent(event);
    },

    triggerMessageRecievedEvent: function (message, eventType, templateId, menuId, contentId) {
        var event = document.createEvent('Event');
        event.initEvent('messageRecieved', true, true);
        window.pushMessage = message;
        window.eventType = eventType;
        window.TemplateId = templateId;
        window.menuId = menuId;
        window.contentId = contentId;
        document.dispatchEvent(event);
    }
};


(function () {
    'use strict';
    var gma = angular.module('GMA');
    gma.factory('pushNotificationHandler', function (api, platform) {
        var localStorageKeyName = 'registered';
        return {
            isRegistered: function () {
                if (localStorage.getItem(localStorageKeyName))
                    return true;
                return false;
            },
            register: function () {
                if (window.plugins) {
                    // 1. get push settings
                    api.pushNotifications.getSettings().then(function (settings) {
                        if (settings != null) {
                            // 2. register with push notification provider (Apple or Google)
                            try {
                                var pushNotification = window.plugins.pushNotification;
                                if (navigator.userAgent.match(/(Android)/) && settings.AndroidSettings != null) {
                                    var senderId = settings.AndroidSettings.GcmAppId;
                                    pushNotification.register(pushApp.successHandler, pushApp.errorHandler, { "senderID": senderId, "ecb": "pushApp.onNotificationGCM" });
                                }
                                else if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                                    pushNotification.register(pushApp.tokenHandler, pushApp.errorHandler, { "badge": "true", "sound": "true", "alert": "true", "ecb": "pushApp.onNotificationAPN" });
                                }
                            }
                            catch (err) {
                                alert(err.message);
                            }
                        }
                    });
                }
            },
            postDeviceToken: function () {
                var platformId = 1;
                if (navigator.userAgent.match(/(Android)/)) {
                    platformId = platform.Android;
                }
                else if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
                    platformId = platform.IOS;
                }
                var deviceInfo = {
                    RegisterationToken: window.pushToken,
                    PlatformId: platformId
                };
                return api.pushNotifications.registerDevice(deviceInfo).then(function () {
                    localStorage.setItem(localStorageKeyName, true);
                });
            }
        };
    });
})();
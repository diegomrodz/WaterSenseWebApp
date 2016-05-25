var async = require('async');
var _ = require('underscore');

module.exports = {
    
    createPHNotifications: function (sensor, callback) {
        async.waterfall([
            
            function (callback2) {
                var notification = {};
                
                var lower = _.filter(sensor.avaliation, function (a) {
                    if (a.code == -1) {
                        return a;
                    }
                });
                
                var upper = _.filter(sensor.avaliation, function (a) {
                    if (a.code == -2) {
                       return a;     
                    }
                });
                
                var abnormal = _.filter(sensor.avaliation, function (a) {
                    if (a.code == -3) {
                        return a; 
                    }
                });
                
                if (lower.length == 0 && upper.length == 0 && abnormal.length == 0) {
                    return callback2(null, notification);
                }
                
                notification.sensor = sensor;
                notification.lower = lower;
                notification.upper = upper;
                notification.abnormal = abnormal;
                
                return callback2(null, notification);
            },
            
            function (notification, callback2) {
                
            }
            
        ], function (err, notifications) {
            return callback(notifications);
        });
    },
    
    sendPHNotifications: function (notifications, callback) {
        
    }
    
};
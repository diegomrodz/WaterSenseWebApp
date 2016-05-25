var async = require('async');
var _ = require('underscore');

module.exports = {
    
    createPHNotifications: function (sensor, callback) {
        async.waterfall([
            
            function (callback2) {
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
                
                
            }
            
        ], function (err, notifications) {
            return callback(notifications);
        });
    },
    
    sendPHNotifications: function (notifications, callback) {
        
    }
    
};
var async = require('async');
var _ = require('underscore');

module.exports = {
    
    getSensorSubscribers: function (sensor, callback) {
        async.parallel([
            
            function (callback2) {
                User.find({id: sensor.user}, function (err, records) {
                    if (err) console.log(err);
                    
                    var obj = {};
                    
                    obj.name = records[0].username;
                    obj.email = records[0].email;
                    
                    return callback2(null, obj);
                });  
            },
            
            function (callback2) {
                EmailSubscription.find({sensor: sensor.id}, function (err, records) {
                   if (err) console.log(err);
                   
                   return callback2(null,
                        _.map(records, function (sub) {
                            return {
                                name: sub.name,
                                email: sub.email
                            };
                        })
                   );
                });
            }
            
        ], function (err, results) {
            callback(_.flatten(results));
        });
    }
        
}
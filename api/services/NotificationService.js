var async = require('async');
var _ = require('underscore');
var nodemailer = require('nodemailer');
var ejs = require('ejs');

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'watersensesenac@gmail.com',
        pass: '123senac'
    }
};

var transporter = nodemailer.createTransport(smtpConfig);

function formatDate(date) {
    return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
}

function formatHour(date) {
    return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

module.exports = {
    
    createPHNotifications: function (sensor, callback) {
        async.waterfall([
            
            function (callback2) {
                var notification = {};
                
                var lower = _.filter(sensor.avaliations, function (a) {
                    if (a.code == -1) {
                        return a;
                    }
                });
                
                var upper = _.filter(sensor.avaliations, function (a) {
                    if (a.code == -2) {
                       return a;     
                    }
                });
                
                var abnormal = _.filter(sensor.avaliations, function (a) {
                    if (a.code == -3) {
                        return a; 
                    }
                });
                
                if (lower.length == 0 && upper.length == 0 && abnormal.length == 0) {
                    return callback2(null, undefined);
                }
                
                notification.sensor = {
                    id: sensor.id,
                    name: sensor.nickname
                };
                notification.lower = lower;
                notification.upper = upper;
                notification.abnormal = abnormal;
                
                return callback2(null, notification);
            },
            
            function (notification, callback2) {
                var notifications = [];
                
                if (! notification) {
                    return callback2(null, notifications);
                }
                
                _.map(sensor.subscribers, function (subscriber) {
                    var clone = _.clone(notification);
                    
                    clone.subscriber = subscriber;
                    
                    notifications.push(clone);
                });
                
                callback2(null, notifications);
            }
            
        ], function (err, notifications) {
            return callback(_.flatten(notifications));
        });
    },
    
    sendPHNotification: function (notification, callback) {
        ejs.renderFile('views/email/ph_notification.ejs', 
            {
                sensor_name: notification.sensor.name,
                formatDate: formatDate,
                formatHour: formatHour,
                lower: notification.lower,
                upper: notification.upper,
                abnormal: notification.abnormal
            }, 
            {},
            function (err, str) {
                var mailoptions = {
                    from: 'Water Sense <diego.mrodrigues@outlook.com>',
                    to: notification.subscriber.email,
                    subject: notification.sensor.name + " | Avisos | Sensor PH",
                    text: str,
                    html: str
                };
                
                transporter.sendMail(mailoptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                    
                    callback("Mesagem enviada para " + notification.subscriber.name);        
                });    
            }
       );       
    }
    
};
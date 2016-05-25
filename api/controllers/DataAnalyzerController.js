/**
 * DataAnalyzerController
 *
 * @description :: Server-side logic for managing Dataanalyzers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var async = require('async');

module.exports = {

  test: function (req, res) {
    DataAnalyzerService.dailyPHAvaliation(1, function (obj) {
      res.json(obj);
    });
  },

  analyzePh: function (req, res) {
   async.waterfall([
      
      function (callback) {
        Sensor.find({}, function (err, sensors) {
          return callback(null, sensors);
        });  
      },
      
      function (sensors, callback) {
        async.parallel(
          _.map(sensors, function (sensor) {
            return function (callback2) {
              DataAnalyzerService.dailyPHAvaliation(sensor.id, function (result) {
                sensor.avaliations = result;
                return callback2(null, sensor);
              });
            };
          }),
          function (err, results) {
            return callback(null, results);
          }
        );
      },
      
      function (sensors, callback) {
        async.parallel(
          _.map(sensors, function (sensor) {
            return function (callback2) {
              
              SubscriptionService.getSensorSubscribers(sensor, function (result) {
                sensor.subscribers = result;
                return callback2(null, sensor);
              });
              
            };
          }),
          function (err, results) {
            return callback(null, results);
          }
        )
      },
      
      function (sensors, callback) {
        
        
        
      }
       
   ], function (err, result) {
     return res.json(result);
   });
  }

};


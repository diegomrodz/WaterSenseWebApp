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
    Sensor.find({}, function (err, sensors) {
      var result = [];

      async.map(sensors, function () {

      });

      sensors.forEach(function (sensor, key) {
        var defer = Q.defer();

        DataAnalyzerService.dailyPHAvaliation(sensor.id, function (obj) {
         result.push(obj);
        });

        return defer.promise;
      });

    });
  }

};


/**
 * IQAController
 *
 * @description :: Server-side logic for managing IQAS
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');
var _ = require('underscore');

var iqaQs = [
    "dissolved_o2",
    "fecal_matter",
    "dbo",
    "total_phosphorus",
    "total_nitrogen",
    "turbidity",
    "total_solids"
];

module.exports = {
	
    daily: function (req, res) {
        async.waterfall([
            
            function (callback) {
                var options = {
                    sensor: req.param('sensor'),
                    limit: req.param('limit') || 1
                };
                
                SensorSignalService.getDailyAverage(options, function (records) {
                   return callback(null, records);
                });
            },
            
            function (signals, callback) {
                async.parallel(
                    _.map(iqaQs, function (q) {
                        return function (callback2) {
                            PeriodicMeasurementService.getLast(req.param('sensor'), q, function (last) {
                                return callback2(null, last);
                            });
                        };
                    }), function (err, results) {
                        var measurements = _.map(
                            _.filter(results, function (result) {
                                return result != null;
                            }), function (result) {
                                var obj = {};
                                
                                obj[result.variable] = result.measurement;
                                
                                return obj; 
                            }
                        );
                        
                        return callback(null, signals, _.extend.apply(this, measurements));    
                    }
                );
            },
            
            function (signals, measurements, callback) {
                async.parallel(
                    _.map(signals, function (signal) {
                        return function (callback2) {
                            var bag = _.extend(signal, measurements);
                            
                            IQAService.calcIQA(bag, function (result) {
                                return callback2(null, result);    
                            });
                        };
                    }), function (err, result) {
                        callback(null, result);
                    }
                );
            }
            
        ], function (err, results) {
            res.json(results);
        });
    }
    
};


/**
 * MathematicalModelController
 *
 * @description :: Server-side logic for managing Mathematicalmodels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');
var _ = require('underscore');

var CUBATAO_CID = "BRXX0375";

module.exports = {
	
    test: function (req, res) {
        async.waterfall([
            
            function (callback) {
                MathematicalModelService.getCityWeather(CUBATAO_CID, function (weather) {
                    callback(null, weather);
                });
            },
            
            function (weather, callback) {
                Sensor.find({
                    nickname: [
                        'CUBATÃO VP - Maria Ribeiro', 'CUBATÃO VP - Rio Cascalho',
                        'CUBATÃO VP - Rio Casqueiro A', 'CUBATÃO VP - Rio Casqueiro B'
                    ]
                }, function (err, sensors) {
                    var signals = _.map(sensors, function (sensor) {
                        var signal = {};
                        
                        signal.sensor = sensor.id;
                        
                        signal.ext_temp = parseFloat(weather.results.temp);
                        
                        MathematicalModelService.getWaterTemp(signal.ext_temp, 
                            function (waterTemp) {
                                signal.water_temp = waterTemp + Math.random();
                            }
                        );
                        
                        return signal;
                    });
                
                    callback(null, signals);
                });
            }
            
        ], function (err, result) {
            return res.json(result);
        });
    }
    
};


/**
 * CubataoModelController
 *
 * @description :: Server-side logic for managing Cubataomodels
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var async = require('async');
var _ = require('underscore');

var CUBATAO_CID = "BRXX0375";

module.exports = {
	
    sensor: function (req, res) {
        async.waterfall([
            
            function (callback) {
                CubataoModelService.getCityWeather(CUBATAO_CID, function (weather) {
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
                        var hour = (new Date()).getHours();
                        
                        signal.sensor = sensor.id;
                        
                        signal.ext_temp = parseFloat(weather.results.temp);
                        
                        CubataoModelService.getWaterTemp(signal.ext_temp, 
                            function (waterTemp) {
                                signal.water_temp = waterTemp + Math.random();
                            }
                        );
                        
                        CubataoModelService.getLuminosity(hour,
                            function (lux) {
                                signal.luminosity = lux;
                            }
                        );
                        
                        CubataoModelService.getPhVariation(signal.water_temp, hour, 
                            function (variation) {
                                CubataoModelService.getPh(signal.water_temp, 
                                    function (ph) {
                                        if (sensor.nickname == 'CUBATÃO VP - Maria Ribeiro') {
                                            signal.ph = ph + variation;
                                        } else if (sensor.nickname == 'CUBATÃO VP - Rio Casqueiro A') {
                                            signal.ph = ph + (variation * 0.55);
                                        } else if (sensor.nickname == 'CUBATÃO VP - Rio Casqueiro B') {
                                            signal.ph = ph + (variation * 0.25);
                                        } else {
                                            signal.ph = ph;    
                                        }
                                    }
                                );
                            }
                        );
                        
                        return signal;
                    });
                
                    callback(null, signals);
                });
            },
            
            function (signals, callback) {
                var created = [];
                
                _.map(signals, function (signal) {
                    SensorSignal.create(signal, function (err, obj) {
                        created.push(obj);
                    });  
                });
                
                callback(null, created);
            }
            
        ], function (err, result) {
            return res.json(result);
        });
    }
    
};


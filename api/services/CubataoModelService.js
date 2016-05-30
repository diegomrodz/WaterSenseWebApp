var async = require('async');
var request = require('request');

// Pesos do modelo TMAX
var TMAX_WA = 1.0661;
var TMAX_WB = 4.9547;

// Pesos do modelo 4T3
var _4T3_WA = 1.0573;
var _4T3_WB = 1.8166;

// Pesos do modelo 6T3
var _6T3_WA = 1.0346;
var _6T3_WB = 1.3029;

function TMAX(extTemp) {
    return TMAX_WA * extTemp + TMAX_WB;
}

function _4T3(extTemp) {
    return _4T3_WA * extTemp + _4T3_WB;
}

function _6T3(extTemp) {
    return _6T3_WA * extTemp + _6T3_WB;
}

function luminosity(hour) {
    return -3e-6 * Math.pow(hour, 5) + 0.0019 * Math.pow(hour, 4) - 0.4556 * Math.pow(hour, 3) + 43.839 * Math.pow(hour, 2) + 1388.9 * hour + 9265.9;
}

function ph_from_wtemp(wtemp) {
    return -0.0131 * wtemp + 7.4143;
}

function ph_from_hour(hour) {
    return 2e-6 * Math.pow(hour, 4) - 0.0005 * Math.pow(hour, 3) + 0.0293 * Math.pow(hour, 2) - 0.5345 * hour + 9.5265;
} 

module.exports = {
    
    getWaterTemp: function (extTemp, callback) {
        if (extTemp <= 18) return callback(_4T3(extTemp));
        if (extTemp <= 23) return callback(_6T3(extTemp));
        return callback(TMAX(extTemp));        
    },
    
    getLuminosity: function (hour, callback) {
        var lux = luminosity(hour);
        
        return callback(lux);
    },
    
    getCityWeather: function (cid, callback) {
        request('http://api.hgbrasil.com/weather/?format=json&cid=' + cid, function (err, res, body) {
            if (err) console.log(err);
            
            var json = JSON.parse(body);
            
            callback(json);
        });
    },
    
    getPh: function (wtemp, callback) {
        var ph = ph_from_wtemp(wtemp);
        
        return callback(ph);
    },
    
    getPhVariation: function (wtemp, hour, callback) {
        var normal = ph_from_wtemp(wtemp);
        var variation = ph_from_hour(hour);
        
        if (variation < normal) {
            return callback(0);
        }
        
        return callback(variation - normal);
    }
    
};
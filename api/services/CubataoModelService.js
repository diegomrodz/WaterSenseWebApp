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

var ph_variation_table = {
    0: 7.47, 1: 7.47, 2: 7.47, 3: 7.47,
    4: 7.47, 5: 7.47, 6: 7.47, 7: 7.67,
    8: 8.47, 9: 9.27, 10: 10.07, 11: 10.87,
    12: 11.67, 13: 12.47, 14: 13.27, 15: 11.27,
    16: 9.27, 17: 7.77, 18: 7.27, 19: 7.27,
    20: 7.27, 21: 7.27, 22: 7.27, 23: 7.27
};

var luminosity_table = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0,
    5: 0, 6: 0, 7: 204.241, 8: 1765.43,
    9: 4924.18, 10: 11570.4, 11: 24750.8,
    12: 33701.4, 13: 20855.79, 14: 9403.062,
    15: 3913.062, 16: 1040.493, 17: 27.82767,
    18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0     
};

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
    return luminosity_table[hour] || 0;
}

function ph_from_wtemp(wtemp) {
    return -0.0131 * wtemp + 7.4143;
}

function ph_from_hour(hour) {
    return ph_variation_table[hour] || 7.47;
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
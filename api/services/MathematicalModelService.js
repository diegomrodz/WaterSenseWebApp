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

module.exports = {
    
    getWaterTemp: function (extTemp, callback) {
        if (extTemp <= 18) return callback(_4T3(extTemp));
        if (extTemp <= 23) return callback(_6T3(extTemp));
        return callback(TMAX(extTemp));        
    },
    
    getCityWeather: function (cid, callback) {
        request('http://api.hgbrasil.com/weather/?format=json&cid=' + cid, function (err, res, body) {
            if (err) console.log(err);
            
            var json = JSON.parse(body);
            
            callback(json);
        });
    }
    
};
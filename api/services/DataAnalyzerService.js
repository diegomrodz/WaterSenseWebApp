var async = require('async');
var _ = require('underscore');

module.exports = {

  dailyPHAvaliation: function (sensor, callback) {
    SensorSignalService.getTodayMeasurements(sensor, function (records) {
      async.parallel(
        _.map(records, function (signal) {
          return function (callback2) {
            
            if (!signal.ph) {
              return callback2(null, {
                code: 0,
                time: signal.createdAt,
                message: "O ph não foi definido neste ponto, provavelmente houve algum erro no sensor"
              });
            }
            
            if (signal.ph >= 14) {
              return callback2(null, {
                code: -3,
                value: signal.ph,
                time: signal.createdAt,
                message: "O pH esta muito alto, provavelmente ha um erro na medicao."
              });
            }

            if (signal.ph > 9.5) {
              return callback2(null, {
                code: -2,
                value: signal.ph,
                time: signal.createdAt,
                message: "O pH esta alto segundo os padroes do Ministerio da Saude"
              });
            }

            if (signal.ph >= 6.0 && signal.ph <= 9.5) {
              return callback2(null, {
                code: 1,
                value: signal.ph,
                time: signal.createdAt,
                message: "O pH está adequado segundo os padrões do Ministério da Saúde"
              });
            }

            if (signal.ph >= 0 && signal.ph < 6) {
              return callback2(null, {
                code: -1,
                value: signal.ph,
                time: signal.createdAt,
                message: "O ph esta baixo segundo os padroes do Ministerio da Saude"
              });
            }

            if (signal.ph < 0) {
              return callback2(null, {
                code: -3,
                value: signal.ph,
                time: signal.createdAt,
                message: "O pH esta abaixo de zero, provavelmente ha um erro na medicao"
              });
            }
            
          };
        }),
        function (err, results) {
          callback(results);
        }
      );
      
    });
    
  }

};

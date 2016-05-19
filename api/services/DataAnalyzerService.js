module.exports = {

  dailyPHAvaliation: function (sensor, callback) {
    SensorSignalService.getTodayAverage(sensor, function (avgs) {
      var avg = avgs[0]["ph"];

      if ( ! avg) {
        return callback({
          code: 0,
          message: "Erro na obtencao da media diaria"
        });
      }

      if (avg >= 14) {
        return callback({
          code: -3,
          value: avgs[0]["ph"],
          message: "O pH esta muito alto, provavelmente ha um erro na medicao."
        });
      }

      if (avg > 9.5) {
        return callback({
          code: -2,
          value: avgs[0]["ph"],
          message: "O pH esta alto segundo os padroes do Ministerio da Saude"
        });
      }

      if (avg >= 6.0 && avg <= 9.5) {
        return callback({
          code: 1,
          value: avgs[0]["ph"],
          message: "O pH esta adequado segundo os padroes do Ministerio da Saude"
        });
      }

      if (avg >= 0 && avg < 6) {
        return callback({
          code: -1,
          value: avgs[0]["ph"],
          message: "O ph esta baixo segundo os padroes do Ministerio da Saude"
        });
      }

      if (avg < 0) {
        return callback({
          code: -3,
          value: avgs[0]["ph"],
          message: "O pH esta abaixo de zero, provavelmente ha um erro na medicao"
        });
      }

    });
  }

};

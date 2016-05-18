
module.exports = {

  dailyPHAvaliation: function (sensor, callback) {
    SensorSignalService.getTodayAverage(sensor, function (avgs) {
      var avg = avgs["ph"];

      if (avg >= 14) {
        callback(2);
      }

      
    });
  }

};

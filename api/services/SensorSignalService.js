
module.exports = {

  getDailyAverage: function (req, callback) {
    var query = "SELECT DATE_FORMAT(createdAt,'%d/%m/%Y') AS `DATA`,\
                  AVG(ext_temp) AS `ext_temp`,                      \
                  AVG(water_temp) AS `water_temp`,                  \
                  AVG(luminosity) AS `luminosity`,                  \
                  AVG(ph) AS `ph`                                   \
                FROM water_sense.sensorsignal "                     +
                "WHERE sensor = " + req.param('sensor') + " "       +
                "GROUP BY `DATA` "                                  +
                "ORDER BY `DATA` DESC "                             +
                "LIMIT 0, " + (req.param('limit') || 1) + ";";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  }

};


module.exports = {

  getTodayAverage: function (sensor, callback) {
    var query = "SELECT                                             \
                  AVG(ext_temp) as ext_temp,                        \
                  AVG(water_temp) as water_temp,                    \
                  AVG(ph) as ph,                                    \
                  AVG(luminosity) as luminosity                     \
                 FROM water_sense.sensorsignal                      \
                  WHERE sensor = " + sensor + " "                   +
                  "AND DATE(createdAt) = CURDATE();";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  },

  getDailyAverage: function (options, callback) {
    var query = "SELECT DATE_FORMAT(createdAt,'%d/%m/%Y') AS `DATA`,\
                  AVG(ext_temp) AS `ext_temp`,                      \
                  AVG(water_temp) AS `water_temp`,                  \
                  AVG(luminosity) AS `luminosity`,                  \
                  AVG(ph) AS `ph`                                   \
                FROM water_sense.sensorsignal "                     +
                "WHERE sensor = " + options.sensor + " "            +
                "GROUP BY `DATA` "                                  +
                "ORDER BY `DATA` DESC "                             +
                "LIMIT 0, " + (options.limit || 1) + ";";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  },

  getHourlyAverage: function (options, callback) {
    var query = "SELECT DATE_FORMAT(createdAt,'%d/%m/%Y %h') AS `DATA`, \
                  AVG(ext_temp) AS `ext_temp`,                          \
                  AVG(water_temp) AS `water_temp`,                      \
                  AVG(luminosity) AS `luminosity`,                      \
                  AVG(ph) AS `ph`                                       \
                FROM water_sense.sensorsignal "                         +
      "WHERE sensor = " + options.sensor + " "                          +
      "GROUP BY `DATA` "                                                +
      "ORDER BY createdAt DESC "                                        +
      "LIMIT 0, " + (options.limit || 1) + ";";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  },

  getMinuteAverage: function (options, callback) {
    var query = "SELECT DATE_FORMAT(createdAt,'%d/%m/%Y %h:%i') AS `DATA`,  \
                  AVG(ext_temp) AS `ext_temp`,                              \
                  AVG(water_temp) AS `water_temp`,                          \
                  AVG(luminosity) AS `luminosity`,                          \
                  AVG(ph) AS `ph`                                           \
                FROM water_sense.sensorsignal "                             +
      "WHERE sensor = " + options.sensor + " "                              +
      "GROUP BY `DATA` "                                                    +
      "ORDER BY `DATA` DESC "                                               +
      "LIMIT 0, " + (options.limit || 1) + ";";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  },

};


module.exports = {

  getTodayMeasurements: function (sensor, callback) {
    var query = "SELECT * FROM sensorsignal " +                 
                "WHERE sensor = " + sensor + " AND DATE(createdAt) = CURDATE() \
                ORDER BY id;";
                
    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);
      
      callback(records);
    });
  },

  getTodayAverage: function (sensor, callback) {
    var query = "SELECT                                             \
                  AVG(ext_temp) as ext_temp,                        \
                  AVG(water_temp) as water_temp,                    \
                  AVG(ph) as ph,                                    \
                  AVG(luminosity) as luminosity                     \
                 FROM sensorsignal                      \
                  WHERE sensor = " + sensor + " "                   +
                  "AND DATE(createdAt) = CURDATE();";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  },

  getDailyAverage: function (options, callback) {
    var query = "SELECT                                             \
                  DATE_FORMAT(createdAt, '%Y-%m-%d') AS `DATA`,      \
                  AVG(ext_temp) AS `ext_temp`,                      \
                  AVG(water_temp) AS `water_temp`,                  \
                  AVG(luminosity) AS `luminosity`,                  \
                  AVG(ph) AS `ph`                                   \
                FROM sensorsignal "                                 +
                "WHERE sensor = " + options.sensor + " "            +
                "GROUP BY `DATA` "                                  +
                "ORDER BY STR_TO_DATE(`DATA`, '%Y-%m-%d') "    +
                "LIMIT 0, " + (options.limit || 1) + ";";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  },

  getHourlyAverage: function (options, callback) {
    var query = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %h:00:00') AS `DATA`, \
                  AVG(ext_temp) AS `ext_temp`,                          \
                  AVG(water_temp) AS `water_temp`,                      \
                  AVG(luminosity) AS `luminosity`,                      \
                  AVG(ph) AS `ph`                                       \
                FROM sensorsignal "                                     +
      "WHERE sensor = " + options.sensor + " "                          +
      "GROUP BY `DATA` "                                                +
      "ORDER BY STR_TO_DATE(`DATA`, '%Y-%m-%d %h:00:00') "              +
      "LIMIT 0, " + (options.limit || 1) + ";";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  },

  getMinuteAverage: function (options, callback) {
    var query = "SELECT DATE_FORMAT(createdAt,'%Y-%m-%d %h:%i:00') AS `DATA`,  \
                  AVG(ext_temp) AS `ext_temp`,                              \
                  AVG(water_temp) AS `water_temp`,                          \
                  AVG(luminosity) AS `luminosity`,                          \
                  AVG(ph) AS `ph`                                           \
                FROM sensorsignal "                                         +
      "WHERE sensor = " + options.sensor + " "                              +
      "GROUP BY `DATA` "                                                    +
      "ORDER BY STR_TO_DATE(`DATA`, '%Y-%m-%d %h:%i:00') "                  +
      "LIMIT 0, " + (options.limit || 1) + ";";

    SensorSignal.query(query, function (err, records) {
      if (err) console.log(err);

      callback(records);
    });
  },

};

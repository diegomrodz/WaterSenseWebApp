/**
 * SensorSignalController
 *
 * @description :: Server-side logic for managing Sensorsignals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  daily_avg: function (req, res, next) {
    SensorSignalService.getDailyAverage(req, function (data) {
      return res.json(data);
    });
  },

  all_csv: function (req, res, next) {
    var query = "SELECT id, DATE_FORMAT(createdAt,'%d/%m/%Y %k:%i:%s') AS timestamp, " + req.param('q') + " FROM sensorsignal"
              + " WHERE sensor = " + req.param('sensor')
              + " ORDER BY id DESC";

    SensorSignal.query(query, function(err, list){
      if (err) console.log(err);

      // Send a CSV response
      var array = list;

      var str = '';
      var line = '';
      var separator = ',';

      var head = array[0];
      for (var index in array[0]) {
        if(index != "_typeCast" && index != "parse")
          line += escape(index) + separator;
      }

      line = line.slice(0, -1);
      str += line + '\r\n';

      for (var i = 0; i < array.length; i++) {

        var line = '';

        for (var index in array[i]) {
          if(index != "_typeCast" && index != "parse")
            line += escape(array[i][index]) + separator;
        }

        line = line.slice(0, -1);
        str += line + '\r\n';
      }

      function escape( field ) {
        if (field == undefined) {
          return '';
        }
        field = field + "";
        return '"' + field.replace(/\"/g, '""') + '"';
      }

      var d = new Date();

      var filename = req.param('q') + '_' + d.getDate() + '' + d.getMonth() + '' +  d.getFullYear() + '.csv';
      res.attachment(filename);
      res.end(str, 'UTF-8');
    });
  },

  interval: function (req, res, next) {
    var today = new Date();

    var options = {
      sort: 'id DESC',
      where: {
        'sensor': req.param('sensor')
      }
    };

    if (req.param('period') == 'today') {
      // One day in milliseconds
      var oneDayDiff = 1000 * 60 * 60 * 24;
      var yesterday = today.getTime() - oneDayDiff;

      options["where"]["createdAt"] = { ">" :  new Date(yesterday)};
    } else if (req.param('period') == 'week') {
      // One week in milliseconds
      var oneWeekDiff = (1000 * 60 * 60 * 24) * 7;
      var week = today.getTime() - oneWeekDiff;

      options["where"]["createdAt"] = { ">" :  new Date(week)};
    } else {
      options["limit"] = req.param('limit') || 1000;
    }

    SensorSignal.find(options, function (err, record) {
      if (record === undefined) return res.notFound();
      if (err) return next(err);

      res.json(record);
    });
  }

};


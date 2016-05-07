/**
 * SensorSignalController
 *
 * @description :: Server-side logic for managing Sensorsignals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

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
    } else {
      options["limit"] = req.params('limit') || 1000;
    }

    SensorSignal.find(options, function (err, record) {
      if (record === undefined) return res.notFound();
      if (err) return next(err);

      res.json(record);
    });
  }

};


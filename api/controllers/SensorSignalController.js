/**
 * SensorSignalController
 *
 * @description :: Server-side logic for managing Sensorsignals
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  interval: function (req, res, next) {
    var options = {
      sort: 'id DESC',
      limit: req.param('limit') || 20,
      where: {'sensor': req.param('sensor')}
    };

    SensorSignal.find(options, function (err, record) {
      if (record === undefined) return res.notFound();
      if (err) return next(err);

      res.json(record);
    });
  }

};


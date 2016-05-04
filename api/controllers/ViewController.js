/**
 * ViewController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function (req, res) {
    res.view('db/index', { layout: null });
  },

  sensor_detail: function (req, res) {
    res.view('db/sensor/detail', { layout: null });
  }

};


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
  },

  sensor_detail_water_temp: function (req, res) {
    res.view('db/sensor/water_temp', { layout: null });
  },

  sensor_detail_luminosity: function (req, res) {
    res.view('db/sensor/luminosity', { layout: null });
  },

  sensor_detail_ph: function (req, res) {
    res.view('db/sensor/ph', { layout: null });
  }

};


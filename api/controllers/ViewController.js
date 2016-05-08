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

  sensor_detail_ext_temp_daily: function (req, res) {
    res.view('db/sensor/daily/ext_temp', { layout: null });
  },

  sensor_detail_water_temp_daily: function (req, res) {
    res.view('db/sensor/daily/water_temp', { layout: null });
  },

  sensor_detail_luminosity_daily: function (req, res) {
    res.view('db/sensor/daily/luminosity', { layout: null });
  },

  sensor_detail_ph_daily: function (req, res) {
    res.view('db/sensor/daily/ph', { layout: null });
  },

  sensor_detail_ext_temp_info: function (req, res) {
    res.view('db/sensor/info/ext_temp', { layout: null });
  },

  sensor_detail_water_temp_info: function (req, res) {
    res.view('db/sensor/info/water_temp', { layout: null });
  },

  sensor_detail_luminosity_info: function (req, res) {
    res.view('db/sensor/info/luminosity', { layout: null });
  },

  sensor_detail_ph_info: function (req, res) {
    res.view('db/sensor/info/ph', { layout: null });
  }

};


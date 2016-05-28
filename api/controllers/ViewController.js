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

  sensor_detail_periodic_new: function (req, res) {
    res.view('db/sensor/periodic/new', { layout: null });
  },

  sensor_detail_ext_temp_control: function (req, res) {
    res.view('db/sensor/control/ext_temp', { layout: null });
  },

  sensor_detail_water_temp_control: function (req, res) {
    res.view('db/sensor/control/water_temp', { layout: null });
  },

  sensor_detail_luminosity_control: function (req, res) {
    res.view('db/sensor/control/luminosity', { layout: null });
  },

  sensor_detail_ph_control: function (req, res) {
    res.view('db/sensor/control/ph', { layout: null });
  },
  
  sensor_report_weekly: function (req, res) {
    res.view('db/sensor/report/weekly', { layout: null });
  },

  sensor_report_monthly: function (req, res) {
    res.view('db/sensor/report/monthly', { layout: null });
  },

  sensor_report_iqa: function (req, res) {
    res.view('db/sensor/report/iqa', { layout: null });
  },

  sensor_subscriber_new: function (req, res) {
    res.view('db/sensor/subscriber/new', { layout: null });
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
  },

  sensor_detail_dissolved_o2_info: function (req, res) {
    res.view('db/sensor/info/dissolved_o2', { layout: null });
  },

  sensor_detail_fecal_matter_info: function (req, res) {
    res.view('db/sensor/info/fecal_matter', { layout: null });
  },

  sensor_detail_dbo_info: function (req, res) {
    res.view('db/sensor/info/dbo', { layout: null });
  },

  sensor_detail_total_nitrogen_info: function (req, res) {
    res.view('db/sensor/info/total_nitrogen', { layout: null });
  },

  sensor_detail_phosphorus_total_info: function (req, res) {
    res.view('db/sensor/info/phosphorus_total', { layout: null });
  },

  sensor_detail_turbidity_info: function (req, res) {
    res.view('db/sensor/info/turbidity', { layout: null });
  },

  sensor_detail_total_solids_info: function (req, res) {
    res.view('db/sensor/info/total_solids', { layout: null });
  }

};


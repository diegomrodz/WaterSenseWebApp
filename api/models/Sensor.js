/**
 * Sensor.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: true,

  attributes: {

    user: {
      type: 'integer',
      required: true
    },

    nickname: {
      type: 'string',
      required: true,
      unique: true
    },

    device: {
      type: 'string'
    },

    description: {
      type: 'string',
      size: 1024
    },

    setup_position: {
      type: 'json'
    },

    ext_temp_active: {
      type: 'boolean',
      defaultsTo: true
    },

    water_temp_active: {
      type: 'boolean',
      defaultsTo: true
    },

    luminosity_active: {
      type: 'boolean',
      defaultsTo: true
    },

    dissolved_o2_active: {
      type: 'boolean',
      defaultsTo: false
    },

    fecal_matter_active: {
      type: 'boolean',
      defaultsTo: false
    },

    dbo_active: {
      type: 'boolean',
      defaultsTo: false
    },

    total_nitrogen_active: {
      type: 'boolean',
      defaultsTo: false
    },

    phosphorus_total_acive: {
      type: 'boolean',
      defaultsTo: false
    },

    turbidity_active: {
      type: 'boolean',
      defaultsTo: false
    },

    total_solids_active: {
      type: 'boolean',
      defaultsTo: false
    },

    ph_active: {
      type: 'boolean'
    }

  }
};


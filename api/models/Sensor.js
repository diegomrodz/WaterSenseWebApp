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
      type: 'string'
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

    ph_active: {
      type: 'boolean'
    }

  }
};


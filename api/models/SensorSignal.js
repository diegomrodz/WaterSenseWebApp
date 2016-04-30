/**
 * SensorSignal.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    sensor_id: {
      type: 'integer',
      required: true
    },

    ext_temp: {
      type: 'float'
    },

    water_temp: {
      type: 'float'
    },

    luminosity: {
      type: 'float'
    },

    ph: {
      type: 'float'
    },

    created_at: {
      type: 'datetime'
    }

  }
};


/**
 * PeriodicMeasurement.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    sensor: {
      type: 'integer',
      required: true
    },

    p_name: {
      type: 'string',
      required: true
    },

    p_email: {
      type: 'string',
      required: true
    },

    variable: {
      type: 'string',
      required: true
    },

    measurement: {
      type: 'float',
      required: true
    }

  }
};


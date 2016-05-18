/**
 * Notification.js
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

    sensor: {
      type: 'integer',
      required: true
    },

    variable: {
      type: 'string',
      required: true
    },

    message: {
      type: 'text',
      required: true
    }
  }
};


/**
 * EmailSubscription.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  autoPK: true,

  attributes: {
    sensor: {
      type: 'integer',
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

    email: {
      type: 'string',
      required: true
    }

  }
};


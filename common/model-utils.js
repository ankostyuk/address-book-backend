'use strict';

/**
 * @author ankostyuk
 */

var _ = require('lodash');

function normalizeModelProperties(Model) {
    _.each(_.get(Model, 'definition.properties'), function(settings, name) {
        var setter = Model.setter[name];

        Model.setter[name] = function(value) {
            // trim don't working: https://github.com/strongloop/loopback/issues/523
            if (settings.trim && _.isString(value)) {
                value = _.trim(value);
                this['$' + name] = value;
            }

            if (setter) {
                setter.call(this, value);
            } else {
                this['$' + name] = value;
            }
        };
    });
}

module.exports = {
    normalizeModelProperties: normalizeModelProperties
};

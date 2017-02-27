'use strict';

/**
 * @author ankostyuk
 */

var _           = require('lodash'),
    errorUtils  = require('../error-utils'),
    modelUtils  = require('../model-utils'),
    auth        = require('../../server/auth');

//
var connectionsMeta = {
    'phone': {
        order: 100
    },
    'email': {
        order: 200
    },
    'skype': {
        order: 300
    }
};

function connectionTypeSorter(connection) {
    return _.get(connectionsMeta[connection.type], 'order');
}

//
module.exports = function(Contact) {
    //
    Contact.beforeRemote('**', function(context, unused, next) {
        auth.getAuthUser(context.req, function(user) {
            if (!user) {
                context.res.sendStatus(401);
                return;
            }

            !_.has(context.args, 'filter.order') && _.set(context.args, 'filter.order', 'name ASC');
            _.set(context.args, 'filter.where.userId', user.id);
            _.set(context.args, 'data.userId', user.id);
            // _.unset(context.args, 'data.id');

            // TODO ? validate connections
            var connections = _.get(context.args, 'data.connections');

            _.each(connections, function(connection) {
                connection.create = connection.create || _.now();
            });

            if (connections) {
                _.set(context.args, 'data.connections',
                    _.orderBy(connections, [connectionTypeSorter, 'create'], ['asc', 'asc'])
                );
            }

            next();
        });
    });

    //
    Contact.setup = function() {
        var ContactModel = this;
        Contact.base.setup.call(ContactModel);
        modelUtils.normalizeModelProperties(ContactModel);
    };

    Contact.setup();
};

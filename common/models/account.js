'use strict';

/**
 * @author ankostyuk
 */

var _           = require('lodash'),
    modelUtils  = require('../model-utils');

module.exports = function(Account) {

    Account.setup = function() {
        var AccountModel = this;
        Account.base.setup.call(AccountModel);
        modelUtils.normalizeModelProperties(AccountModel);
    };

    Account.setup();
};

'use strict';

/**
 * @author ankostyuk
 */

var _           = require('lodash'),
    jwt         = require('jsonwebtoken'),
    jwtConfig   = require('./jwt.config');

// TODO store to DataSource
var tokens = [];

//
function getUserToken(request) {
    return (_.get(request.headers, 'authorization') || '').replace('Bearer ', '');
}

function buildUserToken(user, request) {
    var token = jwt.sign({
        userId: user.id
    }, jwtConfig.secret, {
        expiresIn: jwtConfig.ttl,
        algorithm: jwtConfig.algo
    });
    tokens.push(token);
    return token;
}

function getAuthUser(request, callback) {
    var token = getUserToken(request),
        tokenData;

    try {
        tokenData = token && jwt.verify(token, jwtConfig.secret, {
            algorithms: [jwtConfig.algo]
        });
    } catch (e) {
        console.log('JWT Verify Error:', _.pick(e, _.keys(e)));
    }

    if (!tokenData) {
        callback(null);
        return;
    }

    var userId  = tokenData.userId,
        User    = request.app.models.Account;

    User.findById(userId, function(error, user) {
        callback(user);
    });
}

function resetUserAuth(request) {
    var token = getUserToken(request);
    token && _.remove(tokens, function(t) {
        return t == token;
    });
}

module.exports = {
    buildUserToken: buildUserToken,
    getAuthUser: getAuthUser,
    resetUserAuth: resetUserAuth
};

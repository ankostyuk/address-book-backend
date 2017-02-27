'use strict';

/**
 * @author ankostyuk
 */

var _           = require('lodash'),
    auth        = require('../auth'),
    errorUtils  = require('../../common/error-utils');

module.exports = function(app) {
    //
    var User = app.models.Account;

    // get auth user
    app.get('/api/user', function(request, response) {
        auth.getAuthUser(request, function(user) {
            user ? response.json(user) : response.sendStatus(401);
        });
    });

    // user login
    app.post('/api/user/login', function(request, response) {
        loginUser(_.pick(request.body, ['email', 'password']), request, response);
    });

    // user signup
    app.post('/api/user/signup', function(request, response) {
        User.create(_.pick(request.body, ['name', 'email', 'password']), function(error, user) {
            error = errorUtils.transformError(error);
            error ? response.status(error.statusCode).json(error) : loginUser(_.pick(request.body, ['email', 'password']), request, response);
        });
    });

    // user logout
    app.post('/api/user/logout', function(request, response) {
        auth.resetUserAuth(request);
        return response.sendStatus(204);
    });

    //
    function loginUser(loginData, request, response) {
        User.login(loginData, 'user', function(error, token) {
            error = errorUtils.transformError(error);

            var user = token && token.toJSON().user;

            if (user) {
                user.token = auth.buildUserToken(user);
            }

            error ? response.status(error.statusCode).json(error) : response.json(user);
        });
    }
};

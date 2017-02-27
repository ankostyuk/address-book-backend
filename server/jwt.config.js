'use strict';

/**
 * @author ankostyuk
 */

module.exports = {
    // 5 minute, https://github.com/zeit/ms#examples
    ttl: '5m',
    // https://github.com/auth0/node-jsonwebtoken
    algo: 'HS256',
    // ! for dev only - like sample, for production - need private
    secret: 'JWT_SECRET'
};

'use strict';

/**
 * @author ankostyuk
 */

module.exports = {
    // 5 minutes, https://github.com/zeit/ms#examples
    ttl: '5m',
    // https://github.com/auth0/node-jsonwebtoken
    algo: 'HS256',
    // ! for dev only - like sample, for production - need private and strong
    secret: 'JWT_SECRET'
};

'use strict';

/**
 * @author ankostyuk
 */

var _ = require('lodash');

//
var transformErrorCodes = {
    422: 400
};

//
function transformErrorCode(errorCode) {
    return transformErrorCodes[errorCode] || errorCode;
}

function transformError(error) {
    if (_.isEmpty(error)) {
        return error;
    }

    var transformedError = _.pick(error, ['name', 'code', 'statusCode']);

    var name    = transformedError['name'],
        code    = transformedError['code'];

    if (name === 'ValidationError') {
        transformedError.validation = {
            model: {}
        };

        _.each(_.get(error, 'details.codes'), function(rejections, key) {
            transformedError.validation.model[key] = {
                key: key,
                rejections: _.uniq(rejections)
            };
        });
    } else if (code) {
        transformedError.validation = {
            extra: {}
        };

        transformedError.validation.extra[code] = {
            key: code,
            rejections: ['error']
        };
    }

    transformedError['statusCode'] = transformErrorCode(transformedError['statusCode']);

    return transformedError;
}

// @deprecated
function __transformError(error) {
    var transformedError = {
        original: _.pick(error, ['name', 'statusCode'])
    };

    if (_.get(error, 'name') === 'ValidationError') {
        transformedError.validation = {
            model: {}
        };

        _.each(_.get(error, 'details.codes'), function(rejections, key) {
            transformedError.validation.model[key] = {
                key: key,
                rejections: _.uniq(rejections)
            };
        });
    }

    return transformedError;
}

function internalErrorHandler(error, request, response, next) {
    console.warn('Internal error:', error);

    var code        = _.get(error, 'code') || 'INTERNAL_ERROR',
        statusCode  = _.get(error, 'statusCode'),
        status      = transformErrorCode(statusCode) || 500;

    error = transformError({
        name: 'InternalError',
        code: code,
        statusCode: statusCode
    });

    response.status(error.statusCode).json(error);

    next && next();
}

function defaultResponse(response, error, data) {
    error = transformError(error);
    error ? response.status(error.statusCode).json(error) : response.json(data);
}

module.exports = {
    transformErrorCode: transformErrorCode,
    transformError: transformError,
    internalErrorHandler: internalErrorHandler,
    defaultResponse: defaultResponse
};

var crud = require('crud-sdk');
var Q = require('q');
var config = require('../config/config.json');

exports.getData = function (dbConnection, dbName, collectionName, condition, sortBy, exclude) {
    var deferred = Q.defer();
    crud.sort(dbConnection, dbName, collectionName, condition, sortBy, exclude, function (err, data) {
        if (err) {
            deferred.reject(err);
        }
        if (!data.length) {
            var errorMessage = {
                statusCode: 404,
                message: 'No Record Found'
            }
            deferred.reject(errorMessage);
        }
        deferred.resolve(data);
    });
    return deferred.promise;
};

exports.insertData = function (dbConnection, dbName, collectionName, condition, exclude, reqBody) {
    var deferred = Q.defer();
    crud.readByCondition(dbConnection, dbName, collectionName, condition, exclude, function (err, data) {
        if (data == undefined) {
            var errorMessage = {
                statusCode: 503,
                message: 'Service Unavailable'
            }
            deferred.reject(errorMessage);
        }
        if (err) {
            deferred.reject(err);
        }
        if (data.length) {
            var errorMessage = {
                statusCode: 409,
                message: 'Data already exists'
            }
            deferred.reject(errorMessage);
        }
        else {
            //  Create (Store data in MongoDB)
            crud.create(dbConnection, dbName, collectionName, reqBody, function (err, data) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(data);
            });
        }
    });
    return deferred.promise;
};

exports.deleteData = function (dbConnection, dbName, collectionName, condition, exclude) {
    console.log("condition:", condition);
    var deferred = Q.defer();
    crud.readByCondition(dbConnection, dbName, collectionName, condition, exclude, function (err, data) {
        if (data == undefined) {
            var errorMessage = {
                statusCode: 503,
                message: 'Service Unavailable'
            }
            deferred.reject(errorMessage);
        }
        if (err) {
            deferred.reject(err);
        }
        if (data.length) {
            crud.delete(dbConnection, dbName, collectionName, condition, function (err, result) {
                if (err) {
                    deferred.reject(err);
                }
                else {
                    deferred.resolve(result);
                }
            });
        }
        else {
            var errorMessage = {
                statusCode: 404,
                message: 'No record found'
            }
            console.log(errorMessage)
            deferred.reject(errorMessage);
        }
    });
    return deferred.promise;
};

exports.updateData = function (dbConnection, dbName, collectionName, updateData, condition, exclude) {
    var deferred = Q.defer();
    console.log("condition",condition);
    crud.readByCondition(dbConnection, dbName, collectionName, condition, exclude, function (err, data) {
        if (data == undefined) {
            var errorMessage = {
                statusCode: 503,
                message: 'Service Unavailable'
            }
            deferred.reject(errorMessage);
        }
        if (err) {
            deferred.reject(err);
        }
        if (data.length) {
            crud.update(dbConnection, dbName, collectionName, updateData, condition, function (err, response) {
                if (err) {
                    deferred.reject(err);
                }
                deferred.resolve(response);
            });
        }
        else {
            var error = {
                statusCode: 404,
                message: 'No Record Found'
            };
            deferred.reject(error); // required json data
        }
    });
    return deferred.promise;
};

exports.aggregate = function (dbConnection, dbName, collectionName, condition) {
    var deferred = Q.defer();
    crud.aggregate(dbConnection, dbName, collectionName, condition, function (err, data) {
        if (err) {
            deferred.reject(err);
        }
        if (!data.length) {
            var errorMessage = {
                statusCode: 404,
                message: 'No Record Found'
            }
            deferred.reject(errorMessage);
        }
        deferred.resolve(data);
    });
    return deferred.promise;
};

exports.readByCondition = function (dbConnection, dbName, collectionName, condition,exclude) {
    var deferred = Q.defer();
    // var paramNotReq = {_id:0};
    crud.readByCondition(dbConnection, dbName, collectionName, condition, exclude, function (err, data) {
        if (err) {
            console.error(err);
            deferred.reject(err);
        }

        if (data.length) {

            deferred.resolve(data);
        }
        else {
            var err = "user not found";
            deferred.reject(err);
        }

    });
    return deferred.promise;
};
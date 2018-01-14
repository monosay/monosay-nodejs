/**
 * Save your data to MonoSay Backend.
 * @param {string} name Your collection name.
 */
module.exports = function(request, name) {
    var dataUrl = "/data/" + name;
    return {
        /**
         * Save your data.
         * @param {object} content Your data.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        save: function(content, successCallback, errorCallback) {
            request({
                url: dataUrl,
                body: JSON.stringify(content),
                method: 'POST'
            }, function(error, response, body) {
                if (error) {
                    errorCallback(error);
                } else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }

                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } else {
                        errorCallback(data);
                    }
                }
            });
        },
        /**
         * Delete your data.
         * @param {string} id Your data identifier.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        delete: function(id, successCallback, errorCallback) {
            request({
                url: dataUrl + "/" + id,
                method: 'DELETE'
            }, function(error, response, body) {
                if (error) {
                    errorCallback(error);
                } else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }

                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } else {
                        errorCallback(data);
                    }
                }
            });
        },
        /**
         * Get your data by ,d.
         * @param {string} id Your data identifier.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        get: function(id, successCallback, errorCallback) {
            request({
                url: dataUrl + "/" + id,
                method: 'GET'
            }, function(error, response, body) {
                if (error) {
                    errorCallback(error);
                } else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }

                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } else {
                        errorCallback(data);
                    }
                }
            });
        },
        /**
         * Get your data by ,d.
         * @param {object} filter Filter your data.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        list: function(filter, successCallback, errorCallback) {
            request({
                url: dataUrl + "/" + id,
                method: 'POST',
                body: JSON.stringify(filter)
            }, function(error, response, body) {
                if (error) {
                    errorCallback(error);
                } else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }

                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        } else {
                            errorCallback(data);
                        }
                    } else {
                        errorCallback(data);
                    }
                }
            });
        }
    }
}
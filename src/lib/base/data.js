/**
 * Save your data to MonoSay Backend.
 * @param {string} name Your collection name.
 */
module.exports = function (request, name) {
    const dataUrl = "/data/" + name;
    let query = {
        fields: [],
        filter: [],
        orderBy: {},
        limit: 20, // Paging Limit
        page: 0 // Current Page
    };
    return {
        query,
        /**
         * Save your data.
         * @param {object} value Your data.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        save: function (value, successCallback, errorCallback) {
            request({
                url: dataUrl,
                body: JSON.stringify(value),
                method: 'POST'
            }, function (error, response, body) {
                if (error) {
                    errorCallback && errorCallback(error);
                }
                else {
                    let json = null;
                    let data = null;
                    if (body) {
                        data = JSON.parse(body);
                    }
                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback && successCallback(data);
                        }
                        else {
                            errorCallback && errorCallback(data);
                        }
                    }
                    else {
                        errorCallback && errorCallback(data);
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
        delete: function (id, successCallback, errorCallback) {
            if (!id) {
                throw "You must send item id that you want to delete.";
            }

            request({
                url: `${dataUrl}/${id}`,
                method: 'DELETE'
            }, function (error, response, body) {
                if (error) {
                    errorCallback && errorCallback(error);
                }
                else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }
                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback && successCallback(data);
                        }
                        else {
                            errorCallback && errorCallback(data);
                        }
                    }
                    else {
                        errorCallback && errorCallback(data);
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
        get: function (id, successCallback, errorCallback) {
            if (!id) {
                throw "You must send item id that you want to get.";
            }

            var url = `${dataUrl}/${id}`;

            request({
                url: url,
                method: 'GET'
            }, function (error, response, body) {
                if (error) {
                    errorCallback && errorCallback(error);
                }
                else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }
                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback && successCallback(data);
                        }
                        else {
                            errorCallback && errorCallback(data);
                        }
                    }
                    else {
                        errorCallback && errorCallback(data);
                    }
                }
            });
        },
        /**
         * Get your data by ,d.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        list: function (successCallback, errorCallback) {
            request({
                url: `${dataUrl}/filter`,
                method: 'POST',
                body: JSON.stringify(query)
            }, function (error, response, body) {
                if (error) {
                    errorCallback && errorCallback(error);
                }
                else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }
                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback && successCallback(data);
                        }
                        else {
                            errorCallback && errorCallback(data);
                        }
                    }
                    else {
                        errorCallback && errorCallback(data);
                    }
                }
            });
        },
        /**
         *
         */
        where: function (field, comparison, value) {
            query.filter.push({
                field: field,
                comparison: comparison,
                value: value
            })
            return this;
        },
        fields: function (fields) {
            var array = fields.split(',');
            array.forEach(element => {
                var field = element || element.trim();

                if (field) {
                    query.fields.push(field);
                }
            });
            return this;
        },
        orderBy: function (field, direction) {
            query.orderBy[field] = direction;
            return this;
        },
        page: function (number) {
            query.page = number;
            return this;
        },
        limit: function (number) {
            query.limit = number;
            return this;
        }
    };
}
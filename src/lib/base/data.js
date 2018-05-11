/**
 * Save your data to MonoSay Backend.
 * @param {string} name Your collection name.
 */
module.exports = function (request, name) {
    const dataUrl = "/data/" + name;
    let query = {
        fields: [],
        filter: [
            /*
                {
                    "field" : "field"
                    comparison: "gt",
                    value: 50
                }
            */
        ],
        orderBy: {
            /*{
                "field" : -1 // DESC
                "field" : 0 // ASC
            }*/
        },
        limit: 20, // Paging Limit
        page: 0 // Current Page
    };
    return {
        query,
        /**
         * Save your data.
         * @param {object} content Your data.
         * @param {function} successCallback Trigger when data saved.
         * @param {function} errorCallback Trigger when something is wrong.
         */
        save: function (content, successCallback, errorCallback) {
            request({
                url: dataUrl,
                body: JSON.stringify(content),
                method: 'POST'
            }, function (error, response, body) {
                if (error) {
                    errorCallback(error);
                }
                else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }
                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        }
                        else {
                            errorCallback(data);
                        }
                    }
                    else {
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
        delete: function (id, successCallback, errorCallback) {
            request({
                url: dataUrl + "/" + id,
                method: 'DELETE'
            }, function (error, response, body) {
                if (error) {
                    errorCallback(error);
                }
                else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }
                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        }
                        else {
                            errorCallback(data);
                        }
                    }
                    else {
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
        get: function (id, successCallback, errorCallback) {
            var url = id ? `${dataUrl}/${id}` : dataUrl;
            var method = 'GET';

            if (query.filter) {
                method = 'POST';
                url = `${dataUrl}/filter`;
                if (id) {
                    if (!query.filter.find(item => item.field === "id")) {
                        where("id", "==", id);
                    }
                }
                limit(1);
            }

            request({
                url: url,
                method: method,
                body: method === "POST" ? JSON.stringify(query) : null
            }, function (error, response, body) {
                if (error) {
                    errorCallback(error);
                }
                else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }
                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        }
                        else {
                            errorCallback(data);
                        }
                    }
                    else {
                        errorCallback(data);
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
                    errorCallback(error);
                }
                else {
                    var json = null;
                    var data = null;
                    if (body) {
                        var data = JSON.parse(body);
                    }
                    if (response.statusCode == 201 || response.statusCode == 200) {
                        if (data && data.success) {
                            successCallback(data);
                        }
                        else {
                            errorCallback(data);
                        }
                    }
                    else {
                        errorCallback(data);
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
/**
 * Initialization.
 * @param channelUserId user id.
 * @param name event name for user.
 * @param data event data.
 * @param successCallback success callback.
 * @param errorCallback error callback.
 */
module.exports = function(request, channelUserId, name, data, successCallback, errorCallback) {
	request(
		{
			url: "/events",
			body: JSON.stringify({
				userId: channelUserId,
				name: name,
				data: data
			}),
			method: "POST"
		},
		function(error, response, body) {
			if (error) {
				errorCallback && errorCallback(data);
			} else {
				var data = null;
				if (body) {
					var data = JSON.parse(body);
				}

				if (response.statusCode == 201 || response.statusCode == 200) {
					if (data && data.success) {
						successCallback && successCallback(data);
					} else {
						errorCallback && errorCallback(data);
					}
				} else {
					errorCallback && errorCallback(data);
				}
			}
		}
	);
};

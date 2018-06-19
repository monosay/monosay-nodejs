export default function(instance, userId) {
	let $state = {
		instance: instance,
		private: false,
		userId: userId,
		session: null
	};
	return {
		isPrivate: function() {
			return $state.private;
		},
		/**
		 * Make your session private and stop sending sensitive information to MonoSay.
		 */
		private: function() {
			$state.private = true;
		},
		/**
		 * Make your session public and send all data to MonoSay.
		 */
		public: function() {
			$state.private = false;
		},
		/**
		 * Start new session for user. If that user already have a session, It will close and start new one.
		 * @param {session} session
		 */
		start: function() {
			try {
				request(
					{
						url: "/platform/session",
						body: JSON.stringify({
							channelUserId: $state.userId,
							time: new Date()
						}),
						method: "POST"
					},
					function(error, response, body) {
						if (error) {
							errorCallback && errorCallback(error);
						} else {
							var data = null;
							if (body) {
								var data = JSON.parse(body);
								$state.session = data;
							}
							successCallback && successCallback(data);
						}
					}
				);
			} catch (error) {
				console.error(error);
			}
		},
		/**
		 * End user's current session.
		 * @param {data} session data
		 */
		end: function() {
			try {
				request(
					{
						url: "/platform/session",
						body: JSON.stringify({
							channelUserId: $state.userId,
							time: session.timestamp
						}),
						method: "PATCH"
					},
					function(error, response, body) {
						if (error) {
							errorCallback && errorCallback(error);
						} else {
							var data = null;
							if (body) {
								var data = JSON.parse(body);
							}
							successCallback && successCallback(data);
						}
					}
				);
			} catch (error) {
				console.error(error);
			}
		}
	};
}

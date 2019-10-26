class MonoSayBotStorage {
  constructor(instance, options) {
    this.instance = instance;
    // console.log("instance", this.instance);
    this.options = Object.assign(
      {
        property: "session",
        store: {}
      },
      options
    );
  }

  getSession() {
    // console.log("get:key", this.options.userId);
    return new Promise((resolve, reject) => {
      var endpoints = [];
      if (this.options.userId) {
        endpoints.push({
          url: `state/channeluser/${this.options.userId}`,
          property: "userData"
        });
        // Maybe later
        // if (this.options.conversationId) {
        //   endpoints.push({
        //     url: `state/channeluser/${this.options.userId}/conversation/${this.options.conversationId}`,
        //     property: "privateConversationData"
        //   });
        // }
      }
      // Maybe later
      // if (
      //   this.options.store.persistConversationData &&
      //   this.options.store.conversationId
      // ) {
      //   endpoints.push({
      //     url: `state/conversation/${this.options.conversationId}`,
      //     property: "conversationData"
      //   });
      // }
      let data = {
        userData: {}
      };
      let monosay = this.instance;
      var async = require("async");

      async.each(
        endpoints,
        function(endpoint, callback) {
          monosay.request(endpoint.url, function(error, response, body) {
            if (error) {
              callback(error);
            } else {
              let bodyData = null;
              if (body) {
                bodyData = JSON.parse(body);
              }

              if (response.statusCode == 201 || response.statusCode == 200) {
                if (bodyData && bodyData.success) {
                  data[endpoint.property] = bodyData.data;
                  callback(null);
                } else {
                  callback(bodyData.message || bodyData.internalMessage);
                }
              } else {
                callback(`${request.statusCode} ${request.statusMessage}`);
              }
            }
          });
        },
        function(err) {
          if (!err) {
            resolve(data.userData || {});
          } else {
            var m = err.toString();
            reject(err instanceof Error ? err : new Error(m), null);
          }
        }
      );
    });
  }

  saveSession(session) {
    // console.log("set:key", this.options.userId);
    // console.table(session);
    // Save Session
    return new Promise((resolve, reject) => {
      var async = require("async");

      var endpoints = [];
      if (this.options.userId) {
        endpoints.push({
          url: `state/channeluser/${this.options.userId}`,
          data: JSON.stringify(session || {})
        });
        // Maybe later for conversation?
        // if (this.options.conversationId) {
        //   endpoints.push({
        //     url: `state/channeluser/${this.options.userId}/conversation/${this.options.conversationId}`,
        //     data: JSON.stringify(session || {})
        //   });
        // }
      }
      var monosay = this.instance;
      async.each(
        endpoints,
        function(endpoint, cb) {
          monosay.request(
            {
              url: endpoint.url,
              body: endpoint.data,
              method: "POST"
            },
            function(error, response, body) {
              if (error) {
                cb(error);
              } else {
                var bodyData = null;
                if (body) {
                  bodyData = JSON.parse(body);
                }

                if (response.statusCode == 201 || response.statusCode == 200) {
                  if (bodyData && bodyData.success) {
                    cb(null);
                  } else {
                    cb(bodyData.message || bodyData.internalMessage);
                  }
                } else {
                  cb(`${request.statusCode} ${request.statusMessage}`);
                }
              }
            }
          );
        },
        function(err) {
          if (!err) {
            resolve(session);
          } else {
            var m = err.toString();
            reject(err instanceof Error ? err : new Error(m), null);
          }
        }
      );
    });
  }

  middleware() {
    return (ctx, next) => {
      this.options.userId = ctx.from && ctx.from.id;
      this.options.conversationId = ctx.chat.id && ctx.chat.id;
      if (!this.options.userId || !this.options.conversationId) return next();

      return this.getSession().then(session => {
        // console.log("middleware", this.options.userId);
        // console.log(session);
        Object.defineProperty(ctx, this.options.property, {
          get: function() {
            return session;
          },
          set: function(newValue) {
            session = Object.assign({}, newValue);
          }
        });
        return next().then(() => this.saveSession(session));
      });
    };
  }
}

module.exports = MonoSayBotStorage;

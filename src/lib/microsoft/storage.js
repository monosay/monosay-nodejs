"use strict";
Object.defineProperty(exports, "__esModule", {
  value: true
});
var async = require("async");

var MonoSayBotStorage = (function () {
  function MonoSayBotStorage(monosay) {
    this.monosay = monosay;
  }
  MonoSayBotStorage.prototype.getData = function (context, callback) {
    var endpoints = [];

    if (context.userId) {
      if (context.persistUserData) {
        endpoints.push({
          url: `state/channeluser/${context.userId}`,
          property: 'userData'
        });
      }
      if (context.conversationId) {
        endpoints.push({
          url: `state/channeluser/${context.userId}/conversation/${context.conversationId}`,
          property: 'privateConversationData'
        });
      }
    }
    if (context.persistConversationData && context.conversationId) {
      endpoints.push({
        url: `state/conversation/${context.conversationId}`,
        property: 'conversationData'
      });
    }
    // *
    var data = {};
    var monosay = this.monosay;
    async.each(endpoints, function (endpoint, cb) {
      monosay.request(endpoint.url, function (error, response, body) {
        if (error) {
          cb(error);
        } else {
          var json = null;
          var bodyData = null;
          if (body) {
            bodyData = JSON.parse(body);
          }

          if (response.statusCode == 201 || response.statusCode == 200) {
            if (bodyData && bodyData.success) {
              data[endpoint.property] = bodyData.data;
              cb(null);
            } else {
              cb(bodyData.message || bodyData.internalMessage);
            }
          } else {
            cb(`${request.statusCode} ${request.statusMessage}`);
          }
        }
      });
    }, function (err) {
      if (!err) {
        callback(null, data);
      } else {
        var m = err.toString();
        callback(err instanceof Error ? err : new Error(m), null);
      }
    });
    // *
  };
  MonoSayBotStorage.prototype.saveData = function (context, data, callback) {
    var endpoints = [];
    if (context.userId) {
      if (context.persistUserData) {
        endpoints.push({
          url: `state/channeluser/${context.userId}`,
          data: JSON.stringify(data.userData || {})
        });
      }
      if (context.conversationId) {
        endpoints.push({
          url: `state/channeluser/${context.userId}/conversation/${context.conversationId}`,
          data: JSON.stringify(data.privateConversationData || {})
        });
      }
    }
    if (context.persistConversationData && context.conversationId) {
      endpoints.push({
        url: `state/conversation/${context.conversationId}`,
        data: JSON.stringify(data.conversationData || {})
      });
    }
    /// 
    var monosay = this.monosay;
    async.each(endpoints, function (endpoint, cb) {
      monosay.request({
        url: endpoint.url,
        body: endpoint.data,
        method: 'POST'
      }, function (error, response, body) {
        if (error) {
          cb(error);
        } else {
          var json = null;
          var bodyData = null;
          if (body) {
            bodyData = JSON.parse(body);
          }

          if (response.statusCode == 201 || response.statusCode == 200) {
            if (bodyData && bodyData.success) {
              data[endpoint.property] = bodyData.data;
              cb(null);
            } else {
              cb(bodyData.message || bodyData.internalMessage);
            }
          } else {
            cb(`${request.statusCode} ${request.statusMessage}`);
          }
        }
      });
    }, function (err) {
      if (!err) {
        callback(null);
      } else {
        var m = err.toString();
        callback(err instanceof Error ? err : new Error(m), null);
      }
    });
    ///
  };
  return MonoSayBotStorage;
}());
exports.MonoSayBotStorage = MonoSayBotStorage;

/* global __webpack_exports__ */
function workerSetup() {
  addEventListener('message', function (e) {
    var _e$data = e.data,
        type = _e$data.type,
        method = _e$data.method,
        id = _e$data.id,
        params = _e$data.params,
        f,
        p;

    if (type === 'RPC' && method) {
      if (f = __webpack_exports__[method]) {
        p = Promise.resolve().then(function () {
          return f.apply(__webpack_exports__, params);
        });
      } else {
        p = Promise.reject('No such method');
      }

      p.then(function (result) {
        postMessage({
          type: 'RPC',
          id: id,
          result: result
        });
      }).catch(function (e) {
        var message;

        try {
          message = e.message.toString();
        } catch (ex) {
          message = null;
        }

        var error = {
          message: message
        };

        if (e.stack) {
          error.stack = e.stack;
          error.name = e.name;
        }

        if (e.status) {
          error.status = e.status;
          error.responseJson = e.responseJson;
        }

        postMessage({
          type: 'RPC',
          id: id,
          error: error
        });
      });
    }
  });
  postMessage({
    type: 'RPC',
    method: 'ready'
  });
}

var workerScript = '\n' + Function.prototype.toString.call(workerSetup).replace(/(^.*\{|\}.*$|\n\s*)/g, '');
function rpcWorkerLoader(content, sourceMap) {
  var callback = this.async();
  callback(null, content + workerScript, sourceMap);
}

module.exports = rpcWorkerLoader;
//# sourceMappingURL=rpc-worker-loader.js.map

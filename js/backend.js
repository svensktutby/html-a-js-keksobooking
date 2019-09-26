'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var loadURL = URL + '/data';

  var statusCodesHTTP = {
    OK: 200,
    badRequest: 400,
    unauthorized: 401,
    notFound: 404,
    internalServerError: 500,
  };

  /**
   * Makes XMLHttpRequest
   * @param {string} method XMLHttpRequest method
   * @param {string} url Server url
   * @param {Function} onLoad Load handler
   * @param {Function} onError Error handler
   * @param {Object} data Object to send
   */
  var createXHR = function (method, url, onLoad, onError, data) {
    data = data || null;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case statusCodesHTTP.OK:
          onLoad(xhr.response);
          break;
        case statusCodesHTTP.badRequest:
          onError('Неверный запрос');
          break;
        case statusCodesHTTP.unauthorized:
          onError('Пользователь не авторизован');
          break;
        case statusCodesHTTP.notFound:
          onError('Ничего не найдено');
          break;
        case statusCodesHTTP.internalServerError:
          onError('Внутренняя ошибка сервера');
          break;
        default:
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open(method, url);
    xhr.send(data);
  };

  var load = function (onLoad, onError) {
    createXHR('GET', loadURL, onLoad, onError);
  };

  var save = function (data, onLoad, onError) {
    createXHR('POST', URL, onLoad, onError, data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();

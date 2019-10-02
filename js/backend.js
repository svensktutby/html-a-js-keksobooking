'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var loadURL = URL + '/data';

  var CodeHTTP = {
    SUCCESS: 200,
    BAD_REQUEST_ERROR: 400,
    UNAUTHORIZED_ERROR: 401,
    NOT_FOUND_ERROR: 404,
    SERVER_ERROR: 500,
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
        case CodeHTTP.SUCCESS:
          onLoad(xhr.response);
          break;
        case CodeHTTP.BAD_REQUEST_ERROR:
          onError('Неверный запрос');
          break;
        case CodeHTTP.UNAUTHORIZED_ERROR:
          onError('Пользователь не авторизован');
          break;
        case CodeHTTP.NOT_FOUND_ERROR:
          onError('Ничего не найдено');
          break;
        case CodeHTTP.SERVER_ERROR:
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

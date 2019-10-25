'use strict';

(function () {
  var UTILS = window.utils;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');

  var mapLimitPoint = {
    top: 130,
    bottom: 630,
    left: 0,
    right: parseInt(getComputedStyle(map).width, 10) // max width of map
  };

  var pinMainSize = {
    WIDTH: 62,
    HEIGHT: 82
  };

  /**
   * Returns text to Address input in Form
   * @param {Object} coords Pin coordinates
   * @return {string}
   */
  var getAddressValue = function (coords) {
    return coords.x + ', ' + coords.y;
  };

  /**
   * Returns Pin coordinates from the map
   * @param {Object} nodeItem Target DOM element
   * @param {Object} size Size of element
   * @return {Object}
   */

  var getMapPinCoordinates = function (nodeItem, size) {
    return {
      x: nodeItem.offsetLeft + (size.WIDTH / 2),
      y: nodeItem.offsetTop + (size.HEIGHT)
    };
  };

  var startMapPinMainAddressValue = getMapPinCoordinates(mapPinMain, pinMainSize);
  var startMapPinMainCoordinates = mapPinMain.getAttribute('style');

  var resetMapPinMain = function () {
    UTILS.setInputValue(adFormAddress, getAddressValue(startMapPinMainAddressValue));
    mapPinMain.setAttribute('style', startMapPinMainCoordinates);
  };

  var pinMainMousedownHandler = function (evt) {
    evt.preventDefault();

    var Coordinate = function (x, y) {
      this.x = x;
      this.y = y;
    };

    var startCoord = new Coordinate(evt.clientX, evt.clientY);

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = new Coordinate(moveEvt.clientX - startCoord.x, moveEvt.clientY - startCoord.y);

      startCoord = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentCoord = new Coordinate(mapPinMain.offsetLeft + shift.x, mapPinMain.offsetTop + shift.y);

      mapLimitPoint.right = parseInt(getComputedStyle(map).width, 10);

      if (currentCoord.x < mapLimitPoint.left) {
        currentCoord.x = mapPinMain.offsetLeft;
      } else if (currentCoord.x > mapLimitPoint.right - pinMainSize.WIDTH) {
        currentCoord.x = mapPinMain.offsetLeft;
      }

      if (currentCoord.y < mapLimitPoint.top || currentCoord.y > mapLimitPoint.bottom) {
        currentCoord.y = mapPinMain.offsetTop;
      }

      mapPinMain.style.left = currentCoord.x + 'px';
      mapPinMain.style.top = currentCoord.y + 'px';
      UTILS.setInputValue(adFormAddress, getAddressValue(getMapPinCoordinates(mapPinMain, pinMainSize)));
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  window.pin = {
    resetMapPinMain: resetMapPinMain,
    pinMainMousedownHandler: pinMainMousedownHandler
  };
})();

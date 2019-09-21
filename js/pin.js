'use strict';

(function () {
  var UTILS = window.utils;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');

  var mapLimitPoints = {
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

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: moveEvt.clientX - startCoords.x,
        y: moveEvt.clientY - startCoords.y
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentCoords = {
        x: mapPinMain.offsetLeft + shift.x,
        y: mapPinMain.offsetTop + shift.y
      };

      mapLimitPoints.right = parseInt(getComputedStyle(map).width, 10);

      if (currentCoords.x < mapLimitPoints.left) {
        currentCoords.x = mapPinMain.offsetLeft;
      } else if (currentCoords.x > mapLimitPoints.right - pinMainSize.WIDTH) {
        currentCoords.x = mapPinMain.offsetLeft;
      }

      if (currentCoords.y < mapLimitPoints.top || currentCoords.y > mapLimitPoints.bottom) {
        currentCoords.y = mapPinMain.offsetTop;
      }

      mapPinMain.style.left = currentCoords.x + 'px';
      mapPinMain.style.top = currentCoords.y + 'px';
      UTILS.setInputValue(adFormAddress, getAddressValue(getMapPinCoordinates(mapPinMain, pinMainSize)));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  window.pin = {
    resetMapPinMain: resetMapPinMain,
    pinMainMousedownHandler: pinMainMousedownHandler
  };
})();

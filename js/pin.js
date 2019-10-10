'use strict';

(function () {
  var UTILS = window.utils;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = adForm.querySelector('#address');

  var MapLimitPoint = {
    top: 130,
    bottom: 630,
    left: 0,
    right: parseInt(getComputedStyle(map).width, 10) // max width of map
  };

  var PinMainSize = {
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

  var startMapPinMainAddressValue = getMapPinCoordinates(mapPinMain, PinMainSize);
  var startMapPinMainCoordinates = mapPinMain.getAttribute('style');

  var resetMapPinMain = function () {
    UTILS.setInputValue(adFormAddress, getAddressValue(startMapPinMainAddressValue));
    mapPinMain.setAttribute('style', startMapPinMainCoordinates);
  };

  var pinMainMousedownHandler = function (evt) {
    evt.preventDefault();

    var StartCoord = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var Shift = {
        x: moveEvt.clientX - StartCoord.x,
        y: moveEvt.clientY - StartCoord.y
      };

      StartCoord = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var CurrentCoord = {
        x: mapPinMain.offsetLeft + Shift.x,
        y: mapPinMain.offsetTop + Shift.y
      };

      MapLimitPoint.right = parseInt(getComputedStyle(map).width, 10);

      if (CurrentCoord.x < MapLimitPoint.left) {
        CurrentCoord.x = mapPinMain.offsetLeft;
      } else if (CurrentCoord.x > MapLimitPoint.right - PinMainSize.WIDTH) {
        CurrentCoord.x = mapPinMain.offsetLeft;
      }

      if (CurrentCoord.y < MapLimitPoint.top || CurrentCoord.y > MapLimitPoint.bottom) {
        CurrentCoord.y = mapPinMain.offsetTop;
      }

      mapPinMain.style.left = CurrentCoord.x + 'px';
      mapPinMain.style.top = CurrentCoord.y + 'px';
      UTILS.setInputValue(adFormAddress, getAddressValue(getMapPinCoordinates(mapPinMain, PinMainSize)));
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

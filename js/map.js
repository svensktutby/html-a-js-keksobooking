'use strict';

(function () {
  var UTILS = window.utils;

  var map = document.querySelector('.map');
  var pinList = document.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  /**
   * Renders Popup Pin
   * @param {Object} pinNode DocumentFragment element
   * @param {Object} pinData Dwelling data
   * @return {Object}
   */
  var renderPin = function (pinNode, pinData) {
    var pinItem = pinNode.cloneNode(true);
    var pinImg = pinItem.querySelector('img');

    pinItem.style.left = pinData.location.x + 'px';
    pinItem.style.top = pinData.location.y + 'px';
    pinImg.src = pinData.author.avatar;
    pinImg.alt = pinData.offer.title;
    return pinItem;
  };

  /**
   * Places Popup Pins on the map
   * @param {Object} pinListNode Target DOM element
   * @param {Object} pinNode DocumentFragment element
   * @param {Array} pinListData Dwellings data
   */
  var setPinList = function (pinListNode, pinNode, pinListData) {
    var fragment = document.createDocumentFragment();
    pinListData.forEach(function (item) {
      fragment.appendChild(renderPin(pinNode, item));
    });
    pinListNode.appendChild(fragment);
  };


  var activatePage = function () {
    UTILS.removeCssClass(map, 'map--faded');
    UTILS.removeCssClass(adForm, 'ad-form--disabled');
    UTILS.toggleDisable(adFormFieldsets, false);
    setPinList(pinList, pinTemplate, window.data.dwellingAds);
    pinList.addEventListener('click', window.card.pinClickHandler);
    mapPinMain.removeEventListener('mousedown', activatePage);
    window.form.initFormHandlers();
  };

  var initPage = function () {
    UTILS.toggleDisable(adFormFieldsets, true);
    window.pin.resetMapPinMain();
    pinList.removeEventListener('click', window.card.pinClickHandler);
    mapPinMain.addEventListener('mousedown', activatePage);
    mapPinMain.addEventListener('mousedown', window.pin.pinMainMousedownHandler);
  };

  initPage();

  window.map = {
    initPage: initPage
  };
})();


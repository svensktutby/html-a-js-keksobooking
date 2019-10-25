'use strict';

(function () {
  var UTILS = window.utils;

  var map = document.querySelector('.map');
  var pinListContainer = document.querySelector('.map__pins');
  var mapPinMain = map.querySelector('.map__pin--main');
  var template = document.querySelector('template');
  var pinTemplate = template.content.querySelector('.map__pin');
  var adTemplate = template.content.querySelector('.map__card');

  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');

  var MAX_PINS_ON_MAP = 5;
  var housingData = [];

  var pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };

  /**
   * Renders Popup Pin
   * @param {Object} pinNode DocumentFragment element
   * @param {Object} pinData Housing data
   * @param {Object} size Pin size
   * @return {Object}
   */
  var renderPin = function (pinNode, pinData, size) {
    var pinItem = pinNode.cloneNode(true);
    var pinImg = pinItem.querySelector('img');

    pinItem.style.left = pinData.location.x - (size.WIDTH / 2) + 'px';
    pinItem.style.top = pinData.location.y - size.HEIGHT + 'px';
    pinItem.dataset.index = '' + pinData.id;
    pinImg.src = pinData.author.avatar;
    pinImg.alt = pinData.offer.title;
    return pinItem;
  };

  /**
   * Places Popup Pins on the map
   * @param {Object} pinListNode Target DOM element
   * @param {Array} pinListData Housings data
   */
  var setPinList = function (pinListNode, pinListData) {
    var fragment = document.createDocumentFragment();
    var clonePinListData = pinListData.slice(0, MAX_PINS_ON_MAP);
    clonePinListData.forEach(function (item) {
      fragment.appendChild(renderPin(pinTemplate, item, pinSize));
    });
    pinListNode.appendChild(fragment);
  };

  /**
   * Adds an ad on the map if the pin was pressed or clicked
   * @param {Object} evt
   */
  var pinClickHandler = function (evt) {
    var target = evt.target;
    var mapPins = map.querySelectorAll('.map__pin');
    var targetPin = target.closest('.map__pin');
    if (!targetPin || target.closest('.map__pin--main')) {
      evt.stopPropagation();
    } else {
      var targetInx = +targetPin.dataset.index;
      UTILS.toggleClass(mapPins, 'map__pin--active', false);
      UTILS.toggleClass(targetPin, 'map__pin--active', true);
      window.card.closeCard();
      window.card.setAd(adTemplate, housingData, targetInx);
    }
  };

  var successHandler = function (data) {
    housingData = data;
    housingData.forEach(function (item, index) {
      item.id = index;
    });
    setPinList(pinListContainer, data);
    pinListContainer.addEventListener('click', pinClickHandler);
    window.filter.activateFilters(housingData);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    var TIMEOUT = 5000;
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'fixed';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      document.body.removeChild(node);
    }, TIMEOUT);
  };

  var activatePage = function () {
    UTILS.removeCssClass(map, 'map--faded');
    UTILS.removeCssClass(adForm, 'ad-form--disabled');
    UTILS.toggleDisable(adFormFieldsets, false);

    mapPinMain.removeEventListener('mousedown', activatePage);
    window.form.initAdFormHandlers();
    window.images.addHandlers();
    window.backend.load(successHandler, errorHandler);
  };

  var initPage = function () {
    UTILS.toggleDisable(adFormFieldsets, true);
    window.pin.resetMapPinMain();
    pinListContainer.removeEventListener('click', pinClickHandler);
    mapPinMain.addEventListener('mousedown', activatePage);
    mapPinMain.addEventListener('mousedown', window.pin.pinMainMousedownHandler);
  };

  initPage();

  window.map = {
    setPinList: setPinList,
    errorHandler: errorHandler,
    initPage: initPage
  };
})();


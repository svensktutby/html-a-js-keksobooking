'use strict';

(function () {
  var UTILS = window.utils;

  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var template = document.querySelector('template');
  var adTemplate = template.content.querySelector('.map__card');

  /**
   * Writes text if the element has a CSS class
   * @param {Object} nodeItem Target DOM element
   * @param {string} patternClass CSS class of an element
   * @param {string} modifier CSS class modifier
   */
  var writeTextIfHasClass = function (nodeItem, patternClass, modifier) {
    if (nodeItem.classList.contains(patternClass + '--' + modifier)) {
      nodeItem.textContent = modifier;
    }
  };

  /**
   * Renders an advertising
   * @param {Object} adNode DocumentFragment element
   * @param {Object} adData Dwelling data
   * @return {Object}
   */
  var renderAd = function (adNode, adData) {
    var adItem = adNode.cloneNode(true);
    var adTitle = adItem.querySelector('.popup__title');
    var adAddress = adItem.querySelector('.popup__text--address');
    var adPrice = adItem.querySelector('.popup__text--price');
    var adType = adItem.querySelector('.popup__type');
    var adCapacity = adItem.querySelector('.popup__text--capacity');
    var adTime = adItem.querySelector('.popup__text--time');
    var adFeatures = adItem.querySelectorAll('.popup__feature');
    var adDescription = adItem.querySelector('.popup__description');
    var adPhotos = adItem.querySelector('.popup__photos');
    var adAvatar = adItem.querySelector('.popup__avatar');

    adTitle.textContent = adData.offer.title;
    adAddress.textContent = adData.offer.address;
    adPrice.textContent = adData.offer.price + '₽/ночь';
    adType.textContent = adData.offer.type;
    adCapacity.textContent = adData.offer.rooms + ' комнаты для ' + adData.offer.guests + ' гостей';
    adTime.textContent = 'Заезд после ' + adData.offer.checkin + ', выезд до ' + adData.offer.checkout;
    adDescription.textContent = adData.offer.description;
    adAvatar.src = adData.author.avatar;

    var setAdFeatures = function () {
      adData.offer.features.forEach(function (item) {
        for (var i = 0; i < adFeatures.length; i++) {
          writeTextIfHasClass(adFeatures[i], 'popup__feature', item);
        }
      });
      UTILS.removeEmptyElements(adFeatures);
    };

    var setAdPhotos = function () {
      var img = adPhotos.querySelector('.popup__photo');
      img.src = adData.offer.photos[0];
      for (var i = 1; i < adData.offer.photos.length; i++) {
        var newImg = img.cloneNode(true);
        newImg.src = adData.offer.photos[i];
        adPhotos.appendChild(newImg);
      }
    };

    setAdFeatures();
    setAdPhotos();

    return adItem;
  };

  /**
   * Places ad on the map and adds some handlers
   * @param {Object} adNode DocumentFragment element
   * @param {Object} adData Dwelling data
   * @param {number} inx Ad index from the Dwelling data
   */
  var setAd = function (adNode, adData, inx) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(renderAd(adNode, adData[inx]));
    map.insertBefore(fragment, mapFiltersContainer);

    var mapCard = map.querySelector('.map__card');
    var popupClose = mapCard.querySelector('.popup__close');
    popupClose.addEventListener('click', closeCard);
    popupClose.addEventListener('keydown', UTILS.keyPressHandler(UTILS.ENTER, closeCard));
    document.addEventListener('keydown', escPressCloseHandler);
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
      var targetInx = Array.from(mapPins).indexOf(targetPin);
      UTILS.toggleClass(mapPins, 'map__pin--active', false);
      UTILS.toggleClass(targetPin, 'map__pin--active', true);
      closeCard();
      setAd(adTemplate, window.data.dwellingAds, targetInx - 1);
    }
  };

  /**
   * Removes the ad from the map
   */
  var closeCard = function () {
    UTILS.removeNodeItem(map, '.map__card');
    document.removeEventListener('keydown', escPressCloseHandler);
  };

  var escPressCloseHandler = UTILS.keyPressHandler(UTILS.ESCAPE, closeCard);

  window.card = {
    pinClickHandler: pinClickHandler
  };

})();

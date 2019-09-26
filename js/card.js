'use strict';

(function () {
  var UTILS = window.utils;

  var map = document.querySelector('.map');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

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
   * Returns the type of dwelling in Russian
   * @param {string} type Type in English
   * @return {string}
   */
  var getDwellingTypeInRussian = function (type) {
    var dwellingTypeRu = '';
    switch (type) {
      case 'palace':
        dwellingTypeRu = 'Дворец';
        break;
      case 'flat':
        dwellingTypeRu = 'Квартира';
        break;
      case 'house':
        dwellingTypeRu = 'Дом';
        break;
      case 'bungalo':
        dwellingTypeRu = 'Бунгало';
        break;
      default:
        dwellingTypeRu = 'Неизвестный тип жилища';
    }
    return dwellingTypeRu;
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
    adType.textContent = getDwellingTypeInRussian(adData.offer.type);
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
      if (adData.offer.photos[0]) {
        img.src = adData.offer.photos[0];
        for (var i = 1; i < adData.offer.photos.length; i++) {
          var newImg = img.cloneNode(true);
          newImg.src = adData.offer.photos[i];
          adPhotos.appendChild(newImg);
        }
      } else {
        img.parentElement.removeChild(img);
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
   * Removes the ad from the map
   */
  var closeCard = function () {
    UTILS.removeNodeItem(map, '.map__card');
    document.removeEventListener('keydown', escPressCloseHandler);
  };

  var escPressCloseHandler = UTILS.keyPressHandler(UTILS.ESCAPE, closeCard);

  window.card = {
    setAd: setAd,
    closeCard: closeCard
  };

})();

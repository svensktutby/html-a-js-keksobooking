'use strict';

var UTILS = window.utils;

// *************************************************** DOM elements
var map = document.querySelector('.map');
var pinList = document.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var adTemplate = template.content.querySelector('.map__card');

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var adFormAddress = adForm.querySelector('#address');
var adFormType = adForm.querySelector('#type');
var adFormPrice = adForm.querySelector('#price');
var adFormTimein = adForm.querySelector('#timein');
var adFormTimeout = adForm.querySelector('#timeout');
var adFormRoomNumber = adForm.querySelector('#room_number');
var adFormCapacity = adForm.querySelector('#capacity');
var adFormCapacityOptions = adFormCapacity.querySelectorAll('option');
var adFormSubmit = adForm.querySelector('.ad-form__submit');
var adFormReset = adForm.querySelector('.ad-form__reset');
var successMessage = document.querySelector('.success');
var adFormRequireds = adForm.querySelectorAll('[required]');

// *************************************************** Pin
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

// *************************************************** Form
var minDwellingPrice = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

var timeStamps = ['12:00', '13:00', '14:00'];

var roomForGuest = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

var adFormPriceHandler = function () {
  for (var item in minDwellingPrice) {
    if (item === adFormType.value) {
      adFormPrice.placeholder = minDwellingPrice[item];
    }
  }
};

var adFormTimeHandler = function (evt) {
  var target = evt.target;
  timeStamps.forEach(function (item) {
    if (target === adFormTimein && item === adFormTimein.value) {
      adFormTimeout.value = adFormTimein.value;
    } else if (target === adFormTimeout && item === adFormTimeout.value) {
      adFormTimein.value = adFormTimeout.value;
    }
  });
};

var adFormRoomsHandler = function () {
  var selectedRoomNumber = roomForGuest[adFormRoomNumber.value];
  for (var i = 0; i < adFormCapacityOptions.length; i++) {
    adFormCapacityOptions[i].disabled = true;
    selectedRoomNumber.forEach(function (item) {
      if (adFormCapacityOptions[i].value === item) {
        adFormCapacityOptions[i].disabled = false;
        adFormCapacityOptions[i].selected = true;
      }
    });
  }
};

var successClickHandler = function () {
  successMessage.classList.add('hidden');
  successMessage.removeEventListener('click', successClickHandler);
  document.removeEventListener('keydown', successPressEscHandler);
};

var successPressEscHandler = UTILS.keyPressHandler(UTILS.ESCAPE, successClickHandler);

var adFormResetHandler = function () {
  adForm.reset();
  initPage();
  resetMapPinMain();
  var mapPins = map.querySelectorAll('.map__pin');
  var invalidElements = adForm.querySelectorAll('.ad-form__element--invalid');
  UTILS.removeNodeItem(map, '.map__card');
  mapPins.forEach(function (item) {
    if (item !== mapPinMain) {
      item.parentElement.removeChild(item);
    }
  });
  if (invalidElements.length) {
    invalidElements.forEach(function (item) {
      UTILS.toggleClass(item, 'ad-form__element--invalid', false);
    });
  }
  UTILS.toggleClass(map, 'map--faded', true);
  adForm.classList.add('ad-form--disabled');
};

/**
 * Validates and submits adForm
 * @param {Object} evt
 */
var adFormSubmitHandler = function (evt) {
  var invalidRequireds = [];
  for (var i = 0; i < adFormRequireds.length; i++) {
    var adFieldset = adFormRequireds[i].closest('.ad-form__element');
    if (!adFormRequireds[i].validity.valid) {
      invalidRequireds.push(adFormRequireds[i]);
      UTILS.toggleClass(adFieldset, 'ad-form__element--invalid', true);
    } else {
      UTILS.toggleClass(adFieldset, 'ad-form__element--invalid', false);
    }
  }
  if (invalidRequireds.length) {
    evt.preventDefault();
  } else {
    successMessage.classList.remove('hidden');
    successMessage.addEventListener('click', successClickHandler);
    document.addEventListener('keydown', successPressEscHandler);
  }
};

var initFormHandlers = function () {
  adFormType.addEventListener('change', adFormPriceHandler);
  adFormTimein.addEventListener('change', adFormTimeHandler);
  adFormTimeout.addEventListener('change', adFormTimeHandler);
  adFormRoomsHandler();
  adFormRoomNumber.addEventListener('change', adFormRoomsHandler);
  adFormSubmit.addEventListener('click', adFormSubmitHandler);
  adFormReset.addEventListener('click', adFormResetHandler);
};

// *************************************************** Map
var ADS_QUANTITY = 8;

var AUTHOR_DATA = {
  AVATAR_PATH: './img/avatars/user',
  AVATAR_EXTENSION: '.png'
};

var DWELLING_DATA = {
  TITLES: [
    'Большая уютная квартира',
    'Маленькая неуютная квартира',
    'Огромный прекрасный дворец',
    'Маленький ужасный дворец',
    'Красивый гостевой домик',
    'Некрасивый негостеприимный домик',
    'Уютное бунгало далеко от моря',
    'Неуютное бунгало по колено в воде'
  ],
  location: {
    X_MIN: 300,
    X_MAX: 900,
    Y_MIN: 130,
    Y_MAX: 630
  },
  price: {
    MIN: 1000,
    MAX: 1000000
  },
  rooms: {
    MIN: 1,
    MAX: 5
  },
  guests: {
    MIN: 1,
    MAX: 25
  },
  TYPES: [
    'palace',
    'flat',
    'house',
    'bungalo'
  ],
  CHECKIN_CHECKOUT: [
    '12:00',
    '13:00',
    '14:00'
  ],
  FEATURES: [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner'
  ],
  PHOTOS: [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ]
};

/**
 * Returns the full path to an avatar image
 * @param {number} num Avatar image number
 * @return {string}
 */
var getAvatarPath = function (num) {
  var numAvatar = num > 9 ? num : '0' + num;
  return AUTHOR_DATA.AVATAR_PATH + numAvatar + AUTHOR_DATA.AVATAR_EXTENSION;
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
 * Returns info for dwelling advertisement
 * @param {Object} data Dataset object
 * @param {number} index
 * @return {Object}
 */
var getRandomDwelling = function (data, index) {
  var locationX = UTILS.getRandomInt(data.location.X_MIN, data.location.X_MAX);
  var locationY = UTILS.getRandomInt(data.location.Y_MIN, data.location.Y_MAX);

  return {
    author: {
      avatar: getAvatarPath(index + 1)
    },
    offer: {
      title: UTILS.shuffleArray(data.TITLES, false)[index],
      address: locationX + ', ' + locationY,
      price: UTILS.getRandomInt(data.price.MIN, data.price.MAX),
      type: getDwellingTypeInRussian(UTILS.getRandomArrayItem(data.TYPES)),
      rooms: UTILS.getRandomInt(data.rooms.MIN, data.rooms.MAX),
      guests: UTILS.getRandomInt(data.guests.MIN, data.guests.MAX),
      checkin: UTILS.getRandomArrayItem(data.CHECKIN_CHECKOUT),
      checkout: UTILS.getRandomArrayItem(data.CHECKIN_CHECKOUT),
      features: UTILS.shuffleArray(data.FEATURES, true),
      description: '',
      photos: UTILS.shuffleArray(data.PHOTOS, false)
    },
    location: {
      x: locationX,
      y: locationY
    }
  };
};

/**
 * Returns an array with some random dwelling advertisements
 * @param {number} num Quantity of advertisements
 * @return {Array}
 */
var getRandomDwellingAds = function (num) {
  var randomDwellingAds = [];
  for (var i = 0; i < num; i++) {
    randomDwellingAds.push(getRandomDwelling(DWELLING_DATA, i));
  }
  return randomDwellingAds;
};

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
    setAd(adTemplate, dwellingAds, targetInx - 1);
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

var activatePage = function () {
  UTILS.removeCssClass(map, 'map--faded');
  UTILS.removeCssClass(adForm, 'ad-form--disabled');
  UTILS.toggleDisable(adFormFieldsets, false);
  setPinList(pinList, pinTemplate, dwellingAds);
  pinList.addEventListener('click', pinClickHandler);
  mapPinMain.removeEventListener('mousedown', activatePage);
  initFormHandlers();
};

var initPage = function () {
  UTILS.toggleDisable(adFormFieldsets, true);
  UTILS.setInputValue(adFormAddress, getAddressValue(getMapPinCoordinates(mapPinMain, pinMainSize)));
  mapPinMain.addEventListener('mousedown', activatePage);
  mapPinMain.addEventListener('mousedown', pinMainMousedownHandler);
};

// Generated advertisements data array
var dwellingAds = getRandomDwellingAds(ADS_QUANTITY);

initPage();



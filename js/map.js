'use strict';

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

var map = document.querySelector('.map');
var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var mapFiltersContainer = document.querySelector('.map__filters-container');
var pinList = document.querySelector('.map__pins');
var template = document.querySelector('template');
var pinTemplate = template.content.querySelector('.map__pin');
var adTemplate = template.content.querySelector('.map__card');

/**
 * Returns a random number between min and max
 * @param {number} min (inclusive)
 * @param {number} max (exclusive)
 * @return {number} integer number
 */
var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * Returns a random item from an array
 * @param {Array} arr An array containing items
 * @return {string|number|boolean|null|undefined|Object}
 */
var getRandomArrayItem = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Shuffles array in place
 * @param {Array} arr An array containing items
 * @param {boolean} isLength Flag for decrease the array length
 * @return {Array}
 */
var shuffleArray = function (arr, isLength) {
  var length = !isLength ? arr.length : getRandomInt(0, arr.length);
  for (var i = length - 1; i > 0; i--) {
    var random = Math.floor(Math.random() * length);
    var choosen = arr[i];
    arr[i] = arr[random];
    arr[random] = choosen;
  }
  return arr.slice(0, length);
};

/**
 * Returns full path to an avatar image
 * @param {number} num Number of an avatar image
 * @return {string}
 */
var getAvatarPath = function (num) {
  var numAvatar = num > 9 ? num : '0' + num;
  return AUTHOR_DATA.AVATAR_PATH + numAvatar + AUTHOR_DATA.AVATAR_EXTENSION;
};

/**
 * Returns type of a dwelling in Russian
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
 * Returns info for a dwelling advertisement
 * @param {Object} data Dataset object
 * @param {number} index
 * @return {Object}
 */
var getRandomDwelling = function (data, index) {
  var locationX = getRandomInt(data.location.X_MIN, data.location.X_MAX);
  var locationY = getRandomInt(data.location.Y_MIN, data.location.Y_MAX);

  return {
    author: {
      avatar: getAvatarPath(index + 1)
    },
    offer: {
      title: shuffleArray(data.TITLES, false)[index],
      address: locationX + ', ' + locationY,
      price: getRandomInt(data.price.MIN, data.price.MAX),
      type: getDwellingTypeInRussian(getRandomArrayItem(data.TYPES)),
      rooms: getRandomInt(data.rooms.MIN, data.rooms.MAX),
      guests: getRandomInt(data.guests.MIN, data.guests.MAX),
      checkin: getRandomArrayItem(data.CHECKIN_CHECKOUT),
      checkout: getRandomArrayItem(data.CHECKIN_CHECKOUT),
      features: shuffleArray(data.FEATURES, true),
      description: '',
      photos: shuffleArray(data.PHOTOS, false)
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
 * Writes text if element has the CSS class
 * @param {Object} elemNode Target DOM element
 * @param {string} patternClass CSS class of an element
 * @param {string} modifier CSS class modifier
 */
var writeTextIfHasClass = function (elemNode, patternClass, modifier) {
  if (elemNode.classList.contains(patternClass + '--' + modifier)) {
    elemNode.textContent = modifier;
  }
};

/**
 * Removes empty DOM elements
 * @param {Object} list NodeList elements
 */
var removeEmptyElements = function (list) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].textContent === '') {
      list[i].parentElement.removeChild(list[i]);
    }
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

  var getAdFeatures = function () {
    adData.offer.features.forEach(function (item) {
      for (var i = 0; i < adFeatures.length; i++) {
        writeTextIfHasClass(adFeatures[i], 'popup__feature', item);
      }
    });
    removeEmptyElements(adFeatures);
  };

  var getAdPhotos = function () {
    var img = adPhotos.querySelector('.popup__photo');
    img.src = adData.offer.photos[0];
    for (var i = 1; i < adData.offer.photos.length; i++) {
      var newImg = img.cloneNode(true);
      newImg.src = adData.offer.photos[i];
      adPhotos.appendChild(newImg);
    }
  };

  getAdFeatures();
  getAdPhotos();

  return adItem;
};

/**
 * Places an Ad on the map
 * @param {Object} adNode DocumentFragment element
 * @param {Object} adData Dwelling data
 */
var setAd = function (adNode, adData) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(renderAd(adNode, adData));
  map.insertBefore(fragment, mapFiltersContainer);
};

/**
 * Toggles attribute disabled for Form elements
 * @param {Object} list NodeList elements
 * @param {boolean} flag
 */
var toggleDisable = function (list, flag) {
  list.forEach(function (item) {
    item.disabled = flag;
  });
};

// The generated array with advertisements data
var dwellingAds = getRandomDwellingAds(ADS_QUANTITY);

// adForm.classList.remove('ad-form--disabled');
toggleDisable(adFormFieldsets, true);

// if (map.classList.contains('map--faded')) {
//   map.classList.remove('map--faded');
// }

// setPinList(pinList, pinTemplate, dwellingAds);
// setAd(adTemplate, dwellingAds[0]);



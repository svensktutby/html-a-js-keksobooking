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
 * @param {Array} arr An array containing the items
 * @return {string|number|boolean|null|undefined|Object}
 */
var getRandomItemFromArray = function (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Shuffles array in place
 * @param {Array} arr An array containing the items
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
 * Returns full path to the avatar image
 * @param {number} num Number of the avatar image
 * @return {string}
 */
var getAvatarPath = function (num) {
  var numAvatar = num > 9 ? num : '0' + num;
  return AUTHOR_DATA.AVATAR_PATH + numAvatar + AUTHOR_DATA.AVATAR_EXTENSION;
};

/**
 * Returns type of the dwelling in Russian
 * @param {string} type Type in English
 * @return {string}
 */
var getDwellingTypeinRussian = function (type) {
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
 * Returns object for an advertisement
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
      type: getDwellingTypeinRussian(getRandomItemFromArray(data.TYPES)),
      rooms: getRandomInt(data.rooms.MIN, data.rooms.MAX),
      guests: getRandomInt(data.guests.MIN, data.guests.MAX),
      checkin: getRandomItemFromArray(data.CHECKIN_CHECKOUT),
      checkout: getRandomItemFromArray(data.CHECKIN_CHECKOUT),
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
 * Returns array with num random dwelling ads
 * @param {number} num Quantity of ads
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
 * @param {Object} pinNode The DocumentFragment element
 * @param {Object} pinData The dwelling data
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
 * @param {Object} pinListNode The target DOM element
 * @param {Object} pinNode The DocumentFragment element
 * @param {Array} pinListData The dwellings data
 */
var setPinList = function (pinListNode, pinNode, pinListData) {
  var fragment = document.createDocumentFragment();
  pinListData.forEach(function (item) {
    fragment.appendChild(renderPin(pinNode, item));
  });
  pinListNode.appendChild(fragment);
};

var dwellingAds = getRandomDwellingAds(ADS_QUANTITY);

setPinList(pinList, pinTemplate, dwellingAds);

if (map.classList.contains('map--faded')) {
  map.classList.remove('map--faded');
}


'use strict';

(function () {
  var UTILS = window.utils;
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

  // Generated advertisements data array
  var dwellingAds = getRandomDwellingAds(ADS_QUANTITY);

  window.data = {
    dwellingAds: dwellingAds
  };
})();

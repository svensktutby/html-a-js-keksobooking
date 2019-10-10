'use strict';

(function () {
  var UTILS = window.utils;

  var DEBOUNCE_DELAY = 500;
  var defaultData = [];
  var filteredData = [];
  var priceRange = {
    low: {
      MIN: 0,
      MAX: 9999
    },
    middle: {
      MIN: 10000,
      MAX: 49999
    },
    high: {
      MIN: 50000,
      MAX: Infinity
    }
  };

  var pinListContainer = document.querySelector('.map__pins');
  var mapFilters = document.querySelector('.map__filters');
  var housingType = mapFilters.querySelector('#housing-type');
  var housingPrice = mapFilters.querySelector('#housing-price');
  var housingRooms = mapFilters.querySelector('#housing-rooms');
  var housingGuests = mapFilters.querySelector('#housing-guests');
  var housingFeatures = mapFilters.querySelector('#housing-features');

  var removePins = function () {
    var pinList = pinListContainer.querySelectorAll('.map__pin');
    pinList.forEach(function (item) {
      if (!item.classList.contains('map__pin--main')) {
        item.parentElement.removeChild(item);
      }
    });
  };

  /**
   * Returns filtered data
   * @param {Object} filterNode
   * @param {string} offerFilter
   * @return {Array}
   */
  var filterHousingData = function (filterNode, offerFilter) {
    var value = filterNode.value;

    if (value !== 'any') {
      filteredData = filteredData.filter(function (item) {
        switch (offerFilter) {
          case 'price':
            return item.offer[offerFilter] >= priceRange[value].MIN && item.offer[offerFilter] < priceRange[value].MAX;
          case 'features':
            var checkedBoxes = filterNode.querySelectorAll('input:checked');
            return Array.from(checkedBoxes).every(function (elem) {
              return item.offer[offerFilter].includes(elem.value);
            });
          default:
            return item.offer[offerFilter].toString() === value;
        }
      });
    }
    return filteredData;
  };

  var filterHousingFields = function () {
    filteredData = defaultData.slice();

    filterHousingData(housingType, 'type');
    filterHousingData(housingRooms, 'rooms');
    filterHousingData(housingPrice, 'price');
    filterHousingData(housingGuests, 'guests');
    filterHousingData(housingFeatures, 'features');
  };

  var housingChangeHandler = UTILS.debounce(function () {
    filterHousingFields();
    removePins();
    window.card.closeCard();
    window.map.setPinList(pinListContainer, filteredData);
  }, DEBOUNCE_DELAY);

  var activateFilters = function (data) {
    defaultData = data.slice();
    mapFilters.addEventListener('change', housingChangeHandler);
  };

  var deactivateFilters = function () {
    mapFilters.removeEventListener('change', housingChangeHandler);
  };

  window.filter = {
    activateFilters: activateFilters,
    deactivateFilters: deactivateFilters,
    removePins: removePins
  };
})();

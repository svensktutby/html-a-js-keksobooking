'use strict';

(function () {
  var UTILS = window.utils;

  var map = document.querySelector('.map');
  var mapPinMain = map.querySelector('.map__pin--main');

  var adForm = document.querySelector('.ad-form');
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

  var adFormSubmitHandler = function () {
    successMessage.classList.remove('hidden');
    successMessage.addEventListener('click', successClickHandler);
    document.addEventListener('keydown', successPressEscHandler);
    adFormResetHandler();
  };

  var successClickHandler = function () {
    successMessage.classList.add('hidden');
    successMessage.removeEventListener('click', successClickHandler);
    document.removeEventListener('keydown', successPressEscHandler);
  };

  var successPressEscHandler = UTILS.keyPressHandler(UTILS.ESCAPE, successClickHandler);

  var adFormResetHandler = function () {
    adForm.reset();
    window.map.initPage();
    window.pin.resetMapPinMain();
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
   * Validates adForm
   * @param {Object} evt
   */
  var adFormBtnSubmitHandler = function (evt) {
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
      window.map.errorHandler('Неправильно заполнены поля, помеченные красной рамкой');
    } else {
      evt.preventDefault();
      var data = new FormData(adForm);
      window.backend.save(data, adFormSubmitHandler, window.map.errorHandler);
    }
  };

  var initFormHandlers = function () {
    adFormType.addEventListener('change', adFormPriceHandler);
    adFormTimein.addEventListener('change', adFormTimeHandler);
    adFormTimeout.addEventListener('change', adFormTimeHandler);
    adFormRoomsHandler();
    adFormRoomNumber.addEventListener('change', adFormRoomsHandler);
    adFormSubmit.addEventListener('click', adFormBtnSubmitHandler);
    adFormReset.addEventListener('click', adFormResetHandler);
  };

  window.form = {
    initFormHandlers: initFormHandlers
  };
})();

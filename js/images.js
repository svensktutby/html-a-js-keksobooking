'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var adForm = document.querySelector('.ad-form');
  var avatarChooser = adForm.querySelector('.ad-form-header__input');
  var avatarPreview = adForm.querySelector('.ad-form-header__preview img');
  var housingImageChooser = adForm.querySelector('.ad-form__input');
  var housingImagePreview = adForm.querySelector('.ad-form__photo');
  var housingImagePreviewContainer = adForm.querySelector('.ad-form__photo-container');

  var defaultAvatarSrc = avatarPreview.src;

  var resetLoadedImages = function () {
    avatarPreview.src = defaultAvatarSrc;

    var housingImagePreviewList = adForm.querySelectorAll('.ad-form__photo');

    for (var i = 0; i < housingImagePreviewList.length - 1; i++) {
      housingImagePreviewContainer.removeChild(housingImagePreviewList[i]);
    }
  };

  var imageLoadChangeHandler = function (loadHandler) {
    return function (evt) {
      var file = evt.currentTarget.files[0];

      if (file) {
        var fileName = file.name.toLowerCase();

        var matches = FILE_TYPES.some(function (it) {
          return fileName.endsWith(it);
        });

        if (matches) {
          var reader = new FileReader();

          reader.addEventListener('load', loadHandler);

          reader.readAsDataURL(file);
        }
      }
    };
  };

  var avatarLoadHandler = function (evt) {
    avatarPreview.src = evt.currentTarget.result;
  };

  var housingImageLoadHandler = function (evt) {
    var newPrewiew = housingImagePreview.cloneNode();
    var newImage = document.createElement('img');
    newImage.style.maxWidth = '100%';
    newImage.style.height = 'auto';
    newImage.src = evt.currentTarget.result.toString();
    newPrewiew.style.overflow = 'hidden';
    newPrewiew.appendChild(newImage);
    housingImagePreviewContainer.insertBefore(newPrewiew, housingImagePreview);
  };

  var avatarChangeHandler = imageLoadChangeHandler(avatarLoadHandler);
  var housingImageChangeHandler = imageLoadChangeHandler(housingImageLoadHandler);

  var addHandlers = function () {
    avatarChooser.addEventListener('change', avatarChangeHandler);
    housingImageChooser.addEventListener('change', housingImageChangeHandler);
  };

  var removeHandlers = function () {
    avatarChooser.removeEventListener('change', avatarChangeHandler);
    housingImageChooser.removeEventListener('change', housingImageChangeHandler);
  };

  window.images = {
    resetLoadedImages: resetLoadedImages,
    addHandlers: addHandlers,
    removeHandlers: removeHandlers
  };
})();

'use strict';

(function () {
  var KeyCode = {
    ENTER: {
      key: 'Enter',
      keyCode: 13
    },
    ESCAPE: {
      key: 'Escape',
      keyCode: 27
    }
  };

  /**
   * Returns a random number between min and max
   * @param {number} min (inclusive)
   * @param {number} max (inclusive)
   * @return {number} integer number
   */
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
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
   * @param {Array} arr Array containing items
   * @param {boolean} isLength Flag to reduce array length
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
   * Removes empty DOM elements
   * @param {Object} list NodeList elements
   */
  var removeEmptyElements = function (list) {
    for (var i = 0; i < list.length; i++) {
      if (!list[i].textContent) {
        list[i].parentElement.removeChild(list[i]);
      }
    }
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

  /**
   * Removes a DOM element with a CSS selector
   * @param {Object} parentNodeItem Parent DOM element
   * @param {string} cssSelector CSS selector of an element
   */
  var removeNodeItem = function (parentNodeItem, cssSelector) {
    if (parentNodeItem && parentNodeItem.querySelector(cssSelector)) {
      parentNodeItem.removeChild(parentNodeItem.querySelector(cssSelector));
    }
  };

  /**
   * Removes DOM elements
   * @param {Object} parentNodeItem Parent DOM element
   * @param {Object} nodeList
   */
  var removeNodeList = function (parentNodeItem, nodeList) {
    if (parentNodeItem && nodeList.length) {
      for (var i = 0; i < nodeList.length; i++) {
        parentNodeItem.removeChild(nodeList[i]);
      }
    }
  };

  /**
   * Removes a CSS class from a DOM element
   * @param {Object} nodeItem Target DOM element
   * @param {string} cssClass CSS class of an element (without .point)
   */
  var removeCssClass = function (nodeItem, cssClass) {
    if (nodeItem.classList.contains(cssClass)) {
      nodeItem.classList.remove(cssClass);
    }
  };

  /**
   * Toggles a CSS class on a DOM element
   * @param {Object} nodeItem Target DOM element or elements (not for FORMs)
   * @param {string} cssClass CSS class on an element (without .point)
   * @param {boolean} flag (false removes, true adds)
   */
  var toggleClass = function (nodeItem, cssClass, flag) {
    if (!nodeItem.length) {
      nodeItem.classList.toggle(cssClass, flag);
    } else {
      for (var i = 0; i < nodeItem.length; i++) {
        nodeItem[i].classList.toggle(cssClass, flag);
      }
    }
  };

  /**
   * Returns a handler function for the pressed key
   * @param {Object} obj Keycodes
   * @param {Function} action Callback
   * @return {Function}
   */
  var keyPressHandler = function (obj, action) {
    return function (evt) {
      if (evt.key === obj.key || evt.keyCode === obj.keyCode) {
        action();
      }
    };
  };

  /**
   * Adds text to input in Form
   * @param {Object} nodeItem Target DOM element
   * @param {string|number|boolean|null|undefined|Object} text
   */
  var setInputValue = function (nodeItem, text) {
    nodeItem.value = text;
  };

  /**
   * Returns a function, that, as long as it continues to be invoked, will not be triggered
   * @param {Function} fun The function that will be called
   * @param {number} delay Debounce interval
   * @return {Function}
   */
  var debounce = function (fun, delay) {
    var lastTimeout = null;

    return function () {
      var args = arguments;
      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }
      lastTimeout = window.setTimeout(function () {
        fun.apply(null, args);
      }, delay);
    };
  };

  window.utils = {
    ENTER: KeyCode.ENTER,
    ESCAPE: KeyCode.ESCAPE,
    getRandomInt: getRandomInt,
    getRandomArrayItem: getRandomArrayItem,
    shuffleArray: shuffleArray,
    removeEmptyElements: removeEmptyElements,
    toggleDisable: toggleDisable,
    removeNodeItem: removeNodeItem,
    removeNodeList: removeNodeList,
    removeCssClass: removeCssClass,
    toggleClass: toggleClass,
    keyPressHandler: keyPressHandler,
    setInputValue: setInputValue,
    debounce: debounce
  };
})();

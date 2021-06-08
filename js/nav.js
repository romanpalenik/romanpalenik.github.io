"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var slider = function () {
  var defaults = {
    duration: 400,
    easing: function easing(currentTime, startValue, diffValue, dureation) {
      return -diffValue * (currentTime /= dureation) * (currentTime - 2) + startValue;
    }
  };
  var directions = {
    OPEN: 1,
    CLOSE: 2
  }; // export

  var slideUp = function slideUp(element) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (isInteger(args)) {
      args = {
        duration: args
      };
    }

    var options = extend(defaults, args);
    options.direction = directions.CLOSE;
    options.to = 0;
    options.startingHeight = element.scrollHeight;
    options.distanceHeight = -options.startingHeight;
    setElementAnimationStyles(element);
    window.requestAnimationFrame(function (timestamp) {
      return animate(element, options, timestamp, callback);
    });
  }; // export


  var slideDown = function slideDown(element) {
    var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    if (isInteger(args)) {
      args = {
        duration: args
      };
    }

    element.style.height = '0px';
    setElementAnimationStyles(element);
    var options = extend(defaults, args);
    options.direction = directions.OPEN;
    options.to = element.scrollHeight;
    options.startingHeight = 0;
    options.distanceHeight = options.to;
    window.requestAnimationFrame(function (timestamp) {
      return animate(element, options, timestamp, callback);
    });
  };

  var animate = function animate(element, options, now) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    if (!options.startTime) {
      options.startTime = now;
    }

    var currentTime = now - options.startTime;
    var animationContinue = currentTime < options.duration;
    var newHeight = options.easing(currentTime, options.startingHeight, options.distanceHeight, options.duration);

    if (animationContinue) {
      element.style.height = "".concat(newHeight.toFixed(2), "px");
      window.requestAnimationFrame(function (timestamp) {
        return animate(element, options, timestamp, callback);
      });
    } else {
      if (options.direction === directions.CLOSE) {
        element.style.display = 'none';
      }

      if (options.direction === directions.OPEN) {
        element.style.display = 'block';
      }

      removeElementAnimationStyles(element);

      if (callback) {
        callback();
      }
    }
  };

  var setElementAnimationStyles = function setElementAnimationStyles(element) {
    element.style.display = 'block';
    element.style.overflow = 'hidden';
    element.style.marginTop = '0';
    element.style.marginBottom = '0';
    element.style.paddingTop = '0';
    element.style.paddingBottom = '0';
  };

  var removeElementAnimationStyles = function removeElementAnimationStyles(element) {
    element.style.height = null;
    element.style.overflow = null;
    element.style.marginTop = null;
    element.style.marginBottom = null;
    element.style.paddingTop = null;
    element.style.paddingBottom = null;
  };

  var isInteger = function isInteger(value) {
    if (Number.isInteger) {
      return Number.isInteger(value);
    } else {
      return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
    }
  };

  var extend = function extend(defaults, options) {
    var extendedOptions = {};

    for (var key in defaults) {
      extendedOptions[key] = options[key] || defaults[key];
    }

    return extendedOptions;
  }; // public interface


  return {
    slideDown: slideDown,
    slideUp: slideUp
  };
}();

function activateNavigation(selector) {
  var closeOpenMenu = null;

  function closeMenu(menuToggleButton, menuContent) {
    slider.slideUp(menuContent, {}, function () {
      menuContent.removeAttribute('style');
      menuContent.classList.remove('f-nav-dropdown-right');
    });
    menuToggleButton.classList.remove('is-active');
  } // https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript


  function getViewPortWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  function toggleMenu(menuToggleButton, menuContent) {
    var isPrimary = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    menuToggleButton.addEventListener('click', function (event) {
      event.stopPropagation();

      if (menuContent.style.display === 'block') {
        closeMenu(menuToggleButton, menuContent);

        if (!isPrimary) {
          closeOpenMenu = null;
        }
      } else {
        slider.slideDown(menuContent);
        menuToggleButton.classList.add('is-active');

        if (menuContent.getBoundingClientRect().right > getViewPortWidth()) {
          menuContent.classList.add('f-nav-dropdown-right');
        }

        if (!isPrimary) {
          if (closeOpenMenu) {
            closeOpenMenu();
          }

          closeOpenMenu = closeMenu.bind(null, menuToggleButton, menuContent);
        }
      }
    });
  }

  function watchBreakPoint(elm, button) {
    var mediaQuery = "(min-width: ".concat(elm.getAttribute('data-breakpoint'), "px)");

    function handler() {
      if (window.matchMedia(mediaQuery).matches) {
        elm.removeAttribute('style');
        button.classList.remove('is-active');
      }
    }

    handler();
    window.addEventListener('resize', handler);
  }

  var menuToggleButton = document.querySelector("".concat(selector, " .f-nav-button"));
  var menuContent = document.querySelector("".concat(selector, " .f-nav-list"));
  toggleMenu(menuToggleButton, menuContent, true);
  watchBreakPoint(menuContent, menuToggleButton);

  var subMenus = _toConsumableArray(document.querySelectorAll("".concat(selector, " .f-nav-list .f-sub-nav"))).map(function (subMenu) {
    return {
      elm: subMenu,
      button: subMenu.querySelector('.f-sub-nav-toggle'),
      content: subMenu.querySelector('.f-nav-dropdown')
    };
  });

  subMenus.forEach(function (subMenu) {
    return toggleMenu(subMenu.button, subMenu.content, false);
  });
  window.addEventListener('click', function (e) {
    if (subMenus.some(function (item) {
      return item.elm === e.target || item.elm.contains(e.target);
    })) {
      return;
    }

    if (closeOpenMenu) {
      closeOpenMenu();
      closeOpenMenu = null;
    }
  });
}
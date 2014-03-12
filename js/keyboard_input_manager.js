function KeyboardInputManager() {
  this.events = {};

  this.listen();
}

KeyboardInputManager.prototype.on = function (event, callback) {
  if (!this.events[event]) {
    this.events[event] = [];
  }
  this.events[event].push(callback);
};

KeyboardInputManager.prototype.emit = function (event, data) {
  var callbacks = this.events[event];
  if (callbacks) {
    callbacks.forEach(function (callback) {
      callback(data);
    });
  }
};

KeyboardInputManager.prototype.listen = function () {
  var self = this;

  var map = {
    38: 0, // Up
    39: 1, // Right
    40: 2, // Down
    37: 3, // Left
    75: 0, // vim keybindings
    76: 1,
    74: 2,
    72: 3,
    87: 0, // W
    68: 1, // D
    83: 2, // S
    65: 3  // A
  };

  document.addEventListener("keydown", function (event) {
    var modifiers = event.altKey || event.ctrlKey || event.metaKey ||
                    event.shiftKey;
    var mapped    = map[event.which];

    if (!modifiers) {
      if (mapped !== undefined) {
        event.preventDefault();
        self.emit("move", mapped);
      }

      if (event.which === 32) self.restart.bind(self)(event);
    }
  });

  var retry = document.getElementsByClassName("retry-button")[0];
  retry.addEventListener("click", this.restart.bind(this));


  /*
  Begin implementation for touch events

  PS: The original implementation using hammer was not working on Firefox OS.

  */

  var touch_start_x, touch_start_y; // used to compute touch movement deltas;
  var gameContainer = document.querySelector(".game-container");

  // Constants for movement function
  var MOVE_UP = 0;
  var MOVE_DOWN = 2;
  var MOVE_LEFT = 3;
  var MOVE_RIGHT = 1;

  gameContainer.addEventListener("touchstart", function(event) {

    touch_start_x = event.touches[0].screenX;
    touch_start_y = event.touches[0].screenY;

  });

  gameContainer.addEventListener("touchend", function(event) {

    var delta_x = event.changedTouches[0].screenX - touch_start_x;
    var delta_y = event.changedTouches[0].screenY - touch_start_y;

    if (Math.abs(delta_x) > Math.abs(delta_y)) {

      if (delta_x > 0) {
        self.emit("move", MOVE_RIGHT);
      } else {
        self.emit("move", MOVE_LEFT);
      }

    } else {


      if (delta_y > 0) {
        self.emit("move", MOVE_DOWN);
      } else {
        self.emit("move", MOVE_UP);
      }
    }

  });

  /* end of touch events implementation */

};

KeyboardInputManager.prototype.restart = function (event) {
  event.preventDefault();
  this.emit("restart");
};

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"game.ts":[function(require,module,exports) {
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var canvasSize = canvas.width;
var playerWidth = 100;
var playerHeight = 20;
var player = {
  x: canvas.width / 2 - playerWidth / 2,
  y: canvasSize - playerHeight * 2,
  width: playerWidth,
  height: playerHeight,
  color: 'cyan',
  moveSpeed: 50,
  gun: {
    size: 15,
    color: '#ccc'
  }
};

var Barrier = function Barrier(x) {
  return {
    x: x,
    y: canvasSize - playerHeight * 4,
    width: playerWidth,
    height: playerHeight,
    color: 'green',
    hp: 3
  };
};

var barriers = [Barrier(75), Barrier(325)];

var Bullet = function Bullet(x, y, vy) {
  return {
    x: x,
    y: y,
    vy: vy,
    width: 4,
    height: 4,
    color: 'white'
  };
};

var bullets = [];
var bulletCooldown = false;
var enemies = [];

var renderPlayer = function renderPlayer() {
  var x = player.x,
      y = player.y,
      width = player.width,
      height = player.height,
      gun = player.gun,
      color = player.color;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = gun.color;
  ctx.fillRect(x + width / 2 - gun.size / 2, y - gun.size, gun.size, gun.size);
};

var renderBarriers = function renderBarriers() {
  for (var _i = 0, barriers_1 = barriers; _i < barriers_1.length; _i++) {
    var _a = barriers_1[_i],
        x = _a.x,
        y = _a.y,
        width = _a.width,
        height = _a.height,
        color = _a.color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  }
};

var renderBullets = function renderBullets() {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    var x = bullet.x,
        y = bullet.y,
        width = bullet.width,
        height = bullet.height,
        vy = bullet.vy,
        color = bullet.color;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
    bullet.y += vy;

    for (var j = 0; j < barriers.length; j++) {
      var barrier = barriers[j];
      var x_1 = barrier.x,
          y_1 = barrier.y,
          width_1 = barrier.width,
          height_1 = barrier.height;

      if (bullet.x > x_1 && bullet.x < x_1 + width_1 && bullet.y < y_1 + height_1) {
        bullets.splice(i, i + 1);
        barrier.hp--;

        switch (barrier.hp) {
          case 2:
            barrier.color = 'yellow';
            break;

          case 1:
            barrier.color = 'red';
            break;
        }

        if (barrier.hp === 0) {
          barriers.splice(j, j + 1);
        }
      }
    }
  }
};

var render = function render() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  renderPlayer();
  renderBarriers();
  renderBullets();
  requestAnimationFrame(render);
};

requestAnimationFrame(render);
document.addEventListener('keypress', function (_a) {
  var key = _a.key;

  switch (key) {
    case 'a':
      player.x = Math.max(0, player.x - player.moveSpeed);
      break;

    case 'd':
      player.x = Math.min(canvas.width - player.width, player.x + player.moveSpeed);
      break;

    case 'l':
      if (bulletCooldown) {
        break;
      }

      bulletCooldown = true;
      setTimeout(function () {
        return bulletCooldown = false;
      }, 1000);
      bullets.push(Bullet(player.x + player.width / 2 - 2, player.y - player.height, -4));
      break;
  }
});
},{}],"../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65371" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../usr/local/lib/node_modules/parcel/src/builtins/hmr-runtime.js","game.ts"], null)
//# sourceMappingURL=/game.4fb5d41c.map
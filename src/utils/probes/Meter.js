var units = require("./units");
var EWMA = require("./EWMA");

function Meter(opts) {
  var self = this;

  // this._tickInterval = units.SECONDS
  this._tickInterval = opts.rate || 5 * units.SECONDS;
  this._timeframe = opts.timeframe || 1 * units.MINUTES;

  this._rate = new EWMA(this._timeframe, this._tickInterval);

  this._interval = setInterval(function () {
    self._rate.tick();
  }, this._tickInterval);

  this._interval.unref();
}

Meter.RATE_UNIT = units.SECONDS;

Meter.prototype.mark = function (n) {
  n = n || 1;

  this._rate.update(n);
};

Meter.prototype.val = function () {
  return Math.round(this._rate.rate(this._timeframe) * 100) / 100;
};

module.exports = Meter;

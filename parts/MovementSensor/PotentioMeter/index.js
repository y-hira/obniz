var PotentioMeter = function() {
    this.keys = ["pin0","pin1","pin2"];
    this.reuiredKeys = ["pin0","pin1","pin2"];

    this.vcc_voltage = 5.0;
};

PotentioMeter.prototype.wired = function(obniz) {
  this.obniz.setVccGnd(this.params.pin0, this.params.pin2, "5v");
  this.ad = obniz.getAD(this.params.pin1);

  var self = this;

  obniz.getAD(this.params.pin0).start(function(value){
    self.vcc_voltage = value;
  });

  this.ad.start(function(value){
    self.position = value/ self.vcc_voltage;
    if (self.onchange) {
      self.onchange(self.position);
    }
  });
};


if (PartsRegistrate) {
  PartsRegistrate("PotentioMeter", PotentioMeter);
}
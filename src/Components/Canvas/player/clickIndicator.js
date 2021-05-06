export default class ClickIndicator {
  constructor(radius) {
    this.radius = radius;
    this.initialRadius = 0;
    this.enabled = false;
    this.pulseSpeed = 5;
    this.clickX = 0;
    this.clickY = 0;
  }
  run() {
    if (!this.enabled) return;
    this.drawPulseCircle();
  }
  click(x, y) {
    this.clickX = x;
    this.clickY = y;
    this.enabled = true;
  }
  drawPulseCircle() {
    if (this.initialRadius >= this.radius / 1.5) {
      //reverse pulse
      this.pulseSpeed = -this.pulseSpeed;
    } else if (this.initialRadius < 0) {
      //end reached
      this.initialRadius = 0;
      this.pulseSpeed = 5;
      this.enabled = false;
    }
    if (this.pulseSpeed < 0) {
      this.drawOutlineCircle(this.clickX, this.clickY, this.radius / 1.5);
    }
    this.drawCircle(this.clickX, this.clickY, this.initialRadius);
    this.initialRadius += this.pulseSpeed;
  }
  drawOutlineCircle(x, y, radius) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, false);
    this.context.strokeStyle = "white";
    this.context.stroke();
  }
  drawCircle(x, y, radius) {
    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2, false);
    this.context.fillStyle = "white";
    this.context.strokeStyle = "white";
    this.context.stroke();
    this.context.fill();
  }
}

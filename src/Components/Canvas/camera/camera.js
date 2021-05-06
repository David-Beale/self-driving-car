export default class Camera {
  constructor(context, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.lock = false;
    this.scale = 1;
    this.context = context;
    this.prev = null;
  }
  translate(x, y) {
    this.context.translate(x / this.scale, y / this.scale);
  }
  zoom(x, y) {
    this.context.scale(x, y);
  }
  drag(x, y) {
    let diffX = x - this.prev.x;
    let diffY = y - this.prev.y;

    this.prev = { x, y };
    this.x -= diffX;
    this.y -= diffY;
    this.translate(diffX, diffY);
  }
  scroll(x, y, direction) {
    const scaleFactor = direction < 0 ? 1.25 : 0.8;
    const diffX = (this.x + x) * (1 - scaleFactor);
    const diffY = (this.y + y) * (1 - scaleFactor);
    this.x -= diffX;
    this.y -= diffY;
    this.scale *= scaleFactor;
    this.zoom(scaleFactor, scaleFactor);
    this.translate(diffX, diffY);
  }
  followPlayer(player) {
    if (!player.currentX) return;
    let diffX =
      this.width / (2 * this.ratio) + this.x - player.currentX * this.scale;
    let diffY =
      this.height / (2 * this.ratio) + this.y - player.currentY * this.scale;
    this.translate(diffX, diffY);
    this.x -= diffX;
    this.y -= diffY;
  }
}

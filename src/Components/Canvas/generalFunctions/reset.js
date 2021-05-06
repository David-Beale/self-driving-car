export const reset = (c, camera) => {
  const { x, y, width, height, scale } = camera;
  let centerX = x - (0.5 * width) / scale;
  let centerY = y - (0.5 * height) / scale;
  c.clearRect(centerX, centerY, (3 * width) / scale, (3 * height) / scale);
};

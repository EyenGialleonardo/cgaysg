// brocha.js
class Brocha {
  x;
  y;
  px;
  py;
  color;
  offsetX;
  offsetY;
  id;
  noiseOffsetX;
  noiseOffsetY;

  constructor(id, anchoCanvas, altoCanvas, paleta) {
    this.id = id;
    this.x = anchoCanvas / 2;
    this.y = altoCanvas / 2;
    this.px = anchoCanvas / 2;
    this.py = altoCanvas / 2;
    this.color = paleta.darUnColor();
    this.offsetX = random(-anchoCanvas / 4, anchoCanvas / 4);
    this.offsetY = random(-altoCanvas / 4, altoCanvas / 4);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(2000);
  }

  actualizar() {
    this.px = this.x;
    this.py = this.y;

    let targetX = map(noise(this.noiseOffsetX + frameCount * 0.005), 0, 1, 0, width);
    let targetY = map(noise(this.noiseOffsetY + frameCount * 0.005), 0, 1, 0, height);

    this.x += (targetX + this.offsetX - this.x) / (15 + this.id * 3);
    this.y += (targetY + this.offsetY - this.y) / (15 + this.id * 3);

    this.x += random(-0.5, 0.5);
    this.y += random(-0.5, 0.5);
  }

  gotear(buffer) {
    let s = random(1, 5) + 30 / buffer.dist(this.px, this.py, this.x, this.y);
    s = buffer.min(15, s);

    buffer.blendMode(buffer.BLEND);

    let colorGoteo1 = buffer.color(buffer.red(this.color), buffer.green(this.color), buffer.blue(this.color), random(50, 150));

    buffer.strokeWeight(s);
    buffer.stroke(colorGoteo1);
    buffer.line(this.px, this.py, this.x, this.y);

    let colorGoteo2 = buffer.color(buffer.red(this.color), buffer.green(this.color), buffer.blue(this.color), random(50, 150));
    buffer.stroke(colorGoteo2);
    buffer.line(buffer.width - this.px, buffer.height - this.py, buffer.width - this.x, buffer.height - this.y);

    buffer.blendMode(buffer.BLEND);
  }

  cambiarColorYOffset(paleta, anchoCanvas, altoCanvas) {
    this.color = paleta.darUnColor();
    this.offsetX = random(-anchoCanvas / 4, anchoCanvas / 4);
    this.offsetY = random(-altoCanvas / 4, altoCanvas / 4);
  }
}

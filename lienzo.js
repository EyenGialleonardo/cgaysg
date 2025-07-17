class Lienzo {
  paleta;
  brochas = [];
  NUM_BROCHAS = 3;
  semilla;

  siguienteTiempoDeCorte;
  INTERVALO_CORTE_MIN = 5000;
  INTERVALO_CORTE_MAX = 15000;

  constructor(paletaDeColores) {
    this.paleta = paletaDeColores;
  }

  preparar(anchoCanvas, altoCanvas) {
    this.semilla = random(1000);
    for (let i = 0; i < this.NUM_BROCHAS; i++) {
      let nuevaBrocha = new Brocha(i, anchoCanvas, altoCanvas, this.paleta);
      this.brochas.push(nuevaBrocha);
    }
    this.siguienteTiempoDeCorte = millis() + random(this.INTERVALO_CORTE_MIN, this.INTERVALO_CORTE_MAX);
  }

  dibujar(buffer) {
    for (let i = 0; i < this.NUM_BROCHAS; i++) {
      let brochaActual = this.brochas[i];
      brochaActual.actualizar();
      if (frameCount > 40) {
        brochaActual.gotear(buffer);
      }
    }
  }

  salpicar(posicionX, posicionY, buffer, tipoDeCapa = 'normal') {
    let colorCrudo = this.paleta.darUnColor();
    let c = buffer.color(buffer.red(colorCrudo), buffer.green(colorCrudo), buffer.blue(colorCrudo));

    posicionX += random(-15, 15);
    posicionY += random(-15, 15);

    let movimientoX = random(-100, 100);
    let movimientoY = random(-100, 100);

    let numGotas = 40;
    let sFactor = 200;
    let aFactor = 5;

    switch (tipoDeCapa) {
      case 'fondo':
        numGotas = 20;
        sFactor = 80;
        aFactor = 2;
        c = buffer.color(buffer.red(colorCrudo), buffer.green(colorCrudo), buffer.blue(colorCrudo), random(50, 100));
        break;
      case 'grito':
        numGotas = 10;
        sFactor = 200;
        aFactor = 10;
        c = buffer.color(buffer.red(colorCrudo), buffer.green(colorCrudo), buffer.blue(colorCrudo), random(180, 255));
        break;
    }

    for (let i = 0; i < numGotas; i++) {
      this.semilla += 0.01;
      let x = posicionX + movimientoX * (0.5 - buffer.noise(this.semilla + i));
      let y = posicionY + movimientoY * (0.5 - buffer.noise(this.semilla + 2 * i));
      let s = sFactor / buffer.dist(posicionX, posicionY, x, y);
      if (s > 20) s = 20;
      let a = 255 - s * aFactor;
      a = buffer.constrain(a, 0, 255);

      buffer.noStroke();
      c = buffer.color(buffer.red(c), buffer.green(c), buffer.blue(c), a);
      buffer.fill(c);
      let x2 = x + random(-5, 5);
      let y2 = y + random(-5, 5);
      buffer.line(x, y, x2, y2);
      this.semilla += 0.01;
    }
  }

  puntear(posicionX, posicionY, buffer, tipoDeCapa = 'normal') {
    let colorCrudo = this.paleta.darUnColor();
    let c = buffer.color(buffer.red(colorCrudo), buffer.green(colorCrudo), buffer.blue(colorCrudo));

    let numPuntos = 1;
    let spread = 30;
    let pointSize = 1;
    let alpha = 100;

    switch (tipoDeCapa) {
      case 'unica':
        numPuntos = 1;
        spread = 0.5;
        pointSize = 2;
        alpha = 180;
        break;
      case 'doble':
        numPuntos = 1;
        spread = 0.5;
        pointSize = 1;
        alpha = 150;
        break;
    }

    for (let i = 0; i < numPuntos; i++) {
      let x = posicionX + random(-spread, spread);
      let y = posicionY + random(-spread, spread);
      let alphaPunto = random(alpha * 0.8, alpha);
      c = buffer.color(buffer.red(c), buffer.green(c), buffer.blue(c), alphaPunto);
      buffer.fill(c);
      buffer.ellipse(x, y, pointSize);
    }
  }
}

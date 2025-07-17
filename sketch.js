let miPaleta;
let miLienzo;
let microfono;
let analizadorFFT;
let miCapaPollock;

const UMBRAL_GRITO = 0.4;
const UMBRAL_GRAVES = 0.7;
const UMBRAL_AGUDOS = 0.5;

function preload() {
    miPaleta = new Paleta();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    miCapaPollock = createGraphics(windowWidth, windowHeight);
    miCapaPollock.background(50, 50, 50);

    miLienzo = new Lienzo(miPaleta);
    miLienzo.preparar(windowWidth, windowHeight);

    microfono = new p5.AudioIn();
    microfono.start();

    analizadorFFT = new p5.FFT();
    analizadorFFT.setInput(microfono);

    let textoInstrucciones = createP("Haz clic o toca la pantalla para habilitar el micrófono y empezar a pintar con tu voz.");
    textoInstrucciones.position(width / 2 - 200, height / 2 - 50);
    textoInstrucciones.style('color', 'white');
    textoInstrucciones.style('max-width', '400px');
    textoInstrucciones.style('font-size', '20px');
    textoInstrucciones.style('text-align', 'center');
    textoInstrucciones.style('background-color', 'rgba(0,0,0,0.7)');
    textoInstrucciones.style('padding', '20px');
    textoInstrucciones.style('border-radius', '10px');
}

function draw() {
    miLienzo.dibujar(miCapaPollock);
    image(miCapaPollock, 0, 0);

    if (getAudioContext().state !== 'running') return;

    let volumenActual = microfono.getLevel();
    analizadorFFT.analyze();

    let bajos = analizadorFFT.getEnergy('bass');
    let agudos = analizadorFFT.getEnergy('highMid');
    let superAgudos = analizadorFFT.getEnergy('treble');

    let bajosNorm = map(bajos, 0, 255, 0, 1);
    let agudosNorm = map(agudos, 0, 255, 0, 1);
    let superAgudosNorm = map(superAgudos, 0, 255, 0, 1);

    console.log(`Bajos: ${bajosNorm.toFixed(2)}, Agudos: ${agudosNorm.toFixed(2)}, Super Agudos: ${superAgudosNorm.toFixed(2)}`);

    if (volumenActual > UMBRAL_GRITO) {
        let intensidad = map(volumenActual, UMBRAL_GRITO, 1, 1, 0.5);
        for (let i = 0; i < intensidad; i++) {
            miLienzo.salpicar(random(width), random(height), miCapaPollock, 'grito');
        }
    }

    if (bajosNorm > UMBRAL_GRAVES) {
        if (frameCount % 60 === 0) {
            for (let brocha of miLienzo.brochas) {
                brocha.x = random(width);
                brocha.y = random(height);
                brocha.px = brocha.x;
                brocha.py = brocha.y;
                brocha.cambiarColorYOffset(miLienzo.paleta, width, height);
            }
        }

        if (frameCount % 10 === 0) {
            miLienzo.salpicar(random(width), random(height), miCapaPollock, 'fondo');
        }
    }

    if (agudosNorm > UMBRAL_AGUDOS || superAgudosNorm > UMBRAL_AGUDOS) {
        let brochaReferencia = miLienzo.brochas[0];
        let posX = brochaReferencia.x;
        let posY = brochaReferencia.y;

        miLienzo.puntear(posX + random(-80, 80), posY + random(-80, 80), miCapaPollock, 'unica');
        miLienzo.salpicar(posX + random(-80, 80), posY + random(-80, 80), miCapaPollock, 'normal');
    }

    if (millis() > miLienzo.siguienteTiempoDeCorte) {
        for (let brocha of miLienzo.brochas) {
            brocha.cambiarColorYOffset(miLienzo.paleta, width, height);
        }
        miLienzo.siguienteTiempoDeCorte = millis() + random(miLienzo.INTERVALO_CORTE_MIN, miLienzo.INTERVALO_CORTE_MAX);
    }
}

function mousePressed() {
    let instrucciones = select('p');
    if (instrucciones) {
        instrucciones.remove();
    }
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    miCapaPollock = createGraphics(windowWidth, windowHeight);
    miCapaPollock.background(255, 250, 240);
    miLienzo.preparar(windowWidth, windowHeight);
}

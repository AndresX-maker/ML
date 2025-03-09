// Imposta il canvas e l'altezza del cuore come prima
e = [];// trails
h = [];// heart path

v = 32; // num trails, num particles per trail & num nodes in heart path
M = Math;
R = M.random;
C = M.cos;
Y = 6.3; // approssimativamente 2*PI

// Calcola i nodi della curva del cuore
for(i = 0; i < Y; i += 0.2) {
  h.push([
    O/2 + 180 * M.pow(M.sin(i), 3),
    (Q/2 + heartYOffset) + 10 * ( - (15 * C(i) - 5 * C(2*i) - 2 * C(3*i) - C(4*i)) )
  ]);
}

i = 0;
while (i < v) {

  x = R() * O;
  y = R() * Q;

  H = i/v * 80 + 280;
  S = R() * 40 + 60;
  B = R() * 60 + 20;

  f = []; // crea una nuova traccia

  k = 0;
  while (k < v) {
    f[k++] = { // crea una nuova particella
      x: x, // posizione
      y: y,
      X: 0, // velocità orizzontale
      Y: 0, // velocità verticale
      R: (1 - k/v) + 2, // raggio aumentato da 1 a 2
      S: R() + 1, // accelerazione
      q: ~~(R() * v), // nodo target sulla curva del cuore
      D: i % 2 * 2 - 1, // direzione lungo il percorso del cuore
      F: R() * 0.2 + 0.7, // attrito
      f: "hsla(" + ~~H + "," + ~~S + "%," + ~~B + "%,.1)" // colore
    }
  }
  
  e[i++] = f; // e contiene le tracce (ogni traccia è un array di particelle)
}

function render(p) { // disegna una particella
  a.fillStyle = p.f;
  a.beginPath();
  a.arc(p.x, p.y, p.R, 0, Y, 1); // Usa il nuovo raggio
  a.closePath();
  a.fill();
}

function loop() {

  a.fillStyle = "rgba(0,0,0,.2)"; // cancella lo schermo
  a.fillRect(0, 0, O, Q);

  i = v;
  while (i--) {

    f = e[i]; // seleziona la traccia corrente
    u = f[0]; // prima particella della traccia
    q = h[u.q]; // nodo target sulla curva del cuore
    D = u.x - q[0]; // distanza orizzontale dal nodo
    E = u.y - q[1]; // distanza verticale dal nodo
    G = M.sqrt(D * D + E * E);
    
    if (G < 10) { // la traccia ha raggiunto il nodo target?
      if (R() > 0.95) { // invia casualmente la traccia in un altro nodo
        u.q = ~~(R() * v);
      } else {
        if (R() > 0.99) u.D *= -1; // cambio casuale di direzione
        u.q += u.D;
        u.q %= v;
        if (u.q < 0) u.q += v;
      }
    }
    
    // Calcola e applica la velocità
    u.X += -D / G * u.S;
    u.Y += -E / G * u.S;
    u.x += u.X;
    u.y += u.Y;
    
    render(u); // disegna la prima particella
    u.X *= u.F; // applica attrito
    u.Y *= u.F;
    
    k = 0;
    while (k < v - 1) { // ciclo sulle particelle rimanenti della traccia
      
      T = f[k];      // particella corrente
      N = f[++k];    // particella successiva
      
      N.x -= (N.x - T.x) * 0.7; // effetto "paradosso di Zenone" per creare la scia
      N.y -= (N.y - T.y) * 0.7;
      
      render(N);
    }
  }
} // fine loop()

(function animate() {
  requestAnimationFrame(animate);
  loop();
}());

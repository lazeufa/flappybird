const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const img = new Image();
img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";

// reglage general
let gamePlaying = false; //jeux off
const gravity = .5; //gaviter
const speed = 6.2; //vitesse
const size = [51, 36]; //taille de l'objet
const jump = -11.5; //saut
const cTenth = (canvas.width / 10); //Un dizieme

let index = 0, //effet optique entre fond et poteau
    bestScore = 0, //meilleur score
    flight, //Vol
    flyHeight, //Hauteur de vol
    currentScore, //score de depart
    pipe;//Poteau

// Reglage tuyaux
const pipeWidth = 78;
const pipeGap = 270;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // installer les 3 premiers tuyaux
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  // fait bouger le tuyau et l'oiseau
  index++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background premiere partie
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background seconde partie
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // affichage des tuyaux
  if (gamePlaying){
    pipes.map(pipe => {
      // déplacement de tuyau
      pipe[0] -= speed;

      // tuyaux supérieur
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // tuyaux inférieur
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // donner 1 point et créer un nouveau tuyau
      if(pipe[0] <= -pipeWidth){
        currentScore++;
        // vérifier si c'est le meilleur score
        bestScore = Math.max(bestScore, currentScore);
        
        // supprimer et créer un nouveau tuyau
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }
    
      // si vous frappez le tuyau, game over
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
      }
    })
  }
  // image oiseau
  if (gamePlaying) {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(img, 432, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);
      // text accueil
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // dire au navigateur d'exécuter l'animation
  window.requestAnimationFrame(render);
}

// lancer la configuration
setup();
img.onload = render;

// jeu demarré
document.addEventListener('click', () => gamePlaying = true);
window.onclick = () => flight = jump;
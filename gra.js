// canvas
const canvas = document.getElementById("myCanvas")

// pobieramy kontekst
//const ctx = canvas.getContext("2d")

const pressed = {};
window.onkeydown = function (e) {
  e = e || window.event;
  pressed[e.key] = true;
}
window.onkeyup = function (e) {
  e = e || window.event;
  delete pressed[e.key];
}
var config=
{
    type:Phaser.AUTO,
    parent:canvas,
    width:300,
    height:400,
    backgroundColor:"48a",
    scene:
    {
        preload:preload,
        create:create,
        update:update
    }
};  
//pociski
//https://examples.phaser.io/assets/games/breakout/ball.png
//https://examples.phaser.io/assets/games/tanks/bullet.png
//https://examples.phaser.io/assets/games/invaders/enemy-bullet.png
//https://examples.phaser.io/assets/games/starstruck/star2.png

//animacje
//https://examples.phaser.io/assets/games/invaders/explode.png
//https://examples.phaser.io/assets/games/tanks/explosion.png

//tla
//https://examples.phaser.io/assets/games/invaders/starfield.png
//https://examples.phaser.io/assets/games/tanks/dark_grass.png
//https://examples.phaser.io/assets/games/tanks/earth.png

//gracz 
//https://examples.phaser.io/assets/games/invaders/player.png

var game=new Phaser.Game(config);

//  OBIEKTY WYKORZYSTYWANE W GRZE
var player;


function preload()
{
  this.load.crossOrigin = 'anonymous';
  this.load.setBaseURL('https://examples.phaser.io/assets/games');// teraz wystarczy pobierać grafiki tak jak poniżej, bez całego linku
  this.load.image('player','assets/games/invaders/player.png');
  // chaiełem wczytać playera ale kurwa późno jest ide spać XDD
}
function create()
{

}
function update()
{

}   
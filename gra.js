import 'phaser';
// canvas
const canvas = document.getElementById("myCanvas")

// pobieramy kontekst
const ctx = canvas.getContext("2d")

const pressed = {};
window.onkeydown = function (e) {
  e = e || window.event;
  pressed[e.key] = true;
}
window.onkeyup = function (e) {
  e = e || window.event;
  delete pressed[e.key];
}
varconfig=
{
    type:Phaser.AUTO,
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

vargame=newPhaser.Game(config);
functionpreload()
{

}
functioncreate()
{

}
functionupdate()
{

}   
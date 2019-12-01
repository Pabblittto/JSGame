// canvas
//const canvas = document.getElementById("myCanvas")

// pobieramy kontekst
//const ctx = canvas.getContext("2d")
const appDiv = document.getElementById('app');


var config = {
  type: Phaser.AUTO,
  width: 500,
  height: 800,
  parent: appDiv,
  physics: {
    default: 'arcade',
    arcade: {
      //gravity: { y: -5 },
      debug: true
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
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
var bullets;
var cursors;
var spaceBar;
var fireRate = 10; 
var coolDown = 0;
var mouseCursor;

function preload()
{
  this.load.crossOrigin = 'anonymous';
  this.load.setBaseURL('https://examples.phaser.io/assets/');// teraz wystarczy pobierać grafiki tak jak poniżej, bez całego linku
  this.load.image('player','games/invaders/player.png');
  this.load.image('background','games/tanks/dark_grass.png');
  this.load.image('playerBullet','games/starstruck/star2.png'); //bo czemu nie
  this.load.image('enemyBullet','games/tanks/bullet.png');
  this.load.spritesheet('explosion','games/invaders/explode.png',   //to bedzie nasza animacja wybuchu wroga
    { frameWidth: 136, frameHeight: 120 }
  );
  // chaiełem wczytać playera ale kurwa późno jest ide spać XDD
}
function create()
{
  var playerBullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function playerBullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'playerBullet');
        this.speed = Phaser.Math.GetSpeed(400, 1);
    },
    fire: function (x, y)
    {
        this.setPosition(x, y - 50);
        this.setActive(true);
        this.setVisible(true);
    },

    update: function (time, delta)
    {
        this.y -= this.speed * delta;

        if (this.y < -50)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});
bullets = this.add.group({
  classType: playerBullet,
  maxSize: fireRate+5,
  runChildUpdate: true
});

  let back = this.add.tileSprite(0, 0, 500, 6000, 'background'); //wieksza dlugosc zeby zrobic scrollowana mape
  back.setOrigin(0);
  back.setScrollFactor(1); //nie jestem pewien jak to dziala
  this.cameras.main.setBounds(0,0,500,800);
  this.physics.world.setBounds(0,0,500,800);
  player=this.physics.add.sprite(250,500,'player');
   cursor = this.add.image(0, 0, 'player').setVisible(false);
  //game.physics.enable(player, Phaser.Physics.ARCADE);
  //jak ogarnie sie lepiej scrollowanie niz przez powiekszenie sztuczne swiata
  //player=this.physics.add.sprite(game.world.centerX, game.world.centerY,'player'); 
  player.setCollideWorldBounds(true);
  //player.setOrigin(0,0);
  

  /*bullets = this.add.group();
  bullets.enableBody = true;
  bullets.physicsBodyType = Phaser.Physics.ARCADE;

  bullets.createMultiple(30, 'playerBullet');*/
  

  //spaceBar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  //spaceBar.onDown.add(shoot, this); 
  //this.cameras.main.startFollow(player);
 


  cursors = this.input.keyboard.createCursorKeys();

}
/*function fire() {

  if (game.time.now > nextFire && bullets.countDead() > 0)
  {
      nextFire = game.time.now + fireRate;

      var bullet = bullets.getFirstDead();

      bullet.reset(player.x , player.y );

      //game.physics.arcade.moveToPointer(bullet, 300);
  }

}*/
function update()
{
  if(coolDown!=0)
  {
    coolDown--;
  }
  if (cursors.left.isDown) {
    player.setVelocityX(-150);
    //player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
    player.setVelocityX(150);
   // player.anims.play('right', true);
  }
  else {
    player.setVelocityX(0);
    //player.anims.play('front');
  }
  if (cursors.up.isDown){
    player.setVelocityY(-150);
  }
  else if (cursors.down.isDown){
    player.setVelocityY(150);
  }
  else {
    player.setVelocityY(0);
    //player.anims.play('front');
  }
  if (game.input.mousePointer.isDown)
    {
      if(coolDown==0)
      {
      var bullet = bullets.get();

      if (bullet)
      {
          bullet.fire(player.x, player.y);

          coolDown +=fireRate;
      }
    }
      //cursor.setPosition(game.input.mousePointer.x,game.input.mousePointer.y);
     // this.physics.moveToObject(player.physics, cursor);
    }
  




  /*if (cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
    player.setVelocityY(-250);
  }*/
}   
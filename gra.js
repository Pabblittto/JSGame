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
//stateczek gracza
var player;
//tablica przechowujaca pociski gracza
var playerBullets;
//przyciski strzalek
var cursors;
//dziala przeciwnie- niski firerate=szybkie strzelanie, wysoki=wolne
var fireRate = 10; 
var coolDown = 0;
//tablica przechowujaca wrogow na ekranie (NOT YET IMPLEMENTED)
var enemyCount;
//tablica przechowujaca pociski wroga
var enemyBullets;
//limit pociskow wroga na ekranie 
var enemyBulletCount=10;
//tlo
var back;
var animExplosion;
var explosionSprite;
var levelTimer=0;

var bombs=3;

var bottomFloor;// floor object 
var GAMEOVERtext;

function preload()
{
  this.load.crossOrigin = 'anonymous';

  this.load.image('enemyShip','https://examples.phaser.io/assets/games/invaders/invader.png');
  this.load.spritesheet('enemyShip2','https://examples.phaser.io/assets/games/invaders/invader32x32x4.png',{ frameWidth: 32, frameHeight: 32 });

  
  //this.load.setBaseURL('https://examples.phaser.io/assets/');// teraz wystarczy pobierać grafiki tak jak poniżej, bez całego linku
  this.load.image('player','https://examples.phaser.io/assets/games/invaders/player.png');
  this.load.image('background','https://examples.phaser.io/assets/games/tanks/dark_grass.png');
  this.load.image('background2','https://examples.phaser.io/assets/games/tanks/earth.png');
  this.load.image('playerBullet','https://examples.phaser.io/assets/games/starstruck/star2.png'); //bo czemu nie
  this.load.image('enemyBullet','https://examples.phaser.io/assets/games/tanks/bullet.png');
  

  this.load.spritesheet('explosion','https://examples.phaser.io/assets/games/invaders/explode.png',   //to bedzie nasza animacja wybuchu wroga
    { frameWidth: 128, frameHeight: 128 }
  );
}

function create()
{
  var gameEnvironment=this;

  var animationConfig = {
    key: 'explode',
    frames: this.anims.generateFrameNumbers('explosion'),
    frameRate: 10,
    yoyo: false,
    hideOnComplete: true,
    repeat: 0
    
};




  //potencjalnie polaczyc klasy w jedna i dziedziczyc. nie jestem pewien jak to zrobic. w klasie enemyBullet zmniejszyc obrazek
    var playerBullet = new Phaser.Class({
      Extends: Phaser.Physics.Arcade.Sprite,
      initialize:
      function playerBullet (scene)
      {
        Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'playerBullet');
        scene.physics.world.enable(this);
          this.speed = Phaser.Math.GetSpeed(400, 1);
      },
      fire: function (x, y)
      {
          this.setPosition(x, y - 50);
          this.setActive(true);
          this.setVisible(true);
      },
      Hit: function(){
        this.destroy();
      }
      ,
      update: function (time, delta)
      {
          this.y -= this.speed * delta;
          this.setAngle(this.y%360);
          if (this.y < -50)
          {
            
              this.setActive(false);
              this.setVisible(false);   
          }
      }

  });
  var enemyBullet = new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Sprite,
    initialize:
    function enemyBullet (scene)
    {
      Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'enemyBullet');
      scene.physics.world.enable(this);
        this.setScale(0.5,0.3);//zmniejszenie
        this.setAngle(90);//rotacja

        this.speed = Phaser.Math.GetSpeed(100, 1);
    },
    fire: function (x, y)
    {
        this.setPosition(x, y + 20);
        this.setActive(true);
        this.setVisible(true);
    },
    update: function (time, delta)
    {
        this.y += this.speed * delta;
    }
  });

  var EnemyShip= new Phaser.Class({
    Extends: Phaser.Physics.Arcade.Sprite,
    explosion: {},
    moving: false,
    directionRight:true,
    initialize: function EnemyShip(scene){
      Phaser.GameObjects.Sprite.call(this, scene, 0, 0, 'enemyShip');
      
      scene.physics.world.enable(this);
      this.speed = Phaser.Math.GetSpeed(50, 1);
      this.explosion=gameEnvironment.add.sprite(0, 0, 'explosion').setScale(0.5,0.5);
      this.explosion.anims.load('explode');
      this.explosion.setVisible(false);
      this.explosion.setActive(false);
      this.setCollideWorldBounds(true);
    },
    createShip: function(){
      let randomX = Math.floor(Math.random()*(450-40+1))+0;// 500 to maksymalna liczba z zakresu-szerokośc okna gry, 0 to minimalna
      
      let ifmoving=Math.floor(Math.random()*(500-0+1))+0;

      if(ifmoving>50){
        this.setTexture('enemyShip2',1);
        this.body.sourceHeight=32;
        this.body.sourceWidth=32;
        this.body.halfHeight=16;
        this.body.halfWidth=16;
        this.body.height=32;
        this.body.width=32;
        this.moving=true;
        let onright=Math.floor(Math.random()*(500-0+1))+0;
        if(onright<50){
          this.directionRight=false;
        }
      }

      this.setPosition(randomX,0);
      this.setActive(true);
      this.setVisible(true);
    },
    GetHit: function(){
      this.destroy();
      this.explosion.setPosition(this.x,this.y);
      this.explosion.setVisible(true);
      this.explosion.setActive(true);
      this.explosion.anims.restart();
      this.explosion.anims.play('explode');
    }
    ,
    update: function (time, delta)
    {
      let random= Math.floor(Math.random()*(100-0+1))+0;
      if(random<1){// mniej niz 5 procent na strzal
        let enemybullet=enemyBullets.get();

        if(enemybullet!=null)
        enemybullet.fire(this.x,this.y);
      }

        if(this.moving){
          if(this.directionRight)
            this.x+=this.speed/3*delta;
          else
            this.x-=this.speed/3*delta;

            if(this.x<30 || this.x>470)
            this.directionRight= !this.directionRight;
        }

        this.y += this.speed * delta;
        
    }
  });

  playerBullets = this.add.group({
    classType: playerBullet,
    maxSize: fireRate+5,
    runChildUpdate: true
  });


  enemyBullets = this.add.group({
    classType: enemyBullet,
    maxSize: enemyBulletCount,
    runChildUpdate: true
  });

  enemyCount= this.add.group({
    maxSize:20,
    classType: EnemyShip,
    runChildUpdate:true
  });




  back = this.add.tileSprite(0, 0, 500, 800, 'background'); //zajebiscie sie scrolluje nawet z danym dystansem. mozna zrobic jakis ingame timer zeby zmieniac tlo po czasie
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

  //potencjalnie zrobic liste eksplozji i zmieniac ich polozenie
  animExplosion = this.anims.create(animationConfig);
  explosionSprite = this.add.sprite(300, 300, 'explosion').setScale(0.5,0.5);
  explosionSprite.anims.load('explode');
  explosionSprite.setVisible(false);
  explosionSprite.setActive(false);

  bottomFloor= this.physics.add.sprite(0,848,'');
  bottomFloor.body.setSize(1000,100);


  GAMEOVERtext= this.add.text(40,300,"GAME OVER",
{
  font: "65px Arial",
  fill: "#ffff",
  align: "center"
});

GAMEOVERtext.visible=false;

  //podmiana obrazka- rozmiar hitboxa pozostaje ten sam (widoczne w debug true)
  //player.setTexture('enemyTank1').setScale(0.5,0.5);
  //testowanie eksplozji na sztywno
  this.input.keyboard.on('keydown_B', function (event) {
    explosionSprite.setVisible(true);
    explosionSprite.setActive(true);
    explosionSprite.anims.restart();
    explosionSprite.anims.play('explode');
    explodeAt(100,100);
    //explosionSprite.setActive(false);
    //explosionSprite.setVisible(false);
  
  });
  //explodeAt(100,100);
  //bigExplosion();

  //strzelanko spacja
  this.input.keyboard.on('keydown_SPACE', function (event) {

    if(coolDown==0)
      {
      var bullet = playerBullets.get();

      if (bullet)
      {
          bullet.fire(player.x, player.y);

          coolDown +=fireRate;
      }
    }

});
//zeby byla odmiana to raz na X czasu/plansze/gre gracz moze odpalic bombe ktora rozwali wszystkich wrogow na ekranie ew jakas zmiana broni na szybsza/zadajaca mniej obrazen
//mozesz pomyslec co chcesz zeby bylo. osoboscie wole to 1sze bo latwiej :V
this.input.keyboard.on('keydown_Z', function (event) {

  if(bombs>0)
    {
    bombs--;
    //wybuchnij
  }

});



  /*playerBullets = this.add.group();
  playerBullets.enableBody = true;
  playerBullets.physicsBodyType = Phaser.Physics.ARCADE;

  playerBullets.createMultiple(30, 'playerBullet');*/
  

  //spaceBar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  //spaceBar.onDown.add(shoot, this); 
  //this.cameras.main.startFollow(player);
 


  cursors = this.input.keyboard.createCursorKeys();

}

function GenerateRandomEnemies(){
  let random= Math.floor(Math.random()*(100-0+1))+0;
  if(random<5){     // jest około 5 procent żę w losowym miejscu pojawi się statek przeciwnika
    let enemy = enemyCount.get();
    if(enemy!=null)
      enemy.createShip();
  }
}
 
function EnemybullethitFloor(Floor,EnemyBullet){
  EnemyBullet.destroy();
}

function EnemybullethitPlayer(enembybullet,Player){
  enembybullet.destroy();
  GAMEOVERtext.visible=true;
  Player.setActive(false);
  Player.setVisible(false);
  Player.destroy();
}

function EnemyhitFloor(Floor,EnemyBody){// przeciwnik poleciał na sam dół
  EnemyBody.timeleft=200;
  EnemyBody.destroy();
}

function hitEnemyShip(BulletBody, EnemyBody){// to konkretne obiekty, które biorą udział w kolizji

  BulletBody.timeleft=200;
  let x = EnemyBody.x;
  let y = EnemyBody.y;

  EnemyBody.GetHit();
  BulletBody.Hit();

  explodeAt(x,y);

}


function explodeAt(x,y)
{
  explosionSprite.x=x;
  explosionSprite.y=y;
}
function bigExplosion()
{
  explosionSprite.x=player.x;
  explosionSprite.y=player.y;
  explosionSprite.setScale(5,5);
}
/*function fire() {

  if (game.time.now > nextFire && playerBullets.countDead() > 0)
  {
      nextFire = game.time.now + fireRate;

      var bullet = playerBullets.getFirstDead();

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
  back.tilePositionY -= 5;
  levelTimer++;
  bigExplosion();
  //no i brakuje jakiegos plynnego przejscia pomiedzy tlami mozna wsadzic jakis wybuch albo animacje zeby zaslonila ekran na czas zmiany :V
  if(levelTimer==15)
  {
    //dzialajaca zmiana tla z zielonej na brazowa po na 15 klatce gry. mozna jakis inny waruneczek dac albo gdzies indziej.
    back.setTexture('background2');
    //back.setOrigin(0);
    
    
  }
  if(explosionSprite.anims.getProgress()==1)
  {
    explosionSprite.setActive(false);
    explosionSprite.setVisible(false);
  }

  GenerateRandomEnemies()// uruchomienie generowania przeciwników

  this.physics.collide(playerBullets,enemyCount,hitEnemyShip);// ustawienien kolizji obiektów z listy playerbullets i enemyCount- to wywołuje hitEnemyShip
  this.physics.collide(bottomFloor,enemyCount,EnemyhitFloor);
  this.physics.collide(bottomFloor,enemyBullets,EnemybullethitFloor);
  this.physics.collide(enemyBullets,player,EnemybullethitPlayer);
  //strzelanko myszka potencjalnie do wywalenia
  /*
  if (game.input.mousePointer.isDown)
    {
      if(coolDown==0)
      {
      var bullet = playerBullets.get();

      if (bullet)
      {
          bullet.fire(player.x, player.y);

          coolDown +=fireRate;
      }
    }
      //cursor.setPosition(game.input.mousePointer.x,game.input.mousePointer.y);
     // this.physics.moveToObject(player.physics, cursor);
    }/*
  




  /*if (cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
    player.setVelocityY(-250);
  }*/
}   
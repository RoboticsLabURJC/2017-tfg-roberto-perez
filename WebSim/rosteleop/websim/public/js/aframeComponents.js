var v = 0;
var w = 0;
var vel = 0;
var angularVel = 0;
AFRAME.registerComponent('spectator',{
    'schema': {
      canvas: {
        type: 'string',
        default: ''
      },
      // desired FPS of spectator dislay
      fps: {
        type: 'number',
        default: '30.0'
      }
    },
    'init': function() {
      var targetEl = document.querySelector(this.data.canvas)
      this.counter = 0;
      this.renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( targetEl.offsetWidth, targetEl.offsetHeight );
      // creates spectator canvas
      targetEl.appendChild(this.renderer.domElement);

      this.canvas2d = document.createElement('canvas');
      this.canvas2d.id = "camera2";
      this.canvas2d.width = this.renderer.domElement.width;
      this.canvas2d.height = this.renderer.domElement.height;
      //this.canvas2d.style.display="none";

      targetEl.appendChild(this.canvas2d);
      this.getCameraInfo();
    },
    'tick': function(time, timeDelta) {
      var loopFPS = 1000.0 / timeDelta;
      var hmdIsXFasterThanDesiredFPS = loopFPS / this.data.fps;
      var renderEveryNthFrame = Math.round(hmdIsXFasterThanDesiredFPS);
      if(this.counter % renderEveryNthFrame === 0){
        this.render(timeDelta);
      }
      this.counter += 1;
    },
    'render': function(){
      this.renderer.render( this.el.sceneEl.object3D , this.el.object3DMap.camera );
      let strDataURI = this.renderer.domElement.toDataURL();
      let ctx = this.canvas2d.getContext( '2d' );
      let img = new Image;

      img.onload = function(){
        ctx.drawImage(img,0,0); // Or at whatever offset you like
      };
      img.src = strDataURI;
    },
    'getCameraInfo': function(){
        console.log(this.el.object3DMap.camera);
    },

  });
  setInterval(function(e){
    move();
  },1);

  function move(){
    var robot = document.querySelector('#a-pibot');
    robot.body.velocity.set(v, 0, 0);
    robot.body.angularVelocity.set(0, w, 0);
    /*pibot.object3D.position.x += v/1000.0 * Math.cos(angularVel);
    pibot.object3D.position.z += v/1000.0 * -Math.sin(angularVel);
    pibot.object3D.rotation.y = angularVel;*/
  }

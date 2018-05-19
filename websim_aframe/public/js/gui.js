var v = 0;
var w = 0;
var angularVel = 0;
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( arr );
  }
 });

    function showData(a){
    }
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
      var targetEl = document.querySelector(this.data.canvas);
      this.counter = 0;
      this.renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true } );
      this.renderer.setPixelRatio( window.devicePixelRatio );
      this.renderer.setSize( targetEl.offsetWidth, targetEl.offsetHeight );
      // creates spectator canvas
      targetEl.appendChild(this.renderer.domElement);


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
      //var strMime = "image/jpeg";
      //imgData = this.renderer.domElement.toDataURL(strMime);
      imgData = this.renderer.domElement.toBlob(showData);
      move();
    },
    'getCameraInfo': function(){
    },
  });

  function move(){
    var pibot = document.querySelector("#turtlebot");
    angularVel += w/1000.0;
    pibot.object3D.position.x += v/1000.0 * Math.cos(angularVel);
    pibot.object3D.position.z += v/1000.0 * -Math.sin(angularVel);
    pibot.object3D.rotation.y = angularVel;
  }

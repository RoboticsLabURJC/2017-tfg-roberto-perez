var camera, scene, renderer, controls;
var cube, floor, axes, sphere, ring;
var obj_active;
var rotationx = 0.0;
var rotationy = 0.0;

			function init() {
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 300;
        camera.position.y = 50;
        camera.position.x = 100;
				scene = new THREE.Scene();
				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xffffff);
				document.getElementById("canvas").appendChild( renderer.domElement );
				controls = new THREE.OrbitControls(camera, renderer.domElement);
				window.addEventListener( 'resize', onWindowResize, false );
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function animate() {
				requestAnimationFrame( animate );
				obj_active.rotation.x += 0.05 + rotationx;
				obj_active.rotation.y += 0.01 + rotationy;
				renderer.render( scene, camera );
			}

      function addAxes (){
        axes = new THREE.Object3D();
        axes.add(buildAxis(new THREE.Vector3(0,0,0),new THREE.Vector3(1000,0,0), 0xFF0000, false)); //x
        axes.add(buildAxis(new THREE.Vector3(0,0,0),new THREE.Vector3(0,1000,0), 0x00FF00, false)); //Y
        axes.add(buildAxis(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,1000), 0x0000FF, false)); //Z
        scene.add(axes);
      }

      function buildAxis (src,dst, colorHex, dashed){
        var geom = new THREE.Geometry();
        var mat;
        if (dashed){
          mat = new THREE.LineDashedMaterial({linewidth: 3, color: colorHex, dashSize: 3, gapSize:3});
        } else {
          mat = new THREE.LineBasicMaterial({linewidth:3, color: colorHex});
        }
        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances();

        var axis = new THREE.Line (geom, mat, THREE.LineSegments);
        return axis;
      }

      function addPlane(){
        var plane = new THREE.PlaneBufferGeometry(1000 , 1000, 10,10);
        var material = new THREE.MeshBasicMaterial({color:0x33FF00, side: THREE.DoubleSide});
        floor = new THREE.Mesh(plane, material);
        floor.position.y = floor.position.y - 20;
        floor.rotation.x = Math.PI/2;
        scene.add(floor);
      }

      function addSphere (){
        var material = new THREE.MeshBasicMaterial({color:0xA34242});
        sphere = new THREE.Mesh( new THREE.SphereGeometry( 20, 20, 20 ), material );
				sphere.position.set( 50, 0, 50 );
        obj_active = sphere;
				scene.add( sphere );
      }

      function addCube(){
        var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
				var material = [new THREE.MeshBasicMaterial({color:0x00BB00}),
          new THREE.MeshBasicMaterial({color:0xAA000F}),
          new THREE.MeshBasicMaterial({color:0xCC0000}),
          new THREE.MeshBasicMaterial({color:0xFF00CC}),
          new THREE.MeshBasicMaterial({color:0x77FFCC}),
          new THREE.MeshBasicMaterial({color:0x77CC00})];
				cube = new THREE.Mesh( geometry, material );
        cube.position.set( 50, 0, 50 );
        obj_active = cube;
				scene.add(cube);
      }

      function addRing(){
        var material = new THREE.MeshBasicMaterial({color:0xA34242});
          ring = new THREE.Mesh( new THREE.CylinderGeometry( 5, 25, 50, 40, 5 ), material );
				  ring.position.set( 50, 25, 50 );
          obj_active = ring;
				  scene.add( ring );
      }

      function webGLStart (){
        init();
        addAxes();
        addPlane();
        addSphere();
  			animate();
        var slider = document.getElementById("myRange");
        slider.oninput = function() {
          rotationx = this.value/1000;
          rotationy = this.value/1000;
          console.log(rotationx);
        }
      }

      function changeObj(){
        var obj = document.getElementById("change").value;
        scene.remove(obj_active);
        if (obj == "Sphere"){
          addSphere();
        } else if (obj == "Cube") {
          addCube();
        } else {
          addRing();
        }
      }

var camera, scene, renderer, controls;
var cube, floor, axes, sphere, bell, grid, line;
var obj_active, obj;
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
        renderer.setClearColor(0x000000);
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
				if (obj != "Sphere") {
							obj_active.rotation.x += 0.05 + rotationx;
				}
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

			function addLine(){
				var geometry = new THREE.Geometry();
				geometry.vertices.push(
						new THREE.Vector3(10,25,7),
						new THREE.Vector3(110,50,0),
						new THREE.Vector3(10,25,7));
				var material = new THREE.LineBasicMaterial({color: 0xF6CEF5});
				line = new THREE.Line(geometry,material);
				scene.add(line);
			}

			function addGrid(){
				grid = new THREE.GridHelper( 1000, 100, 0x888888, 0x888888);
				grid.position.set(0,-0.1,0);
				scene.add(grid);
			}


      function addPlane(){
        var plane = new THREE.PlaneBufferGeometry(1000 , 1000, 10,10);
        var material = new THREE.MeshBasicMaterial({color:0x33FF00, side: THREE.DoubleSide});
        floor = new THREE.Mesh(plane, material);
        floor.rotation.x = Math.PI/2;
        scene.add(floor);
      }

      function addSphere (){
				var texture = new THREE.TextureLoader().load('img/tierra.jpeg');
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
				texture.repeat.set(1,1);
        //var material = new THREE.MeshBasicMaterial({color:0xA34242});
				var material = new THREE.MeshBasicMaterial({map: texture});
        sphere = new THREE.Mesh( new THREE.SphereGeometry( 20, 20, 20 ), material );
				sphere.position.set( 50, 50, 50 );
        obj_active = sphere;
				scene.add( sphere );
      }

      function addCube(){
				var texture = new THREE.TextureLoader().load('img/cubemario.jpg');
        var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
				//var material = [new THREE.MeshBasicMaterial({color:0x00BB00}),
          //new THREE.MeshBasicMaterial({color:0xAA000F}),
          //new THREE.MeshBasicMaterial({color:0xCC0000}),
          //new THREE.MeshBasicMaterial({color:0xFF00CC}),
          //new THREE.MeshBasicMaterial({color:0x77FFCC}),
          //new THREE.MeshBasicMaterial({color:0x77CC00})];
				var material = new THREE.MeshBasicMaterial({ map: texture});
				cube = new THREE.Mesh( geometry, material );
        cube.position.set( 50, 50, 50 );
        obj_active = cube;
				scene.add(cube);
      }

      function addBell(){
				var texture = new THREE.TextureLoader().load('img/bell.jpg');
				var material = new THREE.MeshBasicMaterial({map: texture});
        //var material = new THREE.MeshBasicMaterial({color:0xA34242});
          bell = new THREE.Mesh( new THREE.CylinderGeometry( 5, 25, 50, 40, 5 ), material );
				  bell.position.set( 50, 75, 50 );
          obj_active = bell;
				  scene.add( bell );
      }

      function webGLStart (){
        init();
        addAxes();
				addGrid();
        //addPlane();
        addCube();
				addLine();
  			animate();
        var slider = document.getElementById("myRange");
        slider.oninput = function() {
          rotationx = this.value/1000;
          rotationy = this.value/1000;
          console.log(rotationx);
        }
      }

      function changeObj(){
        obj = document.getElementById("change").value;
        scene.remove(obj_active);
        if (obj == "Sphere"){
          addSphere();
        } else if (obj == "Cube") {
          addCube();
        } else {
          addBell();
        }
      }

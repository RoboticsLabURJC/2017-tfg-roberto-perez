var camera, scene, renderer, controls;
var cube, floor, axes, sphere, bell, grid, line;
var obj;
var vel = 0;
var w = 0;

			function init() {
				camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 30;
        camera.position.y = 5;
        camera.position.x = 10;
				scene = new THREE.Scene();
				renderer = new THREE.WebGLRenderer();
				renderer.setSize( window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x58D3F7);
				document.getElementById("canvas").appendChild( renderer.domElement );
				controls = new THREE.OrbitControls(camera, renderer.domElement);
				window.addEventListener( 'resize', onWindowResize, false );
				start();
			}
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function animate() {
				requestAnimationFrame( animate );
				obj.position.x += vel * Math.cos(w); - vel * Math.sin(w)
				obj.position.z += vel * Math.sin(w) + vel * Math.cos(w);
				//obj.rotation.y += w;
				renderer.render( scene, camera );
			}

      function addAxes (){
        axes = new THREE.Object3D();
        axes.add(buildAxis(new THREE.Vector3(0,0,0),new THREE.Vector3(1,0,0), 0xFF0000, false)); //x
        axes.add(buildAxis(new THREE.Vector3(0,0,0),new THREE.Vector3(0,1,0), 0x00FF00, false)); //Y
        axes.add(buildAxis(new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,1), 0x0000FF, false)); //Z
        scene.add(axes);
      }

			function addLights(){
				var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
				scene.add( ambientLight );

				var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.8 );
				directionalLight.position.set( 1, 1, 0 ).normalize();
				scene.add( directionalLight );
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

			function addGrid(){
				grid = new THREE.GridHelper( 100, 100, 0x888888, 0x888888);
				scene.add(grid);
			}

      function addCube(){
				var texture = new THREE.TextureLoader().load('img/cubemario.jpg');
        var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
				var material = [new THREE.MeshBasicMaterial({color:0x00BB00}),
          new THREE.MeshBasicMaterial({color:0xAA000F}),
          new THREE.MeshBasicMaterial({color:0xCC0000}),
          new THREE.MeshBasicMaterial({color:0xFF00CC}),
          new THREE.MeshBasicMaterial({color:0x77FFCC}),
          new THREE.MeshBasicMaterial({color:0x77CC00})];
				cube = new THREE.Mesh( geometry, material );
        obj = cube;
				scene.add(cube);
      }

      function webGLStart (){
        init();
        addAxes();
				addGrid();
        addLights();
				var loader = new GUI.RobotLoader();
				loader.loadTurtlebot(1,function () {
					 obj=loader.robot;
					 scene.add(obj);
					 animate();
				});

      }

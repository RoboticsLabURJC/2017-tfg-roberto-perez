var API = API || {};

/*
 * API.Camera's Constructor.
 * Params:
 *     - config (contents client's Config)={server,id,epname,fpsid,imgFormat}:
 *       + id (canvas' id to show RGB camera)
 *       + fpsid (id of element to show fps, is optional)
 *       + server (server's direction and port)={dir:direction,port: port}
 *       + epname (name of camera endpoint, default cameraA)
 *       + imgFormat (format of image that is going to request to the server, default RGB8)
 */

API.CameraRos = function (config) {
	console.log(config);
	var conf = config || {};
	this.ros;
	this.isRunning = false;
	this.div = config.id;
	var self = this;
	this.connect = function (topic){

			 self.ros = new ROSLIB.Ros({
					 url : "ws://"+config.dir+":"+config.port
				});

				// This function is called upon the rosbridge connection event
				self.ros.on('connection', function() {
						// Write appropriate message to #feedback div when successfully connected to rosbridge
						console.log("Connect websocket Camera");
						//self.isRunning = true;
				});
			 // This function is called when there is an error attempting to connect to rosbridge
			 self.ros.on('error', function(error) {
					 // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
					 console.log("Error to connect websocket");
			 });

			 // These lines create a topic object as defined by roslibjs
				self.roscam = new ROSLIB.Topic({
					 ros : self.ros,
					 name : topic,
					 messageType : "sensor_msgs/CompressedImage"
			 });

	};

	this.startStreaming = function(){
			 var canvas = document.getElementById("camView");
			 var ctx = canvas.getContext("2d");
			 var imagedata = new Image();
			 self.isRunning = true;
			 console.log("Subscribe Camera")
			 self.roscam.subscribe(function(message){
				 if (message.format != null){
					 imagedata.src = "data:image/jpg;base64," + message.data;
					 imagedata.onload = function(){
						 ctx.drawImage(imagedata,0,0,canvas.width,canvas.height);
					 }
				 } else {
					 console.log(message);
				 }
		 });
	};

	this.stop = function (){
	 self.roscam.unsubscribe();
	 console.log("Unsubscribe Camera");
	};

	this.disconnect = function (){
	 self.ros.on('close',function(){
		 console.log("Disconnect websocket Camera");
	 });
	 self.ros.close();
	 self.ros = undefined;

	}
	}

	API.MotorsRos = function(config){
		var conf = config || {};
		var timestamp = new Date().getTime();
		this.ros;
		this.isRunning = false;
		var self = this;
		this.connect = function (topic){
			console.log(topic);

				 self.ros = new ROSLIB.Ros({
						 url : "ws://"+config.dir+":"+config.port
					});

					// This function is called upon the rosbridge connection event
					self.ros.on('connection', function() {
							// Write appropriate message to #feedback div when successfully connected to rosbridge
							console.log("Connect websocket Motors");
							self.isRunning = true;
					});
				 // This function is called when there is an error attempting to connect to rosbridge
				 self.ros.on('error', function(error) {
						 // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
						 console.log("Error to connect websocket");
				 });

				 // These lines create a topic object as defined by roslibjs
					self.rosMotors = new ROSLIB.Topic({
						 ros : self.ros,
						 name : topic,
						 messageType : "mavros_msgs/PositionTarget"
				 });
		};

		this.setMotors = function(vel){
			var msg = {};
			var currentTime = new Date().getTime()-timestamp;
			var secs = Math.floor(currentTime/1000);
			var nsecs = Math.round(1000000000*(currentTime/1000-secs));
			msg.header = {};
			msg.header.stamp = {};
			msg.header.stamp.secs = secs;
			msg.header.stamp.nsecs = nsecs;
			msg.header.frame_id = "";
			msg.coordinate_frame = 8;
			msg.type_mask = 1475;
			msg.position = {};
			msg.position.x = 0;
			msg.position.y = 0;
			msg.position.z = vel.linearZ;
			msg.velocity = {};
			msg.velocity.x = vel.linearY;
			msg.velocity.y = vel.linearX;
			msg.velocity.z = 0;
			msg.acceleration_or_force = {};
			msg.acceleration_or_force.x = 0;
			msg.acceleration_or_force.y = 0;
			msg.acceleration_or_force.z = 0;
			msg.yaw = 0;
			msg.yaw_rate = 0;
			var motorsMessage = new ROSLIB.Message({
				header: msg.header,
				coordinate_frame: 8,
				type_mask: 1475,
				position: msg.position,
				velocity: msg.velocity,
				acceleration_or_force: msg.acceleration_or_force,
				yaw: 0,
				yaw_rate: 0
			});
			//console.log(motorsMessage);
			self.rosMotors.publish(motorsMessage);
		}

		this.disconnect = function (){
			self.ros.on('close',function(){
				console.log("Disconnect websocket Motors");
			});
			self.ros.close();
			self.ros = undefined;

		}
	}

	API.ExtraRos = function(config){
		var conf = config || {};
		this.ros;
		this.latitude = 0;
		this.longitude = 0;
		this.isRunning = false;
		this.takeoffInterval;
		this.armingInterval;
		var self = this;
		this.connect = function (topic_setmode,topic_arming, topic_takeoff, topic_land){
		self.ros = new ROSLIB.Ros({
				url : "ws://"+config.dir+":"+config.port
		 });

		 // This function is called upon the rosbridge connection event
		 self.ros.on('connection', function() {
				 // Write appropriate message to #feedback div when successfully connected to rosbridge
				 console.log("Connect websocket Motors");
				 self.isRunning = true;
		 });
		// This function is called when there is an error attempting to connect to rosbridge
		self.ros.on('error', function(error) {
				// Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
				console.log("Error to connect websocket");
		});

		// These lines create a topic object as defined by roslibjs

		self.rosSet_Mode = new ROSLIB.Service({
			ros: self.ros,
			name: topic_setmode,
			messageType: "mavros_msgs/SetMode"
		});

		self.rosArming = new ROSLIB.Service({
			 ros : self.ros,
			 name : topic_arming,
			 messageType : "mavros_msgs/CommandBool"
	 });

		 self.rosTakeoff = new ROSLIB.Service({
				ros : self.ros,
				name : topic_takeoff,
				messageType : "mavros_msgs/CommandTOL"
		});

		self.rosLand = new ROSLIB.Service({
			 ros : self.ros,
			 name : topic_land,
			 messageType : "mavros_msgs/CommandTOL"
	 });
	}

	this.setmode = function(){
		var request = new ROSLIB.ServiceRequest({
			custom_mode: "OFFBOARD"
		});
		self.rosSet_Mode.callService(request, function(result){
			console.log("Mode change to: OFFBOARD");
		})
	}

	this.takeoff = function(){
		console.log("Taking off...");
		var request = new ROSLIB.ServiceRequest({
			altitude:5.5,
			latitude: 0,
			longitude: 0,
			min_pitch: 0,
			yaw: 0
		});
		self.rosTakeoff.callService(request, function(result) {
			console.log("TakeOff Done");
			self.setmode();
	});
	}

	this.arming = function(arming){
		var request = new ROSLIB.ServiceRequest({
			value: arming
		});
		self.rosArming.callService(request, function(result){
			if (arming){
				console.log("Arming Done");
				self.takeoff();
			} else {
				clearInterval(this.armingInterval);
				console.log("Disarming Done");
			}
		});
	}

	this.land = function(){
		console.log("Landing...");
		var request = new ROSLIB.ServiceRequest({
			min_pitch: 0,
			yaw: 0,
			latitude: 0,
			longitude: 0,
			altitude:0,
		});
		self.rosLand.callService(request, function(result){
			console.log("Land Done")
			this.armingInterval = setInterval(function(){
				self.arming(false)},10000);
		});
	}
}

API.Pose3DRos = function(config){
	var conf = config || {};
	this.isRunning = false;
	var self = this;
	var lastPose;
	var model = model;
	this.connect = function (topic){

			 self.ros = new ROSLIB.Ros({
					 url : "ws://"+config.dir+":"+config.port
				});

				// This function is called upon the rosbridge connection event
				self.ros.on('connection', function() {
						// Write appropriate message to #feedback div when successfully connected to rosbridge
						console.log("Connect websocket Pose3D");
				});
			 // This function is called when there is an error attempting to connect to rosbridge
			 self.ros.on('error', function(error) {
					 // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
					 console.log("Error to connect websocket")
			 });

			 // These lines create a topic object as defined by roslibjs
				self.rospose = new ROSLIB.Topic({
					 ros : self.ros,
					 name : topic,
					 messageType :"geometry_msgs/PoseStamped"
			 });

	};

	this.startStreaming = function(model){
		self.isRunning = true;
		console.log("Subscribe Pose3D");
			 self.rospose.subscribe(function(message){
				 if (lastPose != message.pose){
					 var position = message.pose.position;
					 var orientation = getPose3D(message.pose.orientation);
					 if (model.active) {
	            model.robot.position.set(Math.round(position.x*-10)/10,Math.round(position.z*10)/10,
							Math.round(position.y*10)/10);
	            model.robot.rotation.y=(orientation.yaw);
	            model.robot.updateMatrix();}
				}
				lastPose = message.pose.pose;
		 });
	};

	this.stop = function (){
	 self.rospose.unsubscribe();
	 console.log("Unsubscribe Pose3D");
 }

 this.disconnect = function (){
	 self.ros.on('close',function(){
		 console.log("Disconnect websocket Pose3D");
	 });
	 self.ros.close();
	 self.ros = undefined;

 }

 function getPose3D(pos){
	 	var orientation = {}
	 	orientation.yaw = getYaw(pos.w,pos.x,pos.y,pos.z);
		orientation.roll = getRoll(pos.w,pos.x,pos.y,pos.z);
		orientation.pitch = getPitch(pos.w,pos.x,pos.y,pos.z);
		return orientation;
 }

 // Functions return the value of fliying parameters
 function getYaw(qw,qx,qy,qz) {
        var rotateZa0=2.0*(qx*qy + qw*qz);
        var rotateZa1=qw*qw + qx*qx - qy*qy - qz*qz;
        var rotateZ=0.0;
        if(rotateZa0 != 0.0 && rotateZa1 != 0.0){
            rotateZ=Math.atan2(rotateZa0,rotateZa1);
        }
        return rotateZ;
 }

 function getRoll(qw,qx,qy,qz){
        rotateXa0=2.0*(qy*qz + qw*qx);
        rotateXa1=qw*qw - qx*qx - qy*qy + qz*qz;
        rotateX=0.0;

        if(rotateXa0 != 0.0 && rotateXa1 !=0.0){
            rotateX=Math.atan2(rotateXa0, rotateXa1);
        }
        return rotateX;
 }
 function getPitch(qw,qx,qy,qz){
        rotateYa0=-2.0*(qx*qz - qw*qy);
        rotateY=0.0;
        if(rotateYa0>=1.0){
            rotateY=math.PI/2.0;
        } else if(rotateYa0<=-1.0){
            rotateY=-Math.PI/2.0
        } else {
            rotateY=Math.asin(rotateYa0)
        }

        return rotateY;
 }
}

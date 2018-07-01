var cmdVelInterval, cameraInterval;
var ros = new ROSLIB.Ros({
    url : "ws://192.168.1.108:9090"
 });

 // This function is called upon the rosbridge connection event
 ros.on('connection', function() {
     // Write appropriate message to #feedback div when successfully connected to rosbridge
     console.log("Connect websocket")
 });
// This function is called when there is an error attempting to connect to rosbridge
ros.on('error', function(error) {
    // Write appropriate message to #feedback div upon error when attempting to connect to rosbridge
    console.log("Error to connect websocket")
});
// This function is called when the connection to rosbridge is closed
ros.on('close', function() {
    // Write appropriate message to #feedback div upon closing connection to rosbridge
    console.log("Disconnect websocket");
 });

 var imageTopic = new ROSLIB.Topic({
   ros : ros,
   name : '/usb_cam/image_raw/compressed',
   messageType : "sensor_msgs/CompressedImage"
 });

 var cmdVelTopic = new ROSLIB.Topic({
     ros : ros,
     name : "motors/cmd_vel",
     messageType : "geometry_msgs/Twist"
 });

function start(){
  cmdVelTopic.subscribe(function(message){
    v = message.linear.x;
    w = message.angular.x;
  });
}

function startStreaming(){
  var canvas = document.getElementById('camera2');
  var data = canvas.toDataURL('image/jpeg');
  var imageMessage = new ROSLIB.Message({
    format : "jpeg",
    data : data.replace("data:image/jpeg;base64,", "")
  });
  console.log(imageMessage);
  imageTopic.publish(imageMessage);
}

function init(){
  cmdVelInterval = setInterval(function(){
    start();
  },1);
  cameraInterval = setInterval(function(){
    startStreaming();
  },1);
}

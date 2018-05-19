var ros = new ROSLIB.Ros({
    url : "ws://localhost:9090"
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

 var cmdVelTopic = new ROSLIB.Topic({
     ros : ros,
     name : "motors/cmd_vel",
     messageType : "geometry_msgs/Twist"
 });

function start(){
  self.cmdVelTopic.subscribe(function(message){
    v = message.linear.x;
    w = message.angular.x;
  });
}

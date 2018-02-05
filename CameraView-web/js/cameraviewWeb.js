const yaml = require('js-yaml');
const fs = require('fs');
var config={};
var camera;

$(document).ready(function() {
   load();
   config.camid= "camView";
   config.fpsid= "fps";
   config.sizeid= "size";
   console.log(config);
   //var server = config.serv.tech;
   var server = "Ice";
   $('#start').on('click', function(){
      $("#camView").removeClass("border-light");
      if (server == "Ice"){
        camera = new CameraViewIce(config);
      } else if (server == "Ros")
		    camera = new CameraViewRos(config);
      else {
        console.log("Error, not server name")
      }
         camera.start();
	});

   $('#stop').on('click', function(){
         camera.stop();
	});

   var resize = function (){
      $(".cam").height( $(".cam").width()*3/4);
   };

   $(window).resize(function(){
      resize();
   });

   $('#serv').change(function(){
          if ($('#serv').val() == "Ice"){
       if ($('#ep').length == 0){
         $('#rostopic').remove();
         $("#confignav").append('<div id = "endpoint" class="input-group">'+
            '<span class="input-group-addon" id="basic-addon1">EndPoint</span>'+
            '<input id="ep" type="text" class="form-control" value="cameraA" aria-describedby="basic-addon1">'+
         '</div>')
         }
       } else if ($('#serv').val() == "Ros") {
         if ($('#rostopic').length == 0){
         $("#endpoint").remove();
         $("#confignav").append('<div id = "rostopic"><div class="input-group"><span class="input-group-addon" id="basic-addon1">RosTopic</span>'+
         '<input id="topic" type="text" class="form-control" value="/usb_cam/image_raw/compressed" aria-describedby="basic-addon1"></div>'
         +'<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">RosMessageType</span>'+
         '<input id="messageType" type="text" class="form-control" value="sensor_msgs/CompressedImage" aria-describedby="basic-addon1"></div></div>')
       }
     }
   })

   $('#save').on('click', function(){
    config.serv.dir= $('#dir').val();
    config.serv.port= $('#port').val();
    config.serv.tech = $('#serv').val();
    server = $('#serv').val();
    if ($('#serv').val() == "Ice") {
      config.epname = $('#ep').val();
    } else if ($('#serv').val() == "Ros"){
      config.topic = $('#topic').val();
      config.msgs = $('#messageType').val();
    }
    if (camera != undefined){
      console.log("entra");
      camera.stop();
      camera = undefined;
    }
    localStorage["cameraviewconfig"]=JSON.stringify(config);
   });

   resize();
});



function load(){
   if (localStorage.getItem("cameraviewconfig")) {
       config = JSON.parse(localStorage.getItem("cameraviewconfig"));
      $('#serv').val(config.serv.tech);
      $('#dir').val(config.serv.dir);
      $('#port').val(config.serv.port);
      if (config.serv.tech == "Ice") {
        $('#ep').val(config.epname);
      } else if (config.serv.tech == "Ros"){
        $("#endpoint").remove();
        $("#confignav").append('<div id = "rostopic"><div class="input-group"><span class="input-group-addon" id="basic-addon1">RosTopic</span>'+
        '<input id="topic" type="text" class="form-control" value="/usb_cam/image_raw/compressed" aria-describedby="basic-addon1"></div>'
        +'<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">RosMessageType</span>'+
        '<input id="messageType" type="text" class="form-control" value="sensor_msgs/CompressedImage" aria-describedby="basic-addon1"></div></div>')
        $('#topic').val(config.topic);
        $('#messageType').val(config.msgs);
      }
    } else{
      try {
          config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));
          if (config.serv.tech == "Ros"){
            $("#endpoint").remove();
            $("#confignav").append('<div id = "rostopic"><div class="input-group"><span class="input-group-addon" id="basic-addon1">RosTopic</span>'+
            '<input id="topic" type="text" class="form-control" value="/usb_cam/image_raw/compressed" aria-describedby="basic-addon1"></div>'
            +'<br><div class="input-group"><span class="input-group-addon" id="basic-addon1">RosMessageType</span>'+
            '<input id="messageType" type="text" class="form-control" value="sensor_msgs/CompressedImage" aria-describedby="basic-addon1"></div></div>')
          }
        } catch (e) {
          config.serv.dir= $('#dir').val();
          config.serv.port= $('#port').val();
          config.serv.tech = $('#serv').val();
          server = $('#serv').val();
          if ($('#serv').val() == "Ice") {
            config.epname = $('#ep').val();
          } else if ($('#serv').val() == "Ros"){
            config.topic = $('#topic').val();
            config.msgs = $('#messageType').val();
          }
     }
}
}

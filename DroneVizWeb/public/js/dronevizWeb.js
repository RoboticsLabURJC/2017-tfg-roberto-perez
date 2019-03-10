var config={};
//config.server = "Ice";
var realEP={
   cam: "ardrone_camera",
   pose3d: "ardrone_pose3d",
   cmdvel: "ardrone_cmdvel",
   extra: "ardrone_extra"
};
var simEP={
   cam: "Camera",
   pose3d: "Pose3D",
   cmdvel: "CMDVel",
   extra: "Extra"
};

var realPort={
   cam: 11000,
   pose3d: 11003,
   cmdvel: 11002,
   extra: 11004
};
var simPort={
   cam: 11000,
   pose3d: 11000,
   cmdvel: 11000,
   extra: 11000
};

var rosTopic={
  cam: "/iris_fpv_cam/cam_frontal/image_raw/compressed",
  pose3d:"/mavros/local_position/odom",
  cmdvel: "/mavros/setpoint_raw/local",
  extra: "Extra"
};

var rosPort={
  cam: 9090,
  pose3d: 9090,
  cmdvel: 9090,
  extra: 9090
};

try {
  const yaml = require('js-yaml');
  const fs = require('fs');
  config = yaml.safeLoad(fs.readFileSync('public/config.yml', 'utf8'));
  localStorage["droneviewer"]=JSON.stringify(config);
} catch(e){
  console.log(e);
}

function putDfEP (eps){
  $('#ep1').text("EndPoint");
  $('#ep2').text("EndPoint");
  $('#ep3').text("EndPoint");
  $('#ep4').text("EndPoint");
   $('#epcam1').val(eps.cam);
   $('#eppose3d').val(eps.pose3d);
   $('#epextra').val(eps.extra);
   $('#epcmdvel').val(eps.cmdvel);
}
function putDfPort (ports){
   $('#portcam1').val(ports.cam);
   $('#portpose3d').val(ports.pose3d);
   $('#portextra').val(ports.extra);
   $('#portcmdvel').val(ports.cmdvel);
}

function putDfRosPort (ports){
  $('#portcam1').val(ports.cam);
  $('#portpose3d').val(ports.pose3d);
  $('#portextra').val(ports.extra);
  $('#portcmdvel').val(ports.cmdvel);
}

function putDfRosTopic (topic){
   $('#ep1').text("Topic");
   $('#ep2').text("Topic");
   $('#ep3').text("Topic");
   $('#ep4').text("Topic");
   $('#epcam1').val(topic.cam);
   $('#eppose3d').val(topic.pose3d);
   $('#epextra').val(topic.extra);
   $('#epcmdvel').val(topic.cmdvel);
}

$(document).ready(function() {
   var client;
   load();
   config.control1id="control1";
   config.control2id="control2";
   config.cam1id="camView";
   config.modelid="model";
   config.takeoffbtnid="takeoff";
   config.resetbtnid="reset";
   config.landbtnid="land";
   config.togcambtnid="toggle";
   config.stopbtnid="stopb";
   config.attitudeid="attitude";
   config.headingid="heading";
   config.altimeterid="altimeter";
   config.turn_coordinatorid="turn_coordinator";

   $('#start').on('click', function(){
     console.log(config.server);
     if (config.server == "Ice"){
		     client = new DroneVizIce(config);
     } else if (config.server == "Ros") {
         client = new DroneVizRos(config);
     }
         client.start();
       $('#mod-toggle').prop( "disabled", false );
	});

   $('#stop').on('click', function(){
         client.stop();
       $('#mod-toggle').prop( "disabled", true );
	});

   $('#mod-toggle').change(function(evt) {
      if ($(this).prop('checked') && client){
         client.modelON();
      }else if (client){
         client.modelOFF();
      }
    });

    $('#DfReal').on('click', function(){
         config.server = "Ice"
         putDfEP(realEP);
         putDfPort(realPort);
	});
    $('#DfGazebo').on('click', function(){
         config.server = "Simulate"
         putDfEP(simEP);
         putDfPort(simPort);
	});

    $('#DfGazeboRos').on('click', function(){
        config.server = "Ros";
        putDfRosPort(rosPort);
        putDfRosTopic(rosTopic);
    })


   var resize = function (){
      $(".cam").height( $(".cam").width()*9/16);
      if (client && client.isRunning()){
         client.resizeCameraModel();
      }

      $(".instrument").width($("#camView").height()/5);
      $(".instrument").height($("#camView").height()/5);

   };


   $(window).resize(resize);

   $('#save').on('click', function(){
      config.cam1serv.dir= $('#dircam1').val();
      config.cam1serv.port= $('#portcam1').val();
      config.cam1epname= $('#epcam1').val();
      config.pose3dserv.dir= $('#dirpose3d').val();
      config.pose3dserv.port= $('#portpose3d').val();
      config.pose3depname= $('#eppose3d').val();
      config.extraserv.dir= $('#dirextra').val();
      config.extraserv.port= $('#portextra').val();
      config.extraepname= $('#epextra').val();
      config.cmdvelserv.dir= $('#dircmdvel').val();
      config.cmdvelserv.port= $('#portcmdvel').val();
      config.cmdvelepname= $('#epcmdvel').val();
      localStorage["droneviewer"]=JSON.stringify(config);
	});

   function sameaddr (){
      var value = $( "#globaladdr" ).val();
      $( ".in-addr" ).val( value );
   }

   $('#sa-button').on('click', sameaddr);

   //$( "#globaladdr" ).keyup(sameaddr);

   /*$('#sa-toggle').change(function(evt) {
       $(".in-addr").prop('disabled',!$(".in-addr").prop('disabled'));
       $("#globaladdr").prop('disabled',!$("#globaladdr").prop('disabled'));
      if ($(this).prop('checked')){
         sameaddr();
      }
    });*/

   resize();

   var pfx = ["webkit", "moz", "ms", "o", ""];
   function RunPrefixMethod(obj, method) {

	  var p = 0, m, t;
	  while (p < pfx.length && !obj[m]) {
		m = method;
		if (pfx[p] == "") {
			m = m.substr(0,1).toLowerCase() + m.substr(1);
		}
		m = pfx[p] + m;
		t = typeof obj[m];
		if (t != "undefined") {
			pfx = [pfx[p]];
			return (t == "function" ? obj[m]() : obj[m]);
		}
		p++;
	  }
   }

   var fullScreen = function(){
      var canvas = $("#camView");

      if (RunPrefixMethod(document, "FullScreen") || RunPrefixMethod(document, "IsFullScreen")) {
		RunPrefixMethod(document, "CancelFullScreen");
         canvas.width("100%");
         //$("#model").show();
	  }
	  else {
		RunPrefixMethod(document.getElementById("teleoperator"), "RequestFullScreen");
         canvas.width($( window ).width());
         //$("#model").hide();
	  }
   };


   $("#camView").on("click", fullScreen);
   $("#camView").on("touchstart", fullScreen);

});

function load(){
        if (localStorage.getItem("droneviewer")) {
          config = JSON.parse(localStorage.getItem("droneviewer"));
          $('#dircam1').val(config.cam1serv.dir);
          $('#portcam1').val(config.cam1serv.port);
          $('#epcam1').val(config.cam1epname);
          $('#dirpose3d').val(config.pose3dserv.dir);
          $('#portpose3d').val(config.pose3dserv.port);
          $('#eppose3d').val(config.pose3depname);
          $('#dirextra').val(config.extraserv.dir);
          $('#portextra').val(config.extraserv.port);
          $('#epextra').val(config.extraepname);
          $('#dircmdvel').val(config.cmdvelserv.dir);
          $('#portcmdvel').val(config.cmdvelserv.port);
          $('#epcmdvel').val(config.cmdvelepname);
        } else{
          config.cam1serv={};
          config.pose3dserv={};
          config.extraserv={};
          config.cmdvelserv={};
          config.server = "Ice";
          config.cam1serv.dir= $('#dircam1').val();
          config.cam1serv.port= $('#portcam1').val();
          config.cam1epname= $('#epright').val();
          config.pose3dserv.dir= $('#dirpose3d').val();
          config.pose3dserv.port= $('#portpose3d').val();
          config.pose3depname= $('#eppose3d').val();
          config.extraserv.dir= $('#dirextra').val();
          config.extraserv.port= $('#portextra').val();
          config.extraepname= $('#epextra').val();
          config.cmdvelserv.dir= $('#dircmdvel').val();
          config.cmdvelserv.port= $('#portcmdvel').val();
          config.cmdvelepname= $('#epcmdvel').val();
        }
        if (config.server == "Ros"){
          rosTopic.cam = config.cam1epname;
          rosTopic.pose3d = config.pose3depname;
          rosTopic.cmdvel = config.cmdvelepname;
          rosTopic.extra = config.extraepname;
          rosPort.cam = config.cam1serv.port;
          rosPort.pose3d = config.pose3dserv.port;
          rosPort.cmdvel = config.cmdvelserv.port;
          rosPort.extra = config.extraserv.port;
          putDfRosPort(rosPort);
          putDfRosTopic(rosTopic);
        } else if (config.server == "Ice") {
          realEP.cam = config.cam1epname;
          realEP.pose3d = config.pose3depname;
          realEP.cmdvel = config.cmdvelepname;
          realEp.extra = config.extraepname;
          realPort.cam = config.cam1serv.port;
          realPort.pose3d = config.pose3dserv.port;
          realPort.cmdvel = config.cmdvelserv.port;
          realPort.extra = config.extraserv.port;
          putDfEP(realEP);
          putDfPort(realPort);
        } else {
          simEP.cam = config.cam1epname;
          simEP.pose3d = config.pose3depname;
          simEP.cmdvel = config.cmdvelepname;
          simEP.extra = config.extraepname;
          simPort.cam = config.cam1serv.port;
          simPort.pose3d = config.pose3dserv.port;
          simPort.cmdvel = config.cmdvelserv.port;
          simPort.extra = config.extraserv.port;
          putDfEP(simEP);
          putDfPort(simPort);
        }
    }

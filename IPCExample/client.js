const electron = require("electron");
const {ipcRenderer} = electron;

function send_text (){
  text = document.getElementById("input").value;
  ipcRenderer.send("async", text);
};

ipcRenderer.on("async-reply",(event,arg) =>{
  p = document.getElementById("request");
  p.innerHTML = arg;
});

const electron = require("electron");
const {ipcRenderer} = electron

function iceSend (){
  ipcRenderer.send("async", 1);
}

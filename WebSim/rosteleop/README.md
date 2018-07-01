# Demo with Teleoperator Ros

## Install packages
```
sudo sh -c 'echo "deb http://packages.ros.org/ros/ubuntu $(lsb_release -sc) main" > /etc/apt/sources.list.d/ros-latest.list'
sudo apt-key adv --keyserver hkp://ha.pool.sks-keyservers.net:80 --recv-key 421C365BD9FF1F717815A3895523BAEEB01FA116

sudo apt update

sudo apt-get install nodejs
sudo apt-get install npm

sudo apt install ros-kinetic-rosbridge-server



```

## Running the example

In a termintal run:
```
roslaunch rosbridge_server rosbridge_websocket.launch
```

In a second terminal run:
```
cd python_client
python python_client.py
```

In last terminal run:
```
cd websim
npm install electron
npm start
```

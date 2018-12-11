import sys, traceback, Ice
import jderobot
import numpy as np
from random import uniform
from random import randrange

bufferpoints = []
bufferline = []
bufferpose3D = []
id_list = []
obj_list = ["https://raw.githubusercontent.com/JdeRobot/JdeRobot/master/assets/gazebo/models/f1/meshes/F1.dae"
,"https://raw.githubusercontent.com/JdeRobot/WebSim/master/bones/tronco2.obj",
"model/Car.dae"]
refresh = False


class ViewerI(jderobot.Visualization):
    def __init__(self):
	self.cont = 0

    def getSegment(self, current=None):
        rgblinelist = jderobot.bufferSegments()
        rgblinelist.buffer = []
        rgblinelist.refresh = refresh
        for i in bufferline[:]:
            rgblinelist.buffer.append(i)
            index = bufferline.index(i)
            del bufferline[index]
        getbufferSegment()
        print "Segmentos enviados"
        return rgblinelist

    def drawPoint(self,point, color, current=None):
        print point

    def getPoints(self, current=None):
        rgbpointlist = jderobot.bufferPoints()
        rgbpointlist.buffer = []
        rgbpointlist.refresh = refresh
        for i in bufferpoints[:]:
            rgbpointlist.buffer.append(i)
            index = bufferpoints.index(i)
            del bufferpoints[index]
        getbufferPoint()
        print "Puntos enviados"
        return rgbpointlist

    def getObj3D(self, id, current=None):
        if len(obj_list) > self.cont:
            obj3D = jderobot.object3d()
            model = obj_list[self.cont].split(":")
            if model[0] == "https":
                obj3D.obj = obj_list[self.cont]
                model = obj_list[self.cont].split("/")
                name,form = model[len(model)-1].split(".")
                print "Enviando modelo por url: " + name + "." + form
            else:
                obj = open(obj_list[self.cont], "r").read()
                name,form = obj_list[self.cont].split(".")
                obj3D.obj = obj
                print "Enviando modelo como texto plano: " + name + "." + form
            pose3d = jderobot.Pose3DData()
            pose3d.x = randrange(0,20)
            pose3d.y = randrange(0,20)
            pose3d.z = randrange(0,20)
            pose3d.h = uniform(0,10)
            pose3d.q0 = uniform(0,1)
            pose3d.q1 = uniform(0,1-pose3d.q0)
            pose3d.q2 = uniform(0,1-pose3d.q0-pose3d.q1)
            pose3d.q3 = uniform(0,1-pose3d.q0-pose3d.q1-pose3d.q2)
            id_list.append(id)
            obj3D.id = id
            obj3D.format = form
            obj3D.pos = pose3d
            obj3D.scale = uniform(0,10)
            obj3D.refresh = refresh;
            self.cont = self.cont + 1
            return obj3D

    def getPoseObj3DData(self, current=None):
        for i in bufferpose3D[:]:
            index = bufferpose3D.index(i)
            del bufferpose3D[index]
        for i in id_list[:]:
            pose3d = jderobot.Pose3DData()
            pose3d.x = randrange(0,20)
            pose3d.y = randrange(0,20)
            pose3d.z = randrange(0,20)
            pose3d.h = randrange(-1,1)
            pose3d.q0 = uniform(0,1)
            pose3d.q1 = uniform(0,1-pose3d.q0)
            pose3d.q2 = uniform(0,1-pose3d.q0-pose3d.q1)
            pose3d.q3 = uniform(0,1-pose3d.q0-pose3d.q1-pose3d.q2)
            objpose3d = jderobot.PoseObj3D()
            objpose3d.id = id_list [id_list.index(i)]
            objpose3d.pos = pose3d
            bufferpose3D.append(objpose3d)
        print "Enviados movimientos para los modelos"
        return bufferpose3D

    def clearAll(self, current=None):
        print "Clear All"

def getbufferSegment ():
    for i in range(randrange(0,5)):
        rgbsegment = jderobot.RGBSegment()
        color = jderobot.Color()
        color.r = uniform(0,1)
        color.g = uniform(0,1)
        color.b = uniform(0,1)
        rgbsegment.seg.fromPoint.z = uniform(-20, 20)
        rgbsegment.seg.toPoint.z = uniform(-20, 20)
        rgbsegment.seg.fromPoint.y = uniform(-20, 20)
        rgbsegment.seg.toPoint.y = uniform(-20, 20)
        rgbsegment.seg.fromPoint.x = uniform(-20, 20)
        rgbsegment.seg.toPoint.x = uniform(-20, 20)
        rgbsegment.c = color
        bufferline.append(rgbsegment)

def getbufferPoint():
    for i in range(randrange(0,5)):
        rgbpoint = jderobot.RGBPoint()
        rgbpoint.x = uniform(-20, 20)
        rgbpoint.y = uniform(-20, 20)
        rgbpoint.z = uniform(-20, 20)
        rgbpoint.r = uniform(0,1)
        rgbpoint.g = uniform(0,1)
        rgbpoint.b = uniform(0,1)
        bufferpoints.append(rgbpoint)

try:
    getbufferSegment()
    getbufferPoint()
    endpoint = "default -h localhost -p 9957:ws -h localhost -p 11000"
    print "Connect: " + endpoint
    id = Ice.InitializationData()
    ic = Ice.initialize(None, id)
    adapter = ic.createObjectAdapterWithEndpoints("3DVizA", endpoint)
    object = ViewerI()
    adapter.add(object, ic.stringToIdentity("3DViz"))
    adapter.activate()
    ic.waitForShutdown()
except KeyboardInterrupt:
	del(ic)
	sys.exit()

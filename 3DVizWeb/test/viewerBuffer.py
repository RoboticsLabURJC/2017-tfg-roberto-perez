import sys, traceback, Ice
import jderobot
import numpy as np
from random import uniform
from random import randrange

lptox1 = 0
lptox2 = 0
lptox3 = 0
pointx = 0
pointx2 = 0
bufferpoints = []
bufferline = []
bufferpose3D = []
id_list = []
obj_list = ["https://raw.githubusercontent.com/JdeRobot/assets/master/gazebo/models/f1/meshes/F1.dae"]
refresh1 = "nothing"
refresh2 = "nothing"
refresh3 = "nothing"




class ViewerI(jderobot.Visualization):
    def __init__(self):
        self.cont = 0
        self.posx = 0
        self.posy = 0
        self.posz = 0

    def getSegment(self, current=None):
        rgblinelist = jderobot.bufferSegments()
        rgblinelist.buffer = []
        rgblinelist.refresh = refresh1
        if refresh1 == "all":
            for i in id_list[:]:
                del id_list[id_list.index(i)]
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
        rgbpointlist.refresh = refresh2
        if refresh2 == "all":
            for i in id_list[:]:
                del id_list[id_list.index(i)]
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
            pose3d.x = 0
            pose3d.y = 0
            pose3d.z = 0
            pose3d.h = 0
            pose3d.q0 = -1
            pose3d.q1 = 1
            pose3d.q2 = 1
            pose3d.q3 = -1
            if refresh3 == "all" or refresh3 == "part":
                for i in id_list[:]:
                    del id_list[id_list.index(i)]
            obj3D.refresh = refresh3
            id_list.append(id)
            obj3D.id = id
            obj3D.format = form
            obj3D.pos = pose3d
            obj3D.scale = 5
            self.cont = self.cont + 1
            return obj3D

    def getPoseObj3DData(self, current=None):
        print id_list
        for i in bufferpose3D[:]:
            index = bufferpose3D.index(i)
            del bufferpose3D[index]
        for i in id_list[:]:
            pose3d = jderobot.Pose3DData()
            pose3d.x = self.posx
            pose3d.y = self.posy
            pose3d.z = self.posz
            pose3d.h = 1
            pose3d.q0 = -1
            pose3d.q1 = 1
            pose3d.q2 = 1
            pose3d.q3 =-1
            objpose3d = jderobot.PoseObj3D()
            objpose3d.id = id_list [id_list.index(i)]
            objpose3d.pos = pose3d
            bufferpose3D.append(objpose3d)
            self.posx = self.posx + 0.002
            self.posy = 0
            self.posz = 0
        print "Enviados movimientos para los modelos"
        return bufferpose3D

    def clearAll(self, current=None):
        print "Clear All"

def getbufferSegment ():
    global lptox1
    global lptox2
    global lptox3
    rgbsegment = jderobot.RGBSegment()
    color = jderobot.Color()
    color.r = uniform(0,1)
    color.g = uniform(0,1)
    color.b = uniform(0,1)
    rgbsegment.seg.fromPoint.z = 0
    rgbsegment.seg.toPoint.z = 0
    rgbsegment.seg.fromPoint.y = 2
    rgbsegment.seg.toPoint.y = 2
    rgbsegment.seg.fromPoint.x = lptox1
    rgbsegment.seg.toPoint.x = lptox1 + 1
    rgbsegment.c = color
    bufferline.append(rgbsegment)
    rgbsegment2 = jderobot.RGBSegment()
    color = jderobot.Color()
    color.r = uniform(0,1)
    color.g = uniform(0,1)
    color.b = uniform(0,1)
    rgbsegment2.seg.fromPoint.z = 0
    rgbsegment2.seg.toPoint.z = 0
    rgbsegment2.seg.fromPoint.y = -2
    rgbsegment2.seg.toPoint.y = -2
    rgbsegment2.seg.fromPoint.x = lptox2
    rgbsegment2.seg.toPoint.x = lptox2 + 1
    rgbsegment2.c = color
    bufferline.append(rgbsegment2)
    rgbsegment3 = jderobot.RGBSegment()
    color = jderobot.Color()
    color.r = uniform(0,1)
    color.g = uniform(0,1)
    color.b = uniform(0,1)
    rgbsegment3.seg.fromPoint.z = 0
    rgbsegment3.seg.toPoint.z = 0
    rgbsegment3.seg.fromPoint.y = 0
    rgbsegment3.seg.toPoint.y = 0
    rgbsegment3.seg.fromPoint.x = lptox3
    rgbsegment3.seg.toPoint.x = lptox3 + 1
    rgbsegment3.c = color
    bufferline.append(rgbsegment3)
    lptox1 = lptox1 + 1
    lptox2 = lptox2 + 1
    lptox3 = lptox3 + 2

def getbufferPoint():
    global pointx
    global pointx2
    rgbpoint = jderobot.RGBPoint()
    rgbpoint.x = pointx + 1
    rgbpoint.y = -2
    rgbpoint.z = 1
    rgbpoint.r = uniform(0,1)
    rgbpoint.g = uniform(0,1)
    rgbpoint.b = uniform(0,1)
    bufferpoints.append(rgbpoint)
    rgbpoint2 = jderobot.RGBPoint()
    rgbpoint2.x = pointx2 + 1
    rgbpoint2.y = 2
    rgbpoint2.z = 1
    rgbpoint2.r = uniform(0,1)
    rgbpoint2.g = uniform(0,1)
    rgbpoint2.b = uniform(0,1)
    bufferpoints.append(rgbpoint2)
    pointx= pointx + 1
    pointx2 = pointx2 + 1

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

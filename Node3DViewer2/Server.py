import sys, Ice
import jderobot
import time

class setPoint(jderobot.Visualization):
    def drawPoint(self, point, color, current=None):
        point.x = 15
        point.y = 20
        point.z = 15
        color.r = 125
        color.g = 204
        color.b = 78
        return point

try:
    # correct but suboptimal, see below
    communicator = Ice.initialize(sys.argv)
    adapter = communicator.createObjectAdapterWithEndpoints("SimplePrinterAdapter", "default -p 10000")
    object = setPoint()
    adapter.add(object, communicator.stringToIdentity("SimplePrinter"))
    adapter.activate()
    communicator.waitForShutdown()
except:
    traceback.print_exc()
    status = 1
    if communicator:
    # correct but suboptimal, see below
        communicator.destroy()

sys.exit(status)

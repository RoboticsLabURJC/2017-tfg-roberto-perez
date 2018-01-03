import sys, Ice
import jderobot
import time
import random
class PrinterI(jderobot.Visualization):
    def drawPoint(self, point, current=None):

        point.x = random.randint(-50, 50)
        point.y = random.randint(-50, 50)
        point.z = random.randint(-50, 50)
        point.r = random.uniform(0, 1)
        point.g = random.uniform(0, 1)
        point.b = random.uniform(0, 1)
        return point

try:
    # correct but suboptimal, see below
    communicator = Ice.initialize(sys.argv)
    adapter = communicator.createObjectAdapterWithEndpoints("SimplePrinterAdapter", "default -p 10000")
    object = PrinterI()
    adapter.add(object, communicator.stringToIdentity("SimplePrinter"))
    adapter.activate()
    print "Listening at port 10000"
    communicator.waitForShutdown()
except:
    traceback.print_exc()
    status = 1
    if communicator:
    # correct but suboptimal, see below
        communicator.destroy()

sys.exit(status)

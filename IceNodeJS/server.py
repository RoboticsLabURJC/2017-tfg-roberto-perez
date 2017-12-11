import sys, Ice
import Demo
import time

class PrinterI(Demo.Printer):
    def printString(self, s, current=None):
        print s

try:
    # correct but suboptimal, see below
    hora = time.strftime("%H:%M:%S")
    communicator = Ice.initialize(sys.argv)
    adapter = communicator.createObjectAdapterWithEndpoints("SimplePrinterAdapter", "default -p 10000")
    object = PrinterI()
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

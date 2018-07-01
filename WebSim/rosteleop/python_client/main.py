import rospy
import cameraRos
import motors
import sys, time
import numpy as np
from scipy.ndimage import filters


if __name__ == '__main__':
    try:
        motors.start()
        cameraRos.main(sys.argv)
    except rospy.ROSInterruptException:
        pass

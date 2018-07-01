import cv2
import rospy
import roslib
import main
from sensor_msgs.msg import CompressedImage

class image_feature:

    def __init__(self):
        self.subscriber = rospy.Subscriber("/camera/image/compressed", CompressedImage, self.callback,  queue_size = 1)

    def callback(self, ros_data):
        np_arr = np.fromstring(ros_data.data, np.uint8)
        image_np = cv2.imdecode(np_arr, cv2.CV_LOAD_IMAGE_COLOR)
        #image_np = cv2.imdecode(np_arr, cv2.IMREAD_COLOR) # OpenCV >= 3.0:

        #### Feature detectors using CV2 ####
        # "","Grid","Pyramid" +
        # "FAST","GFTT","HARRIS","MSER","ORB","SIFT","STAR","SURF"
        method = "GridFAST"
        feat_det = cv2.FeatureDetector_create(method)
        time1 = time.time()

        # convert np image to grayscale
        featPoints = feat_det.detect(
            cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY))
        time2 = time.time()
        for featpoint in featPoints:
            x,y = featpoint.pt
            cv2.circle(image_np,(int(x),int(y)), 3, (0,0,255), -1)

        cv2.imshow('cv_img', image_np)
        cv2.waitKey(2)
    def main(args):
        ic = image_feature()
        rospy.init_node('image_feature', anonymous=True)
        try:
            rospy.spin()
        except KeyboardInterrupt:
            print "Shutting down ROS Image feature detector module"
            cv2.destroyAllWindows()

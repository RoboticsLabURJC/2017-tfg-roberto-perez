import rospy
from geometry_msgs.msg import Twist

def cmdvel(speed,angle):

    tw = Twist()
    tw.linear.x = speed
    tw.linear.y = 0
    tw.linear.z = 0
    tw.angular.x = angle
    tw.angular.y = 0
    tw.angular.z = 0

    return tw

def start():
    pub = rospy.Publisher('motors/cmd_vel', Twist, queue_size=1)
    rospy.init_node('talker', anonymous=True)
    run = True
    while run:
        try:
            speed = input("Lineal velocity (m/s): ")
            angle = input("Angular velocity (rad/s): ")
            vel = cmdvel(speed, angle)
            pub.publish(vel)
            print "____________"
        except SyntaxError:
            break

if __name__ == '__main__':
    try:
        start()
    except rospy.ROSInterruptException:
        pass

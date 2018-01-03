module jderobot
{
struct RGBPoint{
    float x;
    float y;
    float z;
    float r;
    float g;
    float b;
};

struct Point{
    float x;
    float y;
    float z;
};

struct Segment{
    Point fromPoint;
    Point toPoint;
};


   struct Color{
	    float r;
	    float g;
	    float b;
	};


  /**
   * Interface to the Visualization interaction.
   */
	interface Visualization
	{
        RGBPoint drawPoint(RGBPoint point );
        void drawSegment(Segment seg, Color c);
        void drawPoint2(Point p, Color c);
        void clearAll();
	};
};

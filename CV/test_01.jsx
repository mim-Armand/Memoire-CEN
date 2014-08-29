    var segmentSizes = prompt('Segment sizes','1 2 3');  
      
    if (segmentSizes != null)  
    {  
      segments = segmentSizes.replace(/,/g, ' ').replace(/ +/g, ' ').split(' ');  
      total = 0;  
      for (i=0; i<segments.length; i++)  
      {  
        segments[i] = Number(segments[i]);  
        total += segments[i];  
      }  
      for (i=0; i<segments.length; i++)  
      {  
        segments[i] /= total;  
        segments[i] *= 2*Math.PI;  
      }  
      segments.reverse();  
      
      radius = 100;  
      
      center = app.activeDocument.activeView.centerPoint;  
      
      angle = 0;  
      for (i=0; i<segments.length; i++)  
      {  
        curves = createArc (radius, angle, angle + segments[i]);  
      
        npath = app.activeDocument.pathItems.add();  
        ptPoint = npath.pathPoints.add();  
        ptPoint.anchor = ptPoint.leftDirection = ptPoint.rightDirection = center;  
      
        for (c=0; c<curves.length; c++)  
        {  
          ptPoint = npath.pathPoints.add();  
          ptPoint.leftDirection = ptPoint.anchor = [center[0]+curves[c].x1,center[1]+curves[c].y1];  
          ptPoint.rightDirection = [center[0]+curves[c].x2,center[1]+curves[c].y2];  
          ptPoint = npath.pathPoints.add();  
          ptPoint.rightDirection = ptPoint.anchor = [center[0]+curves[c].x4,center[1]+curves[c].y4];  
          ptPoint.leftDirection = [center[0]+curves[c].x3,center[1]+curves[c].y3];  
        }  
        npath.closed = true;  
        color = new RGBColor();  
        color.red = 255*Math.random();  
        color.green = 255*Math.random();  
        color.blue = 255*Math.random();  
        npath.fillColor = color;  
        angle += segments[i];  
      }  
    }  
      
    //  Following code adapted from http://hansmuller-flex.blogspot.nl/2011/04/approximating-circular-arc-with-cubic.html  
    // [JW] According to Hans, his code cannot draw a single segment larger than one circle quarter. So he cleverly split it up into  
    // two separate routines; one that splits a curve larger than a full quadrant into at-max-quadrant-sized ones, the other that does  
    // the calculations for a single arc (guaranteed not to exceed a quadrant).  
    // I add the returned curve points together into a single path, and there *will* be some duplicate points. However, the  
    // book-keeping bit is a bigger pain than just leaving it as it is   
      
    /** 
     *  Return a array of objects that represent bezier curves which approximate the  
     *  circular arc centered at the origin, from startAngle to endAngle (radians) with  
     *  the specified radius. 
     *   
     *  Each bezier curve is an object with four points, where x1,y1 and  
     *  x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's  
     *  control points. 
     */  
    function createArc(radius, startAngle, endAngle)  
    {  
      var EPSILON = 0.00001;  // Roughly 1/1000th of a degree, see below  
      
      // normalize startAngle, endAngle to [-2PI, 2PI]  
      
      var twoPI = Math.PI * 2;  
      // Note: MOD does not work as I expected!  
    //  startAngle = startAngle % twoPI;  
    //  endAngle = endAngle % twoPI;  
      while (startAngle < -twoPI) startAngle += twoPI;  
      while (startAngle >  twoPI) startAngle -= twoPI;  
      while (endAngle < -twoPI) endAngle += twoPI;  
      while (endAngle >  twoPI) endAngle -= twoPI;  
      
      // Compute the sequence of arc curves, up to PI/2 at a time.  Total arc angle  
      // is less than 2PI.  
      
      var curves = [];  
      var piOverTwo = Math.PI / 2.0;  
      var sgn = (startAngle < endAngle) ? 1 : -1;  
      
      var a1 = startAngle;  
      for (var totalAngle = Math.min(twoPI, Math.abs(endAngle - startAngle)); totalAngle > EPSILON; )   
      {  
        var a2 = a1 + sgn * Math.min(totalAngle, piOverTwo);  
        curves.push(createSmallArc(radius, a1, a2));  
        totalAngle -= Math.abs(a2 - a1);  
        a1 = a2;  
      }  
      return curves;  
    }  
      
    /** 
     *  Cubic bezier approximation of a circular arc centered at the origin,  
     *  from (radians) a1 to a2, where a2-a1 < pi/2.  The arc's radius is r. 
     *  
     *  Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points 
     *  and x2,y2 and x3,y3 are the cubic bezier's control points. 
     *  
     *  This algorithm is based on the approach described in: 
     *  A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa,"  
     *  Information Technology and Control, 35(4), 2006 pp. 371-378. 
     */  
    function createSmallArc(r, a1, a2)  
    {  
      // Compute all four points for an arc that subtends the same total angle  
      // but is centered on the X-axis  
      
      var a = (a2 - a1) / 2.0; //   
      
      var x4 = r * Math.cos(a);  
      var y4 = r * Math.sin(a);  
      var x1 = x4;  
      var y1 = -y4;  
      
      // magic constant:  
      var k = 4*(Math.sqrt(2)-1)/3;  
      var f = k * Math.tan(a);  
      
      var x2 = x1 + f * y4;  
      var y2 = y1 + f * x4;  
      var x3 = x2;   
      var y3 = -y2;  
      
      // Find the arc points actual locations by computing x1,y1 and x4,y4   
      // and rotating the control points by a + a1  
      
      var ar = a + a1;  
      var cos_ar = Math.cos(ar);  
      var sin_ar = Math.sin(ar);  
      
      return {  
        x1: r * Math.cos(a1),   
          y1: r * Math.sin(a1),   
          x2: x2 * cos_ar - y2 * sin_ar,   
          y2: x2 * sin_ar + y2 * cos_ar,   
          x3: x3 * cos_ar - y3 * sin_ar,   
          y3: x3 * sin_ar + y3 * cos_ar,   
          x4: r * Math.cos(a2),   
          y4: r * Math.sin(a2)  
        };  
    }  
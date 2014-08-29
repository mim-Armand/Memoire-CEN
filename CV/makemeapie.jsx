//DESCRIPTION:A Pie For Every Day
// A Jongware Script 02-Oct-2012

swatchGroupList = [ "Black & White", "Grayscale", "Color wheel" ];
if (parseInt(app.version) >= 14)
{
	swatchGroupList.push ("-");
	for (s=0; s<app.activeDocument.swatchGroups.length; s++)
	{
		if (app.activeDocument.swatchGroups[s].name == '')
			swatchGroupList.push ("[Base swatches]");
		else
			swatchGroupList.push ("["+app.activeDocument.swatchGroups[s].name+"]");
	}
}

var w = new Window("dialog", "Pie Day");
w.add ("statictext", undefined, "Values (comma or space separated)");
var textfield = w.add ("edittext", [0, 0, 240, 100], "", {multiline: true});
textfield.text = "1 2 3 4 3 2";
textfield.active = true;

with (w.add("group"))
{
  with (w.add("group"))
  {
    add ("statictext", undefined, "Inner radius (%)");
    var inner_ed = add ("edittext", undefined, 50);
    inner_ed.characters = 4;
    var slider = add ("slider", undefined, 50, 0, 100);
    slider.onChanging = function () {inner_ed.text = slider.value;};
    inner_ed.onChange = function () {slider.value = parseInt(inner_ed.text);};
  }
}

with (w.add('group'))
{
	orientation = 'row';
	add('statictext', undefined, "Swatches");
	optionsDdL = add('dropdownlist', undefined, swatchGroupList);
	optionsDdL.selection = 2;
}

with (w.add("group"))
{
  orientation = "row";
  add ("button", undefined, "OK");
  add ("button", undefined, "Cancel");
}
text = w.add ("statictext", undefined, "A  J O N G W A RE  S C R I P T  2 - O C T - 2 0 1 2");
text.graphics.font = ScriptUI.newFont ('dialog','BOLD',text.graphics.font.size-4);

if (w.show()==1)
{
// var segmentSizes = prompt('Segment sizes','1 2 3');

	swatchSelection = optionsDdL.selection.index;
 
  segmentSizes = textfield.text; 
  if (segmentSizes != null)
  {
    segments = segmentSizes.replace(/[,;\r\n\t ]+/g, ' ').split(' ');
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
  //  segments.reverse();

    outerradius = 100;
    innerradius = parseInt(inner_ed.text);

    center = app.activeDocument.activeView.centerPoint;
    groupObject = app.activeDocument.groupItems.add();
    angle = 0;
	black = new GrayColor;
	black.gray = 100;
	white = new GrayColor;
	white.gray = 0;

	if (swatchSelection > 2)
	{
		if (swatchSelection == 4)
			allSwatches = app.activeDocument.swatches;
		else
			allSwatches = app.activeDocument.swatchGroups[swatchSelection-4].getAllSwatches();
	}

    for (i=0; i<segments.length; i++)
    {
      curves = createArc (outerradius, angle, angle + segments[i]);

      npath = groupObject.pathItems.add();
  //    ptPoint = npath.pathPoints.add();
  //    ptPoint.anchor = ptPoint.leftDirection = ptPoint.rightDirection = center;

      for (c=0; c<curves.length; c++)
      {
        ptPoint = npath.pathPoints.add();
        ptPoint.leftDirection = ptPoint.anchor = [center[0]+curves[c].y1,center[1]+curves[c].x1];
        ptPoint.rightDirection = [center[0]+curves[c].y2,center[1]+curves[c].x2];
        ptPoint = npath.pathPoints.add();
        ptPoint.rightDirection = ptPoint.anchor = [center[0]+curves[c].y4,center[1]+curves[c].x4];
        ptPoint.leftDirection = [center[0]+curves[c].y3,center[1]+curves[c].x3];
      }

      if (innerradius < 100)
      {
        if (innerradius > 0)
        {
          curves = createArc (innerradius, angle + segments[i], angle);
          for (c=0; c<curves.length; c++)
          {
            ptPoint = npath.pathPoints.add();
            ptPoint.leftDirection = ptPoint.anchor = [center[0]+curves[c].y1,center[1]+curves[c].x1];
            ptPoint.rightDirection = [center[0]+curves[c].y2,center[1]+curves[c].x2];
            ptPoint = npath.pathPoints.add();
            ptPoint.rightDirection = ptPoint.anchor = [center[0]+curves[c].y4,center[1]+curves[c].x4];
            ptPoint.leftDirection = [center[0]+curves[c].y3,center[1]+curves[c].x3];
          }
        } else
        {
          ptPoint = npath.pathPoints.add(  );
          ptPoint.anchor = ptPoint.leftDirection = ptPoint.rightDirection = center;
        }

        npath.closed = true;
        npath.strokeColor = NoColor;

        switch (swatchSelection)
        {
          case 0: // black and white
            npath.strokeColor = black;
            npath.fillColor = white;
            break;
          case 1: // gray
          	gray = new GrayColor;
          	gray.gray = 100*i/(segments.length-1);
          	npath.fillColor = gray;
            break;
          case 2: // bright
	        npath.fillColor = HsbToRgb((angle+segments[i]/2)/(2*Math.PI), 1, 1);
	        break;
	      case 4: // base swatches
	        npath.fillColor = allSwatches[(i % (allSwatches.length-4))+4].color;
	        break;
          default:
          	if (i && (i % allSwatches.length) == 0)
            	npath.fillColor = allSwatches[(i+1) % allSwatches.length].color;
          	else
            	npath.fillColor = allSwatches[i % allSwatches.length].color;
        }
      } else
      {
        npath.fillColor = NoColor;
        npath.strokeColor = HsbToRgb((angle+segments[i]/2)/(2*Math.PI), 1, 1);
      }
      angle += segments[i];
    }
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
  // Note 2: uh, enabling this causes numeric instability ...
//  startAngle = startAngle % twoPI;
//  endAngle = endAngle % twoPI;
/*  while (startAngle < -twoPI) startAngle += twoPI;
  while (startAngle >  twoPI) startAngle -= twoPI;
  while (endAngle < -twoPI) endAngle += twoPI;
  while (endAngle >  twoPI) endAngle -= twoPI; */
 
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
 *  A. Rickus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," 
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

// from koders.com (modified):

function HsbToRgb(hue, saturation, brightness)
{
  var red   = 0;
   var green = 0;
   var blue  = 0;
    if (saturation == 0)
    {
       red = parseInt(brightness * 255.0 + 0.5);
      green = red;
      blue = red;
   } else
   {
      var h = (hue - Math.floor(hue)) * 6.0;
       var f = h - Math.floor(h);
       var p = brightness * (1.0 - saturation);
       var q = brightness * (1.0 - saturation * f);
       var t = brightness * (1.0 - (saturation * (1.0 - f)));
       switch (parseInt(h))
       {
          case 0:
             red   = (brightness * 255.0 + 0.5);
             green = (t * 255.0 + 0.5);
             blue  = (p * 255.0 + 0.5);
             break;
          case 1:
             red   = (q * 255.0 + 0.5);
             green = (brightness * 255.0 + 0.5);
             blue  = (p * 255.0 + 0.5);
             break;
          case 2:
             red   = (p * 255.0 + 0.5);
             green = (brightness * 255.0 + 0.5);
             blue  = (t * 255.0 + 0.5);
             break;
          case 3:
             red   = (p * 255.0 + 0.5);
             green = (q * 255.0 + 0.5);
             blue  = (brightness * 255.0 + 0.5);
             break;
          case 4:
             red   = (t * 255.0 + 0.5);
             green = (p * 255.0 + 0.5);
             blue  = (brightness * 255.0 + 0.5);
             break;
           case 5:
             red   = (brightness * 255.0 + 0.5);
             green = (p * 255.0 + 0.5);
             blue  = (q * 255.0 + 0.5);
             break;
       }
   }
   var color = new RGBColor ();
   color.red = red >> 0;
    color.green = green >> 0;
    color.blue = blue >> 0;
    return color;
}
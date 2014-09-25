void render( float wiggle_fg, float wiggle_bg ) {
  if (wiggle_fg != 0) {
    fg_rx = random(-wiggle_fg, wiggle_fg);
    fg_ry = random(-wiggle_fg, wiggle_fg);
  };
  if (wiggle_bg != 0) {
    bg_rx = random(-wiggle_bg, wiggle_bg);
    bg_ry = random(-wiggle_bg, wiggle_bg);
  };

  image(bg1, wc + bg_rx, hc + bg_ry);
  image(fg1, wc + fg_rx, hc + fg_ry);
  if (showHud) {
    drawHud();
    image(hud, wc, hc);
  }
  if (console) {
    println(timeTxt);
    println(round(frameRate) + " fps.");
  }
  if(showMous){
    drawMouse();
    image(mouseLayer,wc,hc);
  }
}

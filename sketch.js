var audioContext = new AudioContext();

//270 degrees is bc teeth are offset by quater right turn i.e. 90 degrees
//therefore, 12 o clock is at 270 rather than zero
let toothAngle = 270;
let BPM = 120;
let bpmFontFill = [230, 237, 233];
let rotNum1;
let rotNum2;
let lcm = 16;
let bpmSliderXpos = 5 + 1080; //RWRD
let bpmSliderYpos = 10; //RWRD
let timeUnit = ((60/120)/4);
let ttlPatternTime = lcm * timeUnit;
let stepRatio = 1;

//allows to work with PizzaFace as if its center was at (0,0)
let canvasOffset = 600; //RWRD

///////////////// TALE OF TWO CLOCKS VARS
let startTime = audioContext.currentTime + 0.005;
var scheduleAheadTime = 0.1;
var nextNoteTime = 0.0;

///////////////////////////////////////////////////////////////////// SET UP FUNCTION

//may or may not be working right now...
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function setup() {
  console.log(windowWidth);
  console.log(windowHeight);
  createCanvas(windowWidth, windowHeight);
  // createCanvas(1220, 680); 
  angleMode(DEGREES);

  bpmSlider = createSlider(20, 300, 120);
  bpmSliderXpos = .87 * windowWidth;
  bpmSliderYpos = .02 * windowHeight;
  // bpmSlider.position(bpmSliderXpos, bpmSliderYpos);
  bpmSlider.position(bpmSliderXpos, bpmSliderYpos);
  // console.log(bpmSliderYpos);
  bpmSlider.style('width', '100px');
  bpmSlider.mouseReleased(sketchUpdateBPM);

  // greeting = loadSound(
  // '/Users/tylerbisson/Desktop/Thesis\ Project/Grooove-Pizzaria/sounds/groovepizzaria.wav', loaded);
  testPizza = new PizzaFace((-0.23 * windowWidth), (-0.35 * windowHeight), 16, 16, [29, 135, 36]);
  testPizza2 = new PizzaFace((0.25 * windowWidth), (-0.35 * windowHeight), 16, 16, [206, 94, 28]); 
  // testPizza = new PizzaFace(-290, -250, 16, 16, [29, 135, 36]); //RWRD
  // testPizza2 = new PizzaFace(310 , -250, 16, 16, [206, 94, 28]); //RWRD

  testPizza.sliceSlider.mousePressed(returnToRotationZero1);
  testPizza2.sliceSlider.mousePressed(returnToRotationZero2);

  testPizza.sliceSlider.mouseReleased(syncAndTeethTest1);
  testPizza2.sliceSlider.mouseReleased(syncAndTeethTest2);

  testPizza.toothSlider.input(syncAndTeethTest1);
  testPizza2.toothSlider.input(syncAndTeethTest2);

  testPizza.rotateSlider.input(rotateShapes1);
  testPizza2.rotateSlider.input(rotateShapes2);

  let schedulerCaller = setInterval(scheduler, 25);
}

///////////////////////////////////////////////////////////////////// INITIAL LOAD & PLAY AUDIO FUNCTION

function loaded() {
  greeting.play();
}

function returnToRotationZero1() {
  rotNum1 = 0;
  testPizza.rotateShapes(rotNum1);
  testPizza.rotateSlider.value(0);
}

function returnToRotationZero2(){
  rotNum2 = 0;
  testPizza2.rotateShapes(rotNum2);
  testPizza2.rotateSlider.value(0);
}

function syncAndTeethTest1(){
  testPizza.numTeeth = testPizza.toothSlider.value();
  testPizza.nextNoteTime = testPizza2.nextNoteTime;
  testPizza.teethTest();
  testPizza.rotateSlider.elt.max = testPizza.sliceSlider.value();
  lcm = lcm_two_numbers(testPizza.numTeeth, testPizza2.numTeeth);
  testPizza.tmlnPlyHdArrX = [];
  testPizza.tmlnPlyHdArrY = [];
  testPizza2.tmlnPlyHdArrX = [];
  testPizza2.tmlnPlyHdArry = [];
  testPizza.tmlnItrtr = 0;
  testPizza2.tmlnItrtr = 0;
}

function syncAndTeethTest2(){
  testPizza2.numTeeth = testPizza2.toothSlider.value();
  testPizza2.nextNoteTime = testPizza.nextNoteTime;
  testPizza2.teethTest();
  testPizza2.rotateSlider.elt.max = testPizza2.sliceSlider.value();
  lcm = lcm_two_numbers(testPizza.numTeeth, testPizza2.numTeeth);
  testPizza.tmlnPlyHdArrX = [];
  testPizza.tmlnPlyHdArrY = [];
  testPizza2.tmlnPlyHdArrX = [];
  testPizza2.tmlnPlyHdArry = [];
  testPizza.tmlnItrtr = 0;
  testPizza2.tmlnItrtr = 0;
}

function rotateShapes1(){
  rotNum1 = testPizza.rotateSlider.value();
  testPizza.rotateShapes(rotNum1);
}

function rotateShapes2(){
  rotNum2 = testPizza2.rotateSlider.value();
  testPizza2.rotateShapes(rotNum2);
}

///////////////////////////////////////////////////////////////////// SET BPM FUNCTION

function sketchUpdateBPM() {
  if (testPizza.secondsPerStep < testPizza2.secondsPerStep) {
      testPizza.nextNoteTime = testPizza2.nextNoteTime;
  }
  else {
    testPizza2.nextNoteTime = testPizza.nextNoteTime;
  }

  BPM = bpmSlider.value();

  testPizza.stepIteratorVar = 0;
  testPizza2.stepIteratorVar = 0;

  testPizza.tmlnPlyHdArrX = [];
  testPizza.tmlnPlyHdArrY = [];
  testPizza2.tmlnPlyHdArrX = [];
  testPizza2.tmlnPlyHdArry = [];
  testPizza.tmlnItrtr = 0;
  testPizza2.tmlnItrtr = 0;
}

///////////////////////////////////////////////////////////////////// MOUSE DRAGGED FUNCTION

function mouseDragged() {
    testPizza.dragged(mouseX, mouseY);
    testPizza2.dragged(mouseX, mouseY);
}

///////////////////////////////////////////////////////////////////// MOUSE PRESSED FUNCTION

function mousePressed() {
    testPizza.pressed(mouseX, mouseY);
    testPizza2.pressed(mouseX, mouseY);
}

///////////////////////////////////////////////////////////////////// SCHEDULER FUNCTION

function scheduler() {
  var currentTime = audioContext.currentTime;
  currentTime -= startTime;

    while (testPizza.nextNoteTime < (currentTime + scheduleAheadTime)) {
          testPizza.incrementSoundLaunch(testPizza.nextNoteTime, 1, 2, 3);
          testPizza.nextNote();
        }

    while  (testPizza2.nextNoteTime < (currentTime + scheduleAheadTime)) {
           testPizza2.incrementSoundLaunch(testPizza2.nextNoteTime, 4, 5, 6);
           testPizza2.nextNote();
        }
}
///////////////////////////////////////////////////////////////////// LCM FUNCTION

function lcm_two_numbers(x, y) {
   if ((typeof x !== 'number') || (typeof y !== 'number'))
    return false;
  return (!x || !y) ? 0 : Math.abs((x * y) / gcd_two_numbers(x, y));
}

function gcd_two_numbers(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while(y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

///////////////////////////////////////////////////////////////////// DRAW FUNCTION

function draw() {
  // console.log(windowWidth)
  background(230, 237, 233); 
  // translate(600, 600); //RWRD
  translate((0.48 * windowWidth), (0.48 * windowWidth));

  timeUnit = ((60/bpmSlider.value())/4);
  testPizza.loopTime = timeUnit * testPizza.toothSlider.value();
  testPizza.stepTime = testPizza.loopTime / testPizza.sliceSlider.value();
  testPizza.stepFrac = (timeUnit * 16) / testPizza.stepTime;

  testPizza2.loopTime = timeUnit * testPizza2.toothSlider.value();
  testPizza2.stepTime = testPizza2.loopTime / testPizza2.sliceSlider.value();
  testPizza2.stepFrac = (timeUnit * 16) / testPizza2.stepTime;

  stepRatio = testPizza2.stepFrac.toFixed(3) / testPizza.stepFrac.toFixed(3);
  stepRatio2 = testPizza.stepFrac.toFixed(3) / testPizza2.stepFrac.toFixed(3);


  ttlPatternTime = lcm * timeUnit;

  testPizza.syncSpoke(testPizza.stepIteratorVar, testPizza2.stepIteratorVar);
  testPizza2.syncSpoke(testPizza.stepIteratorVar, testPizza2.stepIteratorVar);

  testPizza.showFace(testPizza.testDiam);
  testPizza.showSpokes(testPizza.sliceSlider.value());
  testPizza.showShapes();
  testPizza.showTeeth(testPizza.toothSlider.value());
  testPizza.showPlayHead();

  testPizza2.showFace(testPizza2.testDiam);
  testPizza2.showSpokes(testPizza2.sliceSlider.value());
  testPizza2.showShapes();
  testPizza2.showTeeth(testPizza2.toothSlider.value());
  testPizza2.showPlayHead();

  testPizza.showTimeline((-0.84 * windowHeight), lcm);
  testPizza2.showTimeline((-0.79 * windowHeight), lcm);
  // testPizza.showTimeline(-588, lcm); //RWRD
  // testPizza2.showTimeline(-558, lcm); //RWRD
  testPizza.showTotalSteps(lcm, ttlPatternTime);

  testPizza.timeLineCounter(testPizza.tmlnItrtr);
  testPizza2.timeLineCounter(testPizza2.tmlnItrtr);

  stroke(200);
  textSize(32);
  fill(bpmFontFill);
  strokeWeight(10);
  text(bpmSlider.value() + " bpm", bpmSliderXpos - 600, bpmSliderYpos - 555); //RWRD

  strokeWeight(0);
  fill(testPizza.color[0], testPizza.color[1], testPizza.color[2], 90); 
  // x pos of slider - 600 + width + 10; y pos of slider + 11
  text(testPizza.sliceSlider.value(),
    testPizza.slidersXPos - 600 - 40, testPizza.sliceSliderYPos - 600 - 6); //RWRD
  textSize(16);
  text("steps (1/" + testPizza.stepFrac.toFixed(3) + " note)",
    testPizza.slidersXPos - 600, testPizza.sliceSliderYPos - 600 - 8); //RWRD
  textSize(32);
  text(testPizza.toothSlider.value(),
    testPizza.slidersXPos - 600 - 40, testPizza.toothSliderYPos - 600 - 6); //RWRD
  textSize(19);
  text("÷",
    testPizza.slidersXPos - 600 - 36, testPizza.toothSliderYPos - 600 + 9); //RWRD
  textSize(16);
  text("time units (" + timeUnit.toFixed(3) + " s)",
    testPizza.slidersXPos - 600, testPizza.toothSliderYPos - 600 - 8); //RWRD

  strokeWeight(0);
  textSize(32);
  text(testPizza.rotateSlider.value(),
    testPizza.rotateSliderXPos - 600 - 40, testPizza.rotateSliderYPos - 600 - 6); //RWRD
  textSize(16);
  text("step rotations",
    testPizza.rotateSliderXPos - 600, testPizza.rotateSliderYPos - 600 - 8); //RWRD

  textSize(16);
	strokeWeight(0);
  text("step ",
    testPizza.rotateSliderXPos - 835, testPizza.rotateSliderYPos - 600); //RWRD

  fill(200);
  text("= " + stepRatio.toFixed(3) + " x",
    testPizza.rotateSliderXPos - 800, testPizza.rotateSliderYPos - 600); //RWRD

  fill(testPizza2.color[0], testPizza2.color[1], testPizza2.color[2], 90);
  text("step ",
    testPizza.rotateSliderXPos - 730, testPizza.rotateSliderYPos - 600); //RWRD


  textSize(32);
  fill(testPizza2.color[0], testPizza2.color[1], testPizza2.color[2], 90);
  // x pos of slider - 600 + width + 10; y pos of slider + 11
  text(testPizza2.sliceSlider.value(),
    testPizza2.slidersXPos - 600 - 40, testPizza2.sliceSliderYPos - 600 - 6); //RWRD
  textSize(16);
  text("steps (1/" + testPizza2.stepFrac.toFixed(3) + " note)",
    testPizza2.slidersXPos - 600, testPizza2.sliceSliderYPos - 600 - 8); //RWRD
  textSize(32);
  text(testPizza2.toothSlider.value(),
    testPizza2.slidersXPos - 600 - 40, testPizza2.toothSliderYPos - 600 - 6); //RWRD
  textSize(19);
  text("÷",
    testPizza2.slidersXPos - 600 - 36, testPizza2.toothSliderYPos - 600 + 9); //RWRD
  textSize(16);
  text("time units (" + timeUnit.toFixed(3) + " s)",
    testPizza2.slidersXPos - 600, testPizza2.toothSliderYPos - 600 - 8); //RWRD

  textSize(32);
  text(testPizza2.rotateSlider.value(), 
    testPizza2.rotateSliderXPos - 600 - 40, testPizza2.rotateSliderYPos - 600 - 6); //RWRD
  textSize(16);
  text("step rotations",
    testPizza2.rotateSliderXPos - 600, testPizza2.rotateSliderYPos - 600 - 8); //RWRD
 
	textSize(16);
	strokeWeight(0);
  text("step ",
    testPizza2.rotateSliderXPos - 835, testPizza2.rotateSliderYPos - 600); //RWRD

  fill(200);
  text("= " + stepRatio2.toFixed(3) + " x",
    testPizza2.rotateSliderXPos - 800, testPizza2.rotateSliderYPos - 600); //RWRD

  fill(testPizza.color[0], testPizza.color[1], testPizza.color[2], 90);
  text("step ",
    testPizza2.rotateSliderXPos - 730, testPizza2.rotateSliderYPos - 600); //RWRD

}

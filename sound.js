///////////////////////////////////////////////////////////////////// AUDIO BUFFER SETUP
let buffers = [];
let midiOutput;
let isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
console.log("this browser is chrome: " + isChrome);

WebMidi.enable(function (err) {
  // console.log(WebMidi.inputs);
  // console.log(WebMidi.outputs);
  midiOutput = WebMidi.outputs[0];
});

function setupSounds(){
  let samplePaths = ['sounds/hihat.wav', 'sounds/clap.wav', 'sounds/snare.wav', 
  'sounds/low.wav', 'sounds/mid.wav', 'sounds/hi.wav', 'sounds/wood1.wav', 
    'sounds/wood2.wav', 'sounds/Wood_Block_High.wav', 'sounds/burp.wav',
    'sounds/noise.wav', 'sounds/crunch.wav'];

  buffers = [];
  
  samplePaths.forEach((path, i) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', path);
    xhr.responseType = 'arraybuffer'; // directly as an ArrayBuffer
    xhr.send();

    xhr.onload = function () {
      var audioData = xhr.response;
      audioContext.decodeAudioData(audioData, function (buffer) {
        buffers[i] = buffer;
      },
        function (e) { console.log('Error with decoding audio data 1' + e.err); });
    };
  });
}

  function playDrum(noteTime, sampleNum) {
    var source = audioContext.createBufferSource();

    switch(sampleNum){
      case(1):
        source.buffer = buffers[0];
        if (isChrome) { midiOutput.playNote("C3", "all", {duration: 1000}) };
        break;
      case(2):
        source.buffer = buffers[1];
        if (isChrome) { midiOutput.playNote("D3", "all", {duration: 1000}) };
        break;
      case(3):
        source.buffer = buffers[2];
        if (isChrome) { midiOutput.playNote("E3", "all", {duration: 1000}) };
        break;
      case(4):
        source.buffer = buffers[3];
        if (isChrome) { midiOutput.playNote("F3", "all", {duration: 1000}) };
        break;
      case(5):
        source.buffer = buffers[4];
        if (isChrome) { midiOutput.playNote("G3", "all", {duration: 1000}) };
        break;
      case(6):
        source.buffer = buffers[5];
        if (isChrome) { midiOutput.playNote("A4", "all", {duration: 1000}) };
        break;      
      case(7):
        source.buffer = buffers[6];
        if (isChrome) { midiOutput.playNote("B4", "all", {duration: 1000}) };
        break;
      case(8):
        source.buffer = buffers[7];
        if (isChrome) { midiOutput.playNote("C4", "all", {duration: 1000}) };
        break;
      case(9):
        source.buffer = buffers[8];
        if (isChrome) { midiOutput.playNote("D4", "all", {duration: 1000}) };
        break;      
      case(10):
        source.buffer = buffers[9];
        if (isChrome) { midiOutput.playNote("E4", "all", {duration: 1000}) };
        break;
      case(11):
        source.buffer = buffers[10];
        if (isChrome) { midiOutput.playNote("F4", "all", {duration: 1000}) };
        break;
      case(12):
        source.buffer = buffers[11];
        if (isChrome) { midiOutput.playNote("G4", "all", {duration: 1000}) };
        break;      
    }
    source.connect(audioContext.destination);
    source.start(noteTime);
  }

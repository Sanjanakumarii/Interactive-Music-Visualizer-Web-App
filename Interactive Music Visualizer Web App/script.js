const audioFile = document.getElementById('audio-file');
const audio = document.getElementById('audio');
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

let audioContext, analyser, source, dataArray, bufferLength;

audioFile.addEventListener('change', function() {
  const files = this.files;
  if (files.length === 0) return;

  const file = URL.createObjectURL(files[0]);
  audio.src = file;
  audio.play();

  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(audio);
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    draw();
  }
});

function draw() {
  requestAnimationFrame(draw);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  analyser.getByteFrequencyData(dataArray);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let x = 0;

  for(let i = 0; i < bufferLength; i++) {
    const barHeight = dataArray[i];
    const r = barHeight + (25 * (i/bufferLength));
    const g = 250 * (i/bufferLength);
    const b = 50;

    ctx.fillStyle = `rgb(${r},${g},${b})`;
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

// Resize canvas dynamically
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = 300;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

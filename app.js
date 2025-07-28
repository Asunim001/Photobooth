const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const frameImg = document.getElementById('frame');
const previewImage = document.getElementById('previewImage');
const startBtn = document.getElementById('start');
const retryBtn = document.getElementById('retry');
const downloadBtn = document.getElementById('download');
const printBtn = document.getElementById('print');
const countdown = document.getElementById('countdown');
const emailInput = document.getElementById('email');

let retryCount = 0;
let capturedImages = [];

// Set 15x6 cm at 100dpi = 1500x600 px
const WIDTH = 886;  // 15 cm
const HEIGHT = 354; // 6 cm

canvas.width = WIDTH;
canvas.height = HEIGHT;

// Load camera
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

// Countdown timer
function startCountdown(seconds) {
  return new Promise((resolve) => {
    countdown.style.display = 'block';
    let count = seconds;
    countdown.textContent = count;
    const interval = setInterval(() => {
      count--;
      countdown.textContent = count;
      if (count === 0) {
        clearInterval(interval);
        countdown.style.display = 'none';
        resolve();
      }
    }, 1000);
  });
}

// Capture a pose
async function capturePose() {
  await startCountdown(5);
  const snapshot = document.createElement('canvas');
  snapshot.width = 500;
  snapshot.height = 600;

  const ctx = snapshot.getContext('2d');
  ctx.drawImage(video, 0, 0, 500, 600);
  return snapshot;
}

// Handle photo session
startBtn.addEventListener('click', async () => {
  capturedImages = [];
  for (let i = 0; i < 3; i++) {
    const pose = await capturePose();
    capturedImages.push(pose);
  }

  drawToFinalCanvas();
  retryBtn.disabled = false;
  downloadBtn.disabled = false;
  printBtn.disabled = false;
});

retryBtn.addEventListener('click', () => {
  if (retryCount < 2) {
    retryCount++;
    startBtn.click();
  } else {
    retryBtn.disabled = true;
  }
});

// Draw final image
function drawToFinalCanvas() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (let i = 0; i < capturedImages.length; i++) {
    ctx.drawImage(capturedImages[i], i * 500, 0, 500, 600);
  }

  const frame = new Image();
  frame.src = frameImg.src;
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, canvasWidth, canvasHeight);
    const dataURL = canvas.toDataURL('image/png');
    previewImage.src = dataURL;
  };
}

// Download button
downloadBtn.addEventListener('click', () => {
  if (emailInput.value.trim() === "") {
    alert("Masukkan email terlebih dahulu.");
    return;
  }

  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = `photobooth-${Date.now()}.png`;
  a.click();

  // Simulasi integrasi email
  alert(`File akan dikirim ke email: ${emailInput.value}`);
});

// Print button
printBtn.addEventListener('click', () => {
  const win = window.open('', '_blank');
  win.document.write(`
    <html><head><title>Cetak Foto</title></head>
    <body style="margin:0;text-align:center">
      <img src="${canvas.toDataURL('image/png')}" style="width:100%"/>
      <script>
        window.onload = () => {
          window.print();
          window.onafterprint = () => window.close();
        }
      </script>
    </body></html>
  `);
});

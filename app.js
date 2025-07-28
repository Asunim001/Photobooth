const canvas = document.getElementById('canvas');
const frameImg = document.getElementById('frame');
const previewImage = document.getElementById('previewImage');
const frameSelector = document.getElementById('frameSelector');
const captureBtn = document.getElementById('capture');
const startBtn = document.getElementById('start');
const retryBtn = document.getElementById('retry');
const downloadBtn = document.getElementById('download');
const printBtn = document.getElementById('print');
const countdown = document.getElementById('countdown');
const emailInput = document.getElementById('email');

// Countdown timer element
const countdown = document.createElement('div');
countdown.id = 'countdown';
document.querySelector('.camera').appendChild(countdown);
let retryCount = 0;
let capturedImages = [];

// Inisialisasi tombol
printBtn.style.display = 'none';
downloadBtn.style.display = 'none';
// Set 15x6 cm at 100dpi = 1500x600 px
const canvasWidth = 600;
const canvasHeight = 1500;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

// Load camera
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

// Load frames
for (let i = 1; i <= 10; i++) {
  const option = document.createElement('option');
  option.value = `frames/frame${i}.png`;
  option.textContent = `Frame ${i}`;
  frameSelector.appendChild(option);
}

// Default frame
frameSelector.value = 'frames/frame1.png';
frameImg.src = frameSelector.value;

frameSelector.addEventListener('change', () => {
  frameImg.src = frameSelector.value;
});

// Countdown sebelum ambil gambar
captureBtn.addEventListener('click', async () => {
  await startCountdown(3);
  capturePhoto();
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
        countdown.textContent = '';
        countdown.style.display = 'none';
        clearInterval(interval);
        countdown.style.display = 'none';
        resolve();
      } else {
        countdown.textContent = count;
      }
    }, 1000);
  });
}

function capturePhoto() {
  const frame = new Image();
  frame.src = frameImg.src;
// Capture a pose
async function capturePose() {
  await startCountdown(5);
  const snapshot = document.createElement('canvas');
  snapshot.width = 500;
  snapshot.height = 600;

  frame.onload = () => {
    // Ukuran 5x16 cm @ 300 DPI
    const width = 590;
    const height = 1890;
  const ctx = snapshot.getContext('2d');
  ctx.drawImage(video, 0, 0, 500, 600);
  return snapshot;
}

    canvas.width = width;
    canvas.height = height;
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

    const ctx = canvas.getContext('2d');
retryBtn.addEventListener('click', () => {
  if (retryCount < 2) {
    retryCount++;
    startBtn.click();
  } else {
    retryBtn.disabled = true;
  }
});

    // Gambar dari video ke canvas (posisi dan skala sesuai kebutuhan layout pose)
    ctx.drawImage(video, 0, 0, width, height); // ← ini bisa disesuaikan lagi nanti
// Draw final image
function drawToFinalCanvas() {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Tambahkan frame
    ctx.drawImage(frame, 0, 0, width, height);
  for (let i = 0; i < capturedImages.length; i++) {
    ctx.drawImage(capturedImages[i], i * 500, 0, 500, 600);
  }

    // Tampilkan di preview
  const frame = new Image();
  frame.src = frameImg.src;
  frame.onload = () => {
    ctx.drawImage(frame, 0, 0, canvasWidth, canvasHeight);
    const dataURL = canvas.toDataURL('image/png');
    previewImage.src = dataURL;

    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'photobooth-anteiku.png';
      a.click();
    };

    // Tombol cetak
    const printBtn = document.getElementById('print');
    printBtn.onclick = () => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Photobooth</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                text-align: center;
              }
              img {
                width: 5cm;
                height: 16cm;
              }
            </style>
          </head>
          <body>
            <img src="${dataURL}" />
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    };
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

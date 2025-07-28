const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const frameImg = document.getElementById('frame');
const previewImage = document.getElementById('previewImage');
const frameSelector = document.getElementById('frameSelector');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');
const printBtn = document.getElementById('print');
const countdown = document.createElement('div');
const repeatBtn = document.getElementById('repeat');

let repeatCount = 0;
let capturedImages = [];

countdown.id = 'countdown';
document.querySelector('.camera').appendChild(countdown);

// Konversi cm ke piksel
const cmToPx = (cm) => Math.round((cm / 2.54) * 150);
const WIDTH = cmToPx(15);  // 15 cm
const HEIGHT = cmToPx(6);  // 6 cm

// Load kamera
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

// Load frame ke dropdown
for (let i = 1; i <= 10; i++) {
  const option = document.createElement('option');
  option.value = `frames/frame${i}.png`;
  option.textContent = `Frame ${i}`;
  frameSelector.appendChild(option);
}
frameSelector.value = 'frames/frame1.png';

// Ganti frame
frameSelector.addEventListener('change', () => {
  frameImg.src = frameSelector.value;
});

// Countdown 5 detik
function startCountdown(seconds) {
  return new Promise((resolve) => {
    countdown.style.display = 'block';
    let count = seconds;
    countdown.textContent = count;
    const interval = setInterval(() => {
      count--;
      if (count === 0) {
        countdown.textContent = '';
        countdown.style.display = 'none';
        clearInterval(interval);
        resolve();
      } else {
        countdown.textContent = count;
      }
    }, 1000);
  });
}

// Tangkap 3 pose dan gabungkan
captureBtn.addEventListener('click', async () => {
  capturedImages = [];
  repeatCount = 0;
  for (let i = 0; i < 3; i++) {
    await startCountdown(5);
    capturedImages.push(await takeSinglePhoto());
  }
  combinePhotos();
});

// Tombol ulang hanya bisa 2x
repeatBtn.addEventListener('click', async () => {
  if (repeatCount >= 2) {
    alert('Ulangi hanya dapat dilakukan 2 kali.');
    return;
  }
  repeatCount++;
  capturedImages = [];
  for (let i = 0; i < 3; i++) {
    await startCountdown(5);
    capturedImages.push(await takeSinglePhoto());
  }
  combinePhotos();
});

// Fungsi ambil foto tunggal
function takeSinglePhoto() {
  return new Promise((resolve) => {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = WIDTH;
    tempCanvas.height = HEIGHT / 3;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    resolve(tempCanvas.toDataURL('image/png'));
  });
}

// Gabungkan 3 foto jadi satu strip
function combinePhotos() {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');

  // Gambar tiap pose
  const img1 = new Image();
  const img2 = new Image();
  const img3 = new Image();
  img1.src = capturedImages[0];
  img2.src = capturedImages[1];
  img3.src = capturedImages[2];

  const frame = new Image();
  frame.src = frameImg.src;

  Promise.all([
    new Promise((res) => (img1.onload = res)),
    new Promise((res) => (img2.onload = res)),
    new Promise((res) => (img3.onload = res)),
    new Promise((res) => (frame.onload = res))
  ]).then(() => {
    const sectionHeight = HEIGHT / 3;
    ctx.drawImage(img1, 0, 0, WIDTH, sectionHeight);
    ctx.drawImage(img2, 0, sectionHeight, WIDTH, sectionHeight);
    ctx.drawImage(img3, 0, sectionHeight * 2, WIDTH, sectionHeight);
    ctx.drawImage(frame, 0, 0, WIDTH, HEIGHT);

    const dataURL = canvas.toDataURL('image/png');
    previewImage.src = dataURL;

    // Tombol unduh
    downloadBtn.onclick = () => {
      const email = prompt("Masukkan email Anda untuk mengunduh:");
      if (email) {
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = `photobooth-${email.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
        a.click();
      }
    };

    // Tombol cetak
    printBtn.onclick = () => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Foto</title>
            <style>
              body { margin: 0; text-align: center; }
              img { width: 100%; max-width: ${WIDTH}px; }
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
  });
}

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const frameImg = document.getElementById('frame');
const previewImage = document.getElementById('previewImage');
const frameSelector = document.getElementById('frameSelector');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');
const printBtn = document.getElementById('print');

// Countdown timer element
const countdown = document.createElement('div');
countdown.id = 'countdown';
document.querySelector('.camera').appendChild(countdown);

// Inisialisasi tombol
printBtn.style.display = 'none';
downloadBtn.style.display = 'none';

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

function capturePhoto() {
  const frame = new Image();
  frame.src = frameImg.src;

  frame.onload = () => {
    // Ukuran 5x16 cm @ 300 DPI
    const width = 590;
    const height = 1890;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    // Gambar dari video ke canvas (posisi dan skala sesuai kebutuhan layout pose)
    ctx.drawImage(video, 0, 0, width, height); // ← ini bisa disesuaikan lagi nanti

    // Tambahkan frame
    ctx.drawImage(frame, 0, 0, width, height);

    // Tampilkan di preview
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

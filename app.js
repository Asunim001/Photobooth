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
    canvas.width = frame.width;
    canvas.height = frame.height;
    const ctx = canvas.getContext('2d');

    // Gambar video & frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

    const dataURL = canvas.toDataURL('image/png');
    previewImage.src = dataURL;

    // Tampilkan tombol download & cetak
    downloadBtn.style.display = 'inline-block';
    printBtn.style.display = 'inline-block';

    // Download file
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'photobooth-anteiku.png';
      a.click();
    };

    // Cetak gambar
    printBtn.onclick = () => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak Photobooth</title>
            <style>
              body { margin: 0; padding: 0; text-align: center; }
              img { max-width: 100%; height: auto; }
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

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const frameImg = document.getElementById('frame');
const previewImage = document.getElementById('previewImage');
const frameSelector = document.getElementById('frameSelector');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');

// Countdown timer element
const countdown = document.createElement('div');
countdown.id = 'countdown';
document.querySelector('.camera').appendChild(countdown);

// Load camera
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

// Load frames into selector (assumes frames/frame1.png to frame10.png)
for (let i = 1; i <= 10; i++) {
  const option = document.createElement('option');
  option.value = `frames/frame${i}.png`;
  option.textContent = `Frame ${i}`;
  frameSelector.appendChild(option);
}

// Change frame when selector changes
frameSelector.addEventListener('change', () => {
  frameImg.src = frameSelector.value;
});

// Set default frame
frameSelector.value = 'frames/frame1.png';

// Capture with countdown
captureBtn.addEventListener('click', async () => {
  await startCountdown(3); // 3 seconds countdown
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
  // Buat ukuran canvas sama dengan ukuran asli frame PNG
  const frame = new Image();
  frame.src = frameImg.src;

  frame.onload = () => {
    canvas.width = frame.width;
    canvas.height = frame.height;

    const ctx = canvas.getContext('2d');

    // Gambar dari video ke canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Gambar frame ke atas video
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

    // Tampilkan hasil ke preview
    const dataURL = canvas.toDataURL('image/png');
    previewImage.src = dataURL;

    // Enable download
    downloadBtn.onclick = () => {
      const a = document.createElement('a');
      a.href = dataURL;
      a.download = 'photobooth-anteiku.png';
      a.click();
    };
  };
}

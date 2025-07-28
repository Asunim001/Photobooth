const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const previewImage = document.getElementById('previewImage');
const countdown = document.getElementById('countdown');
const captureBtn = document.getElementById('capture');
const downloadBtn = document.getElementById('download');
const printBtn = document.getElementById('print');
const repeatBtn = document.getElementById('repeat');

let capturedImages = [];
let repeatCount = 0;
const maxRepeats = 2;
const cmToPx = (cm, dpi = 300) => Math.round((cm / 2.54) * dpi);
const finalWidth = cmToPx(6); // 6 cm
const finalHeight = cmToPx(15); // 15 cm
const frameImage = new Image();
frameImage.src = 'frames/frame1.png';

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream;
});

captureBtn.addEventListener('click', async () => {
  capturedImages = [];
  repeatCount = 0;
  await startPoseSequence();
});

repeatBtn.addEventListener('click', async () => {
  if (repeatCount < maxRepeats) {
    capturedImages = [];
    repeatCount++;
    await startPoseSequence();
  } else {
    alert("Batas ulangi hanya 2 kali.");
  }
});

downloadBtn.addEventListener('click', () => {
  const finalImage = previewImage.src;
  const a = document.createElement('a');
  a.href = finalImage;
  a.download = 'photobooth-anteiku.png';
  a.click();
});

printBtn.addEventListener('click', () => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html><head><title>Cetak Foto</title></head><body style="margin:0;">
    <img src="${previewImage.src}" style="width:100%;" onload="window.print();window.onafterprint=()=>window.close();">
    </body></html>
  `);
});

async function startPoseSequence() {
  for (let i = 1; i <= 3; i++) {
    await startCountdown(5);
    capturedImages.push(capturePhoto());
  }
  drawToFinalCanvas();
}

function startCountdown(seconds) {
  return new Promise((resolve) => {
    countdown.style.display = 'block';
    let count = seconds;
    countdown.textContent = count;
    const interval = setInterval(() => {
      count--;
      countdown.textContent = count;
      if (count <= 0) {
        clearInterval(interval);
        countdown.style.display = 'none';
        resolve();
      }
    }, 1000);
  });
}

function capturePhoto() {
  const tempCanvas = document.createElement('canvas');
  const ctx = tempCanvas.getContext('2d');
  tempCanvas.width = finalWidth;
  tempCanvas.height = finalHeight / 3;

  ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
  return tempCanvas.toDataURL('image/png');
}

function drawToFinalCanvas() {
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = finalWidth;
  finalCanvas.height = finalHeight;
  const ctx = finalCanvas.getContext('2d');

  // Temp load and wait for frame
  frameImage.onload = () => {
    ctx.drawImage(frameImage, 0, 0, finalCanvas.width, finalCanvas.height);
    capturedImages.forEach((img, i) => {
      const photo = new Image();
      photo.src = img;
      photo.onload = () => {
        ctx.drawImage(photo, 0, i * finalHeight / 3, finalWidth, finalHeight / 3);
        if (i === 2) {
          previewImage.src = finalCanvas.toDataURL('image/png');
        }
      };
    });
  };

  if (frameImage.complete) {
    ctx.drawImage(frameImage, 0, 0, finalCanvas.width, finalCanvas.height);
    capturedImages.forEach((img, i) => {
      const photo = new Image();
      photo.src = img;
      photo.onload = () => {
        ctx.drawImage(photo, 0, i * finalHeight / 3, finalWidth, finalHeight / 3);
        if (i === 2) {
          previewImage.src = finalCanvas.toDataURL('image/png');
        }
      };
    });
  }
}

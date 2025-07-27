const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const downloadBtn = document.getElementById('downloadBtn');

// Akses kamera
navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert('Gagal mengakses kamera: ' + err.message);
  });

// Ambil foto
function takePhoto() {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Tambahkan frame
  const frame = new Image();
  frame.src = 'frame.png';
  frame.onload = () => {
    context.drawImage(frame, 0, 0, canvas.width, canvas.height);
    downloadBtn.style.display = 'inline-block';
  };
}

// Download foto
function downloadPhoto() {
  const link = document.createElement('a');
  link.download = 'photo_anteiku.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const frame = document.getElementById('frame');
const frameSelector = document.getElementById('frameSelector');
const previewImage = document.getElementById('previewImage');
const captureButton = document.getElementById('capture');
const downloadButton = document.getElementById('download');

// Mulai kamera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Kamera tidak bisa diakses: " + err);
  });

// Load 10 frame ke dropdown
for (let i = 1; i <= 10; i++) {
  const option = document.createElement('option');
  option.value = `frames/frame${i}.png`;
  option.text = `Frame ${i}`;
  frameSelector.appendChild(option);
}

// Ganti frame
frameSelector.addEventListener('change', () => {
  frame.src = frameSelector.value;
});

// Ambil foto
captureButton.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Gambar video ke canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Tambahkan frame ke canvas
  const frameImage = new Image();
  frameImage.src = frame.src;
  frameImage.onload = () => {
    context.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
    previewImage.src = canvas.toDataURL('image/png');
  };
});

// Unduh
downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `photobooth-anteiku-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
});

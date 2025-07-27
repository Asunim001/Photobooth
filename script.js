const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const countdown = document.getElementById('countdown');

const startBtn = document.getElementById('start');
const retryBtn = document.getElementById('retry');
const downloadBtn = document.getElementById('download');
const printBtn = document.getElementById('print');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('email');
const sendEmailBtn = document.getElementById('sendEmail');

let retryCount = 0;
let maxRetry = 2;
let photos = [];

// Mulai kamera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    alert("Kamera tidak tersedia: " + err.message);
  });

// Tombol ambil 3 foto
startBtn.onclick = async () => {
  disableAll();
  photos = [];
  for (let i = 0; i < 3; i++) {
    await countdownTimer(5);
    const snapshot = takeSnapshot();
    photos.push(snapshot);
  }

  const frame = new Image();
  frame.src = 'frames/frame3pose.png'; // Ukuran 15x6cm 300dpi → 1772x709
  frame.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);

    const photoHeight = canvas.height / 3;
    for (let i = 0; i < 3; i++) {
      ctx.drawImage(photos[i], 0, i * photoHeight, canvas.width, photoHeight);
    }

    enableActions();
  };
};

// Timer
function countdownTimer(seconds) {
  return new Promise(resolve => {
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

// Ambil snapshot
function takeSnapshot() {
  const snapCanvas = document.createElement('canvas');
  snapCanvas.width = canvas.width;
  snapCanvas.height = canvas.height / 3;
  const snapCtx = snapCanvas.getContext('2d');
  snapCtx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
  return snapCanvas;
}

// Cetak otomatis
printBtn.onclick = () => {
  const image = canvas.toDataURL('image/png');
  const win = window.open('', '_blank');
  win.document.write(`
    <html>
      <head><title>Cetak</title></head>
      <body style="margin:0;text-align:center;">
        <img src="${image}" style="width:100%;" />
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            }
          }
        </script>
      </body>
    </html>
  `);
  win.document.close();
};

// Unduh
downloadBtn.onclick = () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = 'photobooth-anteiku.png';
  link.click();
};

// Kirim email dengan EmailJS
emailForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const dataURL = canvas.toDataURL('image/png');

  emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
    to_email: emailInput.value,
    image_data: dataURL
  }, "YOUR_PUBLIC_KEY")
  .then(() => {
    alert("Gambar berhasil dikirim ke email!");
  }, (error) => {
    alert("Gagal kirim email: " + error.text);
  });
});

// Tombol ulangi
retryBtn.onclick = () => {
  if (retryCount < maxRetry) {
    retryCount++;
    startBtn.click();
  } else {
    retryBtn.disabled = true;
    alert("Maksimal ulangi 2 kali sudah tercapai.");
  }
};

// Aktifkan tombol setelah selesai ambil gambar
function enableActions() {
  retryBtn.disabled = false;
  downloadBtn.disabled = false;
  printBtn.disabled = false;
  sendEmailBtn.disabled = false;
}

// Nonaktifkan semua tombol saat proses
function disableAll() {
  retryBtn.disabled = true;
  downloadBtn.disabled = true;
  printBtn.disabled = true;
  sendEmailBtn.disabled = true;
}

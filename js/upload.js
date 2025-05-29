// Elements
const dropZone   = document.getElementById('drop-zone');
const browseBtn  = document.getElementById('browseBtn');
const fileInput  = document.getElementById('fileInput');
const preview    = document.getElementById('preview');
const uploadBtn  = document.getElementById('uploadBtn');

let filesToUpload = [];

// 1️⃣ Click “Browse” → open file picker
browseBtn.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', () => handleFiles(fileInput.files));

// 2️⃣ Drag & drop
;['dragenter','dragover'].forEach(evt =>
  dropZone.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dropZone.classList.add('dragover');
  })
);
;['dragleave','drop'].forEach(evt =>
  dropZone.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation();
    dropZone.classList.remove('dragover');
  })
);
dropZone.addEventListener('drop', e => {
  handleFiles(e.dataTransfer.files);
});

// Collect files & build preview
function handleFiles(fileList) {
  for (let file of fileList) {
    if (!file.type.startsWith('image/')) continue;
    filesToUpload.push(file);
    const item = document.createElement('div');
    item.classList.add('preview-item');
    item.innerHTML = `
      <img src="${URL.createObjectURL(file)}" alt="">
      <div class="progress"><div class="progress-bar"></div></div>
    `;
    preview.appendChild(item);
  }
  uploadBtn.disabled = filesToUpload.length === 0;
}

// 3️⃣ Upload with per-file progress
uploadBtn.addEventListener('click', () => {
  uploadBtn.disabled = true;
  filesToUpload.forEach((file, idx) => uploadFile(file, idx));
});

function uploadFile(file, idx) {
  const form = new FormData();
  form.append('images[]', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload'); // point to your server endpoint

  // Update that file’s progress bar
  xhr.upload.addEventListener('progress', e => {
    if (!e.lengthComputable) return;
    const pct = (e.loaded / e.total) * 100;
    document.querySelectorAll('.progress-bar')[idx].style.width = pct + '%';
  });

  xhr.onload = () => {
    if (xhr.status === 200) {
      // optionally mark as done
      document.querySelectorAll('.preview-item')[idx]
        .querySelector('.progress-bar')
        .style.background = '#27632A';
    } else {
      alert(`Upload failed for ${file.name}`);
    }
  };

  xhr.onerror = () => alert(`Network error for ${file.name}`);
  xhr.send(form);
}

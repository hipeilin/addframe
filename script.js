(() => {
  const MAX_DIMENSION = 2000;

  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const placeholder = document.getElementById('placeholder');
  const canvasWrap = document.getElementById('canvasWrap');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const borderWidthEl = document.getElementById('borderWidth');
  const borderColorEl = document.getElementById('borderColor');
  const borderRadiusEl = document.getElementById('borderRadius');
  const imageRadiusEl = document.getElementById('imageRadius');
  const previewBgColorEl = document.getElementById('previewBgColor');
  const previewBgResetEl = document.getElementById('previewBgReset');

  const borderWidthValue = document.getElementById('borderWidthValue');
  const borderRadiusValue = document.getElementById('borderRadiusValue');
  const imageRadiusValue = document.getElementById('imageRadiusValue');

  const downloadPngEl = document.getElementById('downloadPng');
  const downloadJpgEl = document.getElementById('downloadJpg');
  const resetEl = document.getElementById('reset');

  let img = null;
  let workW = 0;
  let workH = 0;

  function roundedRectPath(context, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, w / 2, h / 2));
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + w, y, x + w, y + h, radius);
    context.arcTo(x + w, y + h, x, y + h, radius);
    context.arcTo(x, y + h, x, y, radius);
    context.arcTo(x, y, x + w, y, radius);
    context.closePath();
  }

  function updateBoundsForImage() {
    const minSide = Math.min(workW, workH);
    const maxBorder = Math.max(10, Math.floor(minSide * 0.25));
    const maxRadius = Math.floor(minSide / 2);

    borderWidthEl.max = String(maxBorder);
    borderRadiusEl.max = String(maxRadius);
    imageRadiusEl.max = String(maxRadius);

    if (Number(borderWidthEl.value) > maxBorder) borderWidthEl.value = String(maxBorder);
    if (Number(borderRadiusEl.value) > maxRadius) borderRadiusEl.value = String(maxRadius);
    if (Number(imageRadiusEl.value) > maxRadius) imageRadiusEl.value = String(maxRadius);
  }

  function render() {
    if (!img) return;

    const borderWidth = Number(borderWidthEl.value);
    const borderColor = borderColorEl.value;
    const borderRadius = Number(borderRadiusEl.value);
    const imageRadius = Number(imageRadiusEl.value);

    const totalW = workW + borderWidth * 2;
    const totalH = workH + borderWidth * 2;

    canvas.width = totalW;
    canvas.height = totalH;

    ctx.clearRect(0, 0, totalW, totalH);

    if (borderWidth > 0) {
      roundedRectPath(ctx, 0, 0, totalW, totalH, borderRadius);
      ctx.fillStyle = borderColor;
      ctx.fill();
    }

    ctx.save();
    roundedRectPath(ctx, borderWidth, borderWidth, workW, workH, imageRadius);
    ctx.clip();
    ctx.drawImage(img, borderWidth, borderWidth, workW, workH);
    ctx.restore();

    borderWidthValue.textContent = `${borderWidth} px`;
    borderRadiusValue.textContent = `${borderRadius} px`;
    imageRadiusValue.textContent = `${imageRadius} px`;
  }

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image();
      image.onload = () => {
        img = image;
        const scale = Math.min(1, MAX_DIMENSION / Math.max(image.width, image.height));
        workW = Math.round(image.width * scale);
        workH = Math.round(image.height * scale);

        updateBoundsForImage();

        placeholder.hidden = true;
        canvasWrap.hidden = false;
        downloadPngEl.disabled = false;
        downloadJpgEl.disabled = false;
        resetEl.disabled = false;

        render();
      };
      image.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  [borderWidthEl, borderColorEl, borderRadiusEl, imageRadiusEl].forEach((el) => {
    el.addEventListener('input', render);
  });

  previewBgColorEl.addEventListener('input', () => {
    dropzone.classList.add('has-bg');
    dropzone.style.setProperty('--preview-bg-color', previewBgColorEl.value);
  });

  previewBgResetEl.addEventListener('click', () => {
    dropzone.classList.remove('has-bg');
    dropzone.style.removeProperty('--preview-bg-color');
  });

  fileInput.addEventListener('change', (e) => loadFile(e.target.files[0]));

  dropzone.addEventListener('click', () => {
    if (!img) fileInput.click();
  });

  dropzone.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !img) {
      e.preventDefault();
      fileInput.click();
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    loadFile(e.dataTransfer.files[0]);
  });

  function download(mimeType, extension) {
    if (!img) return;

    let exportCanvas = canvas;

    if (mimeType === 'image/jpeg') {
      exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const exportCtx = exportCanvas.getContext('2d');
      exportCtx.fillStyle = '#ffffff';
      exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
      exportCtx.drawImage(canvas, 0, 0);
    }

    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `framed-image.${extension}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }, mimeType, 0.92);
  }

  downloadPngEl.addEventListener('click', () => download('image/png', 'png'));
  downloadJpgEl.addEventListener('click', () => download('image/jpeg', 'jpg'));

  resetEl.addEventListener('click', () => {
    img = null;
    fileInput.value = '';
    placeholder.hidden = false;
    canvasWrap.hidden = true;
    downloadPngEl.disabled = true;
    downloadJpgEl.disabled = true;
    resetEl.disabled = true;
  });
})();

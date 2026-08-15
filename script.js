(() => {
  const MAX_DIMENSION = 2000;

  const fileInput = document.getElementById('fileInput');
  const dropzone = document.getElementById('dropzone');
  const placeholder = document.getElementById('placeholder');
  const canvasWrap = document.getElementById('canvasWrap');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const linkToggleEl = document.getElementById('linkToggle');
  const borderWidthLinkedEl = document.getElementById('borderWidthLinked');
  const borderWidthSidesEl = document.getElementById('borderWidthSides');

  const borderWidthEl = document.getElementById('borderWidth');
  const borderWidthTopEl = document.getElementById('borderWidthTop');
  const borderWidthRightEl = document.getElementById('borderWidthRight');
  const borderWidthBottomEl = document.getElementById('borderWidthBottom');
  const borderWidthLeftEl = document.getElementById('borderWidthLeft');

  const borderColorEl = document.getElementById('borderColor');
  const borderRadiusEl = document.getElementById('borderRadius');
  const imageRadiusEl = document.getElementById('imageRadius');
  const previewBgColorEl = document.getElementById('previewBgColor');
  const previewBgResetEl = document.getElementById('previewBgReset');

  const downloadPngEl = document.getElementById('downloadPng');
  const downloadJpgEl = document.getElementById('downloadJpg');
  const resetEl = document.getElementById('reset');

  let img = null;
  let workW = 0;
  let workH = 0;
  let borderLinked = true;

  const sideSliders = [borderWidthTopEl, borderWidthRightEl, borderWidthBottomEl, borderWidthLeftEl];
  const allBorderWidthSliders = [borderWidthEl, ...sideSliders];

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

  // Keeps a slider and its adjacent editable number field in sync. Typing a
  // value and pressing Enter or blurring the field commits it (clamped to
  // the slider's current min/max) and re-renders.
  function bindValueInput(slider, numberInput, onChange) {
    function syncFromSlider() {
      numberInput.value = slider.value;
    }

    function commit() {
      const min = Number(slider.min);
      const max = Number(slider.max);
      let value = parseFloat(numberInput.value);
      if (Number.isNaN(value)) value = Number(slider.value);
      value = Math.min(max, Math.max(min, Math.round(value)));
      slider.value = String(value);
      numberInput.value = String(value);
      onChange();
    }

    slider.addEventListener('input', () => {
      syncFromSlider();
      onChange();
    });

    numberInput.addEventListener('blur', commit);
    numberInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commit();
        numberInput.blur();
      }
    });

    syncFromSlider();
  }

  function getBorderWidths() {
    if (borderLinked) {
      const w = Number(borderWidthEl.value);
      return { top: w, right: w, bottom: w, left: w };
    }
    return {
      top: Number(borderWidthTopEl.value),
      right: Number(borderWidthRightEl.value),
      bottom: Number(borderWidthBottomEl.value),
      left: Number(borderWidthLeftEl.value),
    };
  }

  function updateBoundsForImage() {
    const minSide = Math.min(workW, workH);
    const maxBorder = Math.max(10, Math.floor(minSide * 0.25));
    const maxRadius = Math.floor(minSide / 2);

    allBorderWidthSliders.forEach((slider) => {
      slider.max = String(maxBorder);
      if (Number(slider.value) > maxBorder) slider.value = String(maxBorder);
    });

    [borderRadiusEl, imageRadiusEl].forEach((slider) => {
      slider.max = String(maxRadius);
      if (Number(slider.value) > maxRadius) slider.value = String(maxRadius);
    });

    // Keep the paired number inputs' bounds and displayed values in sync.
    document.querySelectorAll('.value-input').forEach((input) => {
      const slider = document.getElementById(input.id.replace(/Value$/, ''));
      if (slider) {
        input.max = slider.max;
        input.value = slider.value;
      }
    });
  }

  function render() {
    if (!img) return;

    const { top, right, bottom, left } = getBorderWidths();
    const borderColor = borderColorEl.value;
    const borderRadius = Number(borderRadiusEl.value);
    const imageRadius = Number(imageRadiusEl.value);

    const totalW = workW + left + right;
    const totalH = workH + top + bottom;

    canvas.width = totalW;
    canvas.height = totalH;

    ctx.clearRect(0, 0, totalW, totalH);

    if (top > 0 || right > 0 || bottom > 0 || left > 0) {
      roundedRectPath(ctx, 0, 0, totalW, totalH, borderRadius);
      ctx.fillStyle = borderColor;
      ctx.fill();
    }

    ctx.save();
    roundedRectPath(ctx, left, top, workW, workH, imageRadius);
    ctx.clip();
    ctx.drawImage(img, left, top, workW, workH);
    ctx.restore();
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

  bindValueInput(borderWidthEl, document.getElementById('borderWidthValue'), render);
  bindValueInput(borderWidthTopEl, document.getElementById('borderWidthTopValue'), render);
  bindValueInput(borderWidthRightEl, document.getElementById('borderWidthRightValue'), render);
  bindValueInput(borderWidthBottomEl, document.getElementById('borderWidthBottomValue'), render);
  bindValueInput(borderWidthLeftEl, document.getElementById('borderWidthLeftValue'), render);
  bindValueInput(borderRadiusEl, document.getElementById('borderRadiusValue'), render);
  bindValueInput(imageRadiusEl, document.getElementById('imageRadiusValue'), render);

  borderColorEl.addEventListener('input', render);

  linkToggleEl.addEventListener('click', () => {
    borderLinked = !borderLinked;
    linkToggleEl.setAttribute('aria-pressed', String(!borderLinked));
    linkToggleEl.title = borderLinked ? 'Set each side individually' : 'Link all sides together';

    if (!borderLinked) {
      const w = borderWidthEl.value;
      sideSliders.forEach((slider) => {
        slider.value = w;
        document.getElementById(`${slider.id}Value`).value = w;
      });
      borderWidthLinkedEl.hidden = true;
      borderWidthSidesEl.hidden = false;
    } else {
      const average = Math.round(
        sideSliders.reduce((sum, slider) => sum + Number(slider.value), 0) / sideSliders.length
      );
      const max = Number(borderWidthEl.max);
      borderWidthEl.value = String(Math.min(average, max));
      document.getElementById('borderWidthValue').value = borderWidthEl.value;
      borderWidthLinkedEl.hidden = false;
      borderWidthSidesEl.hidden = true;
    }

    render();
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

  const shareWidget = document.getElementById('shareWidget');
  const shareToggleEl = document.getElementById('shareToggle');
  const shareMenuEl = document.getElementById('shareMenu');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const copyLinkLabel = document.getElementById('copyLinkLabel');
  const SHARE_URL = 'https://hipeilin.github.io/addframe/';
  const SHARE_TEXT = 'AddFrame — add a border to your photo online, free';

  function closeShareMenu() {
    shareMenuEl.hidden = true;
    shareToggleEl.setAttribute('aria-expanded', 'false');
  }

  function openShareMenu() {
    shareMenuEl.hidden = false;
    shareToggleEl.setAttribute('aria-expanded', 'true');
  }

  shareToggleEl.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: SHARE_TEXT, url: SHARE_URL }).catch(() => {});
      return;
    }
    if (shareMenuEl.hidden) openShareMenu();
    else closeShareMenu();
  });

  document.addEventListener('click', (e) => {
    if (!shareMenuEl.hidden && !shareWidget.contains(e.target)) closeShareMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !shareMenuEl.hidden) closeShareMenu();
  });

  copyLinkBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(SHARE_URL);
      copyLinkLabel.textContent = 'Copied!';
      setTimeout(() => {
        copyLinkLabel.textContent = 'Copy link';
      }, 1500);
    } catch {
      // Clipboard API unavailable; nothing more we can do here.
    }
  });
})();

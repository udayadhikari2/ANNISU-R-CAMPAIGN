const upload = document.getElementById("upload");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const zoom = document.getElementById("zoom");
  const rotate = document.getElementById("rotate");
  const download = document.getElementById("download");
  const editorContainer = document.getElementById("editor-container");
  const uploadButton = document.querySelector(".upload-button");

  let img = new Image();
  let frame = new Image();
  let drag = false;
  let offsetX = 0,
    offsetY = 0,
    imgX = 0,
    imgY = 0;
  let imageLoaded = false;
  ctx.imageSmoothingEnabled = false;
  frame.src = "frame_2.png";
  img.src="upload-icon.png";

  frame.onload = () => {
    canvas.width =500;
    canvas.height = 500;
    frameLoaded = true;
    drawImage();
  };

  upload.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  });

  img.onload = () => {
    imageLoaded = true;
    document.body.style.backgroundImage = "none";
    uploadButton.style.top = "100px";
    uploadButton.style.left = "10px"; // Keep at top-left
    uploadButton.style.transform = "none";
    uploadButton.style.background = "rgba(11, 204, 27, 0.7)";
    uploadButton.querySelector("h6").style.display = "none";
    imgX = 0;
    imgY = 0;
    zoom.value = 1;
    rotate.value = 0;
    drawImage();
  };

  function drawImage() {
    if (!imageLoaded) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2 + imgX, canvas.height / 2 + imgY);
    ctx.rotate((rotate.value * Math.PI) / 180);

    const scale = zoom.value;
    let scaledWidth = 200 * scale;
    let scaledHeight =200* scale;

    ctx.drawImage(
      img,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );
    ctx.restore();
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
  }

  [zoom, rotate].forEach((control) => {
    control.addEventListener("input", drawImage);
  });

  editorContainer.addEventListener("mousedown", startDrag);
  editorContainer.addEventListener("touchstart", startDrag, {
    passive: false,
  });

  document.addEventListener("mousemove", dragImage);
  document.addEventListener("touchmove", dragImage, { passive: false });

  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);

  function startDrag(e) {
    e.preventDefault(); // Prevents scrolling on mobile while dragging
    drag = true;

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    offsetX = clientX - imgX;
    offsetY = clientY - imgY;
    editorContainer.style.cursor = "grabbing";
  }

  function dragImage(e) {
    if (!drag) return;
    e.preventDefault();

    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let clientY = e.touches ? e.touches[0].clientY : e.clientY;

    imgX = clientX - offsetX;
    imgY = clientY - offsetY;
    drawImage();
  }

  function stopDrag() {
    drag = false;
    editorContainer.style.cursor = "grab";
  }

  download.addEventListener("click", () => {
    if (!imageLoaded) {
      alert("Please upload an image before downloading!");
      return;
    }
    const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "edited-image.jpeg";
    link.click();
  });
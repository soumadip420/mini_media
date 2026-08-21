const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const previewImg = document.getElementById('previewImg');

// Check if an existing image is already loaded
if (previewImg.src && previewImg.getAttribute('src')) {
    dropzone.classList.add('has-image');
}

// Preview newly selected image
fileInput.onchange = () => {
    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {
        previewImg.src = e.target.result;
        dropzone.classList.add('has-image');
    };

    reader.readAsDataURL(file);
};


// Character counter
const descriptionInput = document.getElementById('descriptionInput');

descriptionInput.oninput = () => {
    document.getElementById('charCount').textContent =
        descriptionInput.value.length;
};


// Remove image
document.getElementById('removeImgBtn').onclick = e => {
    e.stopPropagation();

    fileInput.value = '';
    previewImg.src = '';

    dropzone.classList.remove('has-image');
};
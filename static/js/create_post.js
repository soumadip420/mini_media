const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const previewImg = document.getElementById('previewImg');
if (previewImg.src && previewImg.getAttribute('src')) {
    dropzone.classList.add('has-image');
}
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
const descriptionInput = document.getElementById('descriptionInput');

descriptionInput.oninput = () => {
    document.getElementById('charCount').textContent =
        descriptionInput.value.length;
};
document.getElementById('removeImgBtn').onclick = e => {
    e.stopPropagation();

    fileInput.value = '';
    previewImg.src = '';

    dropzone.classList.remove('has-image');
};
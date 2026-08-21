function openImage(imageUrl) {
    const modal = document.getElementById('imageModal');
    const fullImage = document.getElementById('fullImage');

    fullImage.src = imageUrl;
    modal.classList.add('show');
}


function closeImage() {
    const modal = document.getElementById('imageModal');
    const fullImage = document.getElementById('fullImage');

    modal.classList.remove('show');
    fullImage.src = '';
}
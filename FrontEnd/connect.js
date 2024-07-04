document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('authToken');
    const editModeBar = document.getElementById('edit-mode-bar');
    const modal = document.querySelector('.modal');
    const addPhotoButton = document.getElementById('add-photo-button');
    const closeButton = document.querySelector('.close-button');
    const editButton = document.getElementById('edit-button');

    if (authToken && editModeBar) {
        editModeBar.classList.remove('hidden');
    }

    const loginElement = document.getElementById('login');
    if (loginElement) {
        loginElement.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    const editIcon = document.querySelector('.fa-pen-to-square');
    if (editIcon && modal) {
        editIcon.addEventListener('click', function() {
            modal.classList.remove('hidden');
        });
    }

    if (editButton) {
        editButton.addEventListener('click', function() {
            modal.classList.remove('hidden');
        });
    }

    if (closeButton && modal) {
        closeButton.addEventListener('click', function() {
            modal.classList.add('hidden');
        });

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }
});
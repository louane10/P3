document.addEventListener('DOMContentLoaded', () => {

  function fetchProjects() {
      fetch('http://localhost:5678/api/works')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              displayProjects(data);
              generateCategoriesMenu(data);
          })
          .catch(error => {
              console.error('There was a problem with the fetch operation:', error);
          });
  }

  function displayProjects(projects) {
      const gallery = document.querySelector('.gallery');
      if (!gallery) return; // Vérifie si l'élément existe
      gallery.innerHTML = ''; 

      projects.forEach(project => {
          const figure = document.createElement('figure');
          const img = document.createElement('img');
          const figcaption = document.createElement('figcaption');

          img.src = project.imageUrl;
          img.alt = project.title;
          figcaption.textContent = project.title;

          figure.appendChild(img);
          figure.appendChild(figcaption);
          gallery.appendChild(figure);
      });
  }

  function generateCategoriesMenu(projects) {
      const categoriesMenu = document.getElementById('categories-menu');
      if (!categoriesMenu) return; // Vérifie si l'élément existe
      categoriesMenu.innerHTML = ''; 

      const categories = ['Tous', 'Objets', 'Appartements', 'Hotels & restaurants'];

      categories.forEach(category => {
          const button = document.createElement('button');
          button.textContent = category;
          button.addEventListener('click', () => {
              filterProjects(category, projects);
              setActiveCategory(button);
          });
          categoriesMenu.appendChild(button);
      });

      // "Tous"
      const firstButton = categoriesMenu.querySelector('button');
      if (firstButton) firstButton.classList.add('active');
  }

  function filterProjects(category, projects) {
      if (category === 'Tous') {
          displayProjects(projects);
      } else {
          const filteredProjects = projects.filter(project => project.category.name === category);
          displayProjects(filteredProjects);
      }
  }

  function setActiveCategory(activeButton) {
      const buttons = document.querySelectorAll('#categories-menu button');
      buttons.forEach(button => {
          button.classList.remove('active');
      });
      activeButton.classList.add('active');
  }

  fetchProjects();
});

// Fenêtre modale
document.addEventListener('DOMContentLoaded', function() {
  const authToken = localStorage.getItem('authToken');
  const editModeBar = document.getElementById('edit-mode-bar');
  const modal = document.getElementById('modal');
  const closeButton = document.querySelector('.close-button');
  const editButton = document.getElementById('edit-button');
  const loginButton = document.getElementById('login');
  const categoriesMenu = document.getElementById('categories-menu');
  const modalGallery = document.querySelector('.modal-gallery');

  if (authToken) {
      if (editModeBar) editModeBar.classList.remove('hidden');
      if (editButton) editButton.classList.remove('hidden');
      if (categoriesMenu) categoriesMenu.classList.add('hidden');
  }

  if (loginButton) {
      loginButton.addEventListener('click', function() {
          window.location.href = 'login.html';
      });
  }

  if (editButton) {
      editButton.addEventListener('click', function() {
          if (modal) modal.style.display = 'block';
          loadGalleryImages();
      });
  }

  if (closeButton) {
      closeButton.addEventListener('click', function() {
          if (modal) modal.style.display = 'none';
      });
  }

  window.addEventListener('click', function(event) {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  function loadGalleryImages() {
      const galleryImages = document.querySelectorAll('.gallery img');
      if (!modalGallery) return; 
      modalGallery.innerHTML = '';
      galleryImages.forEach(image => {
          const imageContainer = document.createElement('div');
          imageContainer.classList.add('image-container');
          const img = document.createElement('img');
          img.src = image.src;
          const trashIcon = document.createElement('i');
          trashIcon.classList.add('fa', 'fa-trash', 'trash-icon');
          trashIcon.addEventListener('click', function() {
           
              imageContainer.remove();
          });
          imageContainer.appendChild(img);
          imageContainer.appendChild(trashIcon);
          modalGallery.appendChild(imageContainer);
      });
  }
});
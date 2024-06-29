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
      if (!gallery) return; 
      gallery.innerHTML = ''; 

      projects.forEach(project => {
          const figure = document.createElement('figure');
          figure.setAttribute('id', project.id)
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
      if (!categoriesMenu) return; 
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


// Fenêtre modale et déconnexion
document.addEventListener('DOMContentLoaded', function() {
  const authToken = localStorage.getItem('authToken');
  const editModeBar = document.getElementById('edit-mode-bar');
  const modal = document.getElementById('modal');
  const addPhotoModal = document.getElementById('add-photo-modal');
  const closeButtons = document.querySelectorAll('.close-button');
  const backButton = document.querySelector('.back-button');
  const editButton = document.getElementById('edit-button');
  const addPhotoButton = document.getElementById('add-photo-button');
  const loginLogoutButton = document.getElementById('login');
  const categoriesMenu = document.getElementById('categories-menu');
  const modalGallery = document.querySelector('.modal-gallery');
  const uploadPhotoButton = document.getElementById('upload-photo-button');
  const fileInput = document.getElementById('file-input');
  const submitPhotoButton = document.getElementById('submit-photo-button');

  
  if (authToken) {
      editModeBar.classList.remove('hidden');
      editButton.classList.remove('hidden');
      categoriesMenu.classList.add('hidden');
      loginLogoutButton.textContent = 'Logout';
  }
  
  loginLogoutButton.addEventListener('click', function() {
    if (authToken) {
        localStorage.removeItem('authToken');
        location.reload();
    } 
  });

  editButton.addEventListener('click', function() {
    modal.classList.remove('hidden');
    loadGalleryImages();
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      modal.classList.add('hidden');
    });
  });

  backButton.addEventListener('click', function() {
    document.getElementById('modale-suppression').classList.remove('hidden');
    document.getElementById('modale-ajout').classList.add('hidden');
  });


  window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    } else if (event.target === addPhotoModal) {
        addPhotoModal.style.display = 'none';
      }
  });

  addPhotoButton.addEventListener('click', function() {
    document.getElementById('modale-suppression').classList.add('hidden');
    document.getElementById('modale-ajout').classList.remove('hidden');
  });

  uploadPhotoButton.addEventListener('click', function() {
    fileInput.click(); 
  });

  submitPhotoButton.addEventListener('click', function() {
    const title = document.getElementById('photo-title').value;
    const category = document.getElementById('photo-category').value;
    const file = fileInput.files[0];

    if (!title || !category || !file) {
      alert('Veuillez remplir tous les champs et sélectionner une photo.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);

    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
      body: formData
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        loadGalleryImages();
        modal.classList.add('hidden');
        alert('Photo ajoutée avec succès.');
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
  });
 
  function loadGalleryImages() {
    const gallery = document.querySelector('.gallery');
        fetch('http://localhost:5678/api/works')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (!modalGallery) return; 
                modalGallery.innerHTML = '';
                if (gallery) {
                  gallery.innerHTML = '';
                }
                
                data.forEach(project => {
                    const imageContainer = document.createElement('div');
                    imageContainer.setAttribute('id', project.id)
                    imageContainer.classList.add('image-container');
                    const img = document.createElement('img');
                    img.src = project.imageUrl;
                    const trashIcon = document.createElement('i');
                    trashIcon.classList.add('fa-solid', 'fa-trash-can')
                    trashIcon.addEventListener('click', function() {
                          fetch('http://localhost:5678/api/works/' + project.id, {
                            method:'DELETE', 
                            headers: {
                                Authorization: "Bearer " + authToken
                            }
                          })
                              .then(response => {
                                  if (!response.ok) {
                                      throw new Error('Network response was not ok');
                                  }
                                  if (response.status === 204) {
                                    imageContainer.remove();
                                    if (gallery) {
                                      const projectToRemove = document.getElementById(project.id);
                                      if (projectToRemove) {
                                        projectToRemove.remove();
                                      }
                                    }
                                } else {
                                    throw new Error('Network response was not ok');
                                }
                            })
                              .catch(error => {
                                  console.error('There was a problem with the fetch operation:', error);
                              });
                      
                    });
                    imageContainer.appendChild(img);
                    imageContainer.appendChild(trashIcon);
                    modalGallery.appendChild(imageContainer);
                    
                    if (gallery) {
                    const figure = document.createElement('figure');
                    figure.setAttribute('id', project.id);
                    const imgGallery = document.createElement('img');
                    const figcaption = document.createElement('figcaption');
          
                    imgGallery.src = project.imageUrl;
                    imgGallery.alt = project.title;
                    figcaption.textContent = project.title;
          
                    figure.appendChild(imgGallery);
                    figure.appendChild(figcaption);
                    gallery.appendChild(figure);
                    }
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
  }

  loadGalleryImages();


});


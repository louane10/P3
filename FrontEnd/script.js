document.addEventListener('DOMContentLoaded', () => {

// Fonction pour récupérer les projets

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

 // Fonction pour afficher les projets dans la galerie

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

   // Fonction pour générer le menu des catégories

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

  // Fonction pour filtrer les projets par catégorie

  function filterProjects(category, projects) {
      if (category === 'Tous') {
          displayProjects(projects);
      } else {
          const filteredProjects = projects.filter(project => project.category.name === category);
          displayProjects(filteredProjects);
      }
  }

   // Fonction pour marquer la catégorie active

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
  const modal = document.querySelector('.modal');
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
  const photoTitle = document.getElementById('photo-title');
  const photoCategory = document.getElementById('photo-category');


  // Afficher les éléments en mode édition si un token d'authentification est présent
  
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




 //Creation modale

  function createSuppressionModal() {
    const modalContainer = document.getElementById('modal-container');
    const modal = document.createElement('div');
    modal.classList.add('modal', 'hidden');

    const modalContent = `
        <div id="modale-suppression" class="modal-content">
            <div class="modal-header">
                <span class="close-button">&times;</span>
            </div>
            <h2>Galerie photo</h2>
            <div class="modal-gallery">
                <!-- Galerie des projets -->
            </div>
            <hr>
            <button id="add-photo-button">Ajouter une photo</button>
        </div>
    `;

    modal.innerHTML = modalContent;
    modalContainer.appendChild(modal);
}
  
    // Création de la modale d'ajout
    function createAjoutModal() {
      const modalContainer = document.getElementById('modal-container');
      const modal = document.createElement('div');
      modal.classList.add('modal', 'hidden');
      modal.setAttribute('id', 'ajout-modal');

      const modalContent = `
          <div id="modale-ajout" class="modal-content hidden">
              <div class="modal-header">
                  <span class="back-button">
                      <i class="fa-solid fa-arrow-left"></i>
                  </span>
                  <span class="close-button">&times;</span>
                  <h2>Ajout Photo</h2>
              </div>
              <div class="add-photo-form">
                  <div class="photo-upload-container">
                      <div class="upload-placeholder">
                          <i class="fa-regular fa-image"></i>
                      </div>
                      <button id="upload-photo-button">+ Ajouter photo</button>
                      <p>jpg. png : 4mo max</p>
                      <input type="file" id="file-input" class="hidden">
                      <img id="photo-preview" class="hidden" alt="Photo preview">
                  </div>
                  <div class="photo-details">
                      <label for="photo-title">Titre</label>
                      <input type="text" id="photo-title">
                      <label for="photo-category">Catégorie</label>
                      <select id="photo-category">
                          <option value=""></option>
                          <option value="hotels et restaurants">Hôtels & Restaurants</option>
                          <option value="appartements">Appartements</option>
                          <option value="objets">Objets</option>
                      </select>
                  </div>
                  <hr>
                  <button id="submit-photo-button">Valider</button>
              </div>
          </div>
      `;

      modal.innerHTML = modalContent;
      modalContainer.appendChild(modal);
  }

    createSuppressionModal();
    createAjoutModal();



 // Ouvrir et fermer la fenêtre modale en mode édition

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


  document.querySelector('.modal');
  document.getElementById('add-photo-button');

  if (editButton && modal) {
      editButton.addEventListener('click', function() {
          modal.classList.remove('hidden');
          loadGalleryImages();
      });
  }

  if (closeButtons) {
      closeButtons.forEach(button => {
          button.addEventListener('click', function() {
              modal.classList.add('hidden');
          });
      });
  }

  if (backButton) {
      backButton.addEventListener('click', function() {
          const suppressionModal = document.getElementById('modale-suppression');
          const ajoutModal = document.getElementById('modale-ajout');
          if (suppressionModal && ajoutModal) {
              suppressionModal.classList.remove('hidden');
              ajoutModal.classList.add('hidden');
          }
      });
  }

  window.addEventListener('click', function(event) {
      if (event.target === modal) {
          modal.style.display = 'none';
      } else if (event.target === addPhotoModal) {
          addPhotoModal.style.display = 'none';
      }
  });

  if (addPhotoButton) {
    addPhotoButton.addEventListener('click', function() {
        const suppressionModal = document.getElementById('modale-suppression');
        const ajoutModal = document.getElementById('modale-ajout');
        if (suppressionModal && ajoutModal) {
            suppressionModal.classList.add('hidden');
            ajoutModal.classList.remove('hidden');
        }
    });
}

if (submitPhotoButton) {
    submitPhotoButton.addEventListener('click', (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', fileInput.files[0]);
        formData.append('title', photoTitle.value);
        formData.append('category', photoCategory.value);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + authToken
            },
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
}

if (fileInput) {
    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const photoPreview = document.getElementById('photo-preview');
            photoPreview.src = e.target.result;
            photoPreview.classList.remove('hidden');
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });
}
});

  // Essai de l'envoi du projet à l'API

  
    submitPhotoButton.addEventListener('click', (event) => {
      event.preventDefault();
  
      const formData = new FormData();
      formData.append('image', fileInput.files[0]);
      formData.append('title', photoTitle.value);
      formData.append('category', photoCategory.value);

    fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + authToken
      },
      body: formData,
    })
    .then(data => {
      console.log('Réponse de l\'API :', data);
      alert('Photo ajoutée avec succès.');
      document.querySelector('.modal').classList.add('hidden');
      loadGalleryImages(); 
    })
    .catch(error => {
      console.error('Erreur lors de l\'envoi de la demande :', error);
    });
  });
 
// Fonction pour charger et afficher les images dans la galerie

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
                    
                    data.forEach(project => {
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
                    })
                });
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
  }

  loadGalleryImages();


//Affichage de l'image dans fileinput

document.getElementById('upload-photo-button').addEventListener('click', function() {
  document.getElementById('file-input').click();
});
document.getElementById('file-input').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const photoPreview = document.getElementById('photo-preview');
      photoPreview.src = e.target.result;
      photoPreview.classList.remove('hidden');
      document.querySelector('.upload-placeholder').classList.add('hidden');
      document.getElementById('upload-photo-button').classList.add('hidden');
      document.querySelector('.photo-upload-container p').classList.add('hidden');
    }
    reader.readAsDataURL(file);
  }
});








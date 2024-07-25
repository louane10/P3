document.addEventListener("DOMContentLoaded", () => {
  // Fonction pour récupérer les projets

  function fetchProjects() {
    fetch("http://localhost:5678/api/works")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        displayProjects(data);
        fetchCategories(data);
        generateCategoriesMenu(data);
        
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  // Fonction pour afficher les projets dans la galerie

  function displayProjects(projects) {
    const gallery = document.querySelector(".gallery");
    if (!gallery) return;
    gallery.innerHTML = "";
  
    projects.forEach((project) => {
      const figure = document.createElement("figure");
      figure.setAttribute("id", project.id);
      const img = document.createElement("img");
      const figcaption = document.createElement("figcaption");

      img.src = project.imageUrl;
      img.alt = project.title;
      figcaption.textContent = project.title;

      figure.appendChild(img);
      figure.appendChild(figcaption);
      gallery.appendChild(figure);
    });
  }

  // edit mode bar

  document.addEventListener('DOMContentLoaded', function() {
    const authToken = localStorage.getItem('authToken');
    const editModeBar = document.getElementById('edit-mode-bar');
    const modal = document.querySelector('.modal');
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

 // Fonction pour récupérer et afficher les catégories dynamiquement

 function fetchCategories(projects) {
  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((categories) => {
      generateCategoriesMenu(categories, projects);
      populateCategoryOptions(categories);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}



    // Fonction pour générer le menu des catégories

    function generateCategoriesMenu(categories, projects) {
      const categoriesMenu = document.getElementById("categories-menu");
      if (!categoriesMenu) return;
      categoriesMenu.innerHTML = "";
  
      const allCategories = [{ id: 0, name: "Tous" }, ...categories];
  
      allCategories.forEach((category) => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.dataset.id = category.id;
        button.addEventListener("click", () => {
          filterProjects(category.name, projects);
          setActiveCategory(button);
        });
        categoriesMenu.appendChild(button);
      });
  
      // "Tous"
  
      const firstButton = categoriesMenu.querySelector("button");
      if (firstButton) firstButton.classList.add("active");
    }
  
    // Fonction pour filtrer les projets par catégorie
  
    function filterProjects(categoryName, projects) {
      if (categoryName === "Tous") {
        displayProjects(projects);
      } else {
        const filteredProjects = projects.filter(
          (project) => project.category.name === category
        );
        displayProjects(filteredProjects);
      }
    }
  
    // Fonction pour marquer la catégorie active
  
    function setActiveCategory(activeButton) {
      const buttons = document.querySelectorAll("#categories-menu button");
      buttons.forEach((button) => {
        button.classList.remove("active");
      });
      activeButton.classList.add("active");
    }

     // Fonction pour remplir les options de catégorie dans le formulaire d'ajout
  function populateCategoryOptions(categories) {
    const photoCategory = document.getElementById("photo-category");
    if (!photoCategory) return;
    photoCategory.innerHTML = "";

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      photoCategory.appendChild(option);
    });
  }
  
    fetchProjects();
  });
  

  // Fenêtre modale et déconnexion
document.addEventListener("DOMContentLoaded", function () {
  const authToken = localStorage.getItem("authToken");
  const editModeBar = document.getElementById("edit-mode-bar");
  const modal = document.querySelector(".modal");
  const addPhotoModal = document.getElementById("add-photo-modal");
  const editButton = document.getElementById("edit-button");
  const loginLogoutButton = document.getElementById("login");
  const categoriesMenu = document.getElementById("categories-menu");
  const modalGallery = document.querySelector(".modal-gallery");
  const uploadPhotoButton = document.getElementById("upload-photo-button");
  const fileInput = document.getElementById("file-input");
  const photoTitle = document.getElementById("photo-title");
  const photoCategory = document.getElementById("photo-category");

  // Afficher les éléments en mode édition si un token d'authentification est présent

  if (authToken) {
    editModeBar.classList.remove("hidden");
    editButton.classList.remove("hidden");
    categoriesMenu.classList.add("hidden");
    loginLogoutButton.textContent = "Logout";
  }

  loginLogoutButton.addEventListener("click", function () {
    if (authToken) {
      localStorage.removeItem("authToken");
      location.reload();
    }
  });

    // Ouvrir et fermer la fenêtre modale en mode édition

    editButton.addEventListener("click", function () {
      createSuppressionModal();
    });
  
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      } else if (event.target === addPhotoModal) {
        addPhotoModal.style.display = "none";
      }
    });
  

    // Modale de suppression

    function createSuppressionModal() {
      const modalContainer = document.getElementById("modal-container");
      const modal = document.createElement("div");
      modal.classList.add("modal");
  
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      modalContent.setAttribute("id", "modale-suppression");
  
      const modalHeader = document.createElement("div");
      modalHeader.classList.add("modal-header");
  
      const closeButton = document.createElement("span");
      closeButton.classList.add("close-button");
      closeButton.innerHTML = "&times;";
  
      const title = document.createElement("h2");
      title.textContent = "Galerie photo";
  
      const modalGallery = document.createElement("div");
      modalGallery.classList.add("modal-gallery");
  
      const hr = document.createElement("hr");
  
      const addPhotoButton = document.createElement("button");
      addPhotoButton.setAttribute("id", "add-photo-button");
      addPhotoButton.textContent = "Ajouter une photo";
  
      modalHeader.appendChild(closeButton);
      modalContent.appendChild(modalHeader);
      modalContent.appendChild(title);
      modalContent.appendChild(modalGallery);
      modalContent.appendChild(hr);
      modalContent.appendChild(addPhotoButton);
      modal.appendChild(modalContent);
      modalContainer.appendChild(modal);
  
      closeButton.addEventListener("click", function () {
        const modalContainer = document.getElementById("modal-container");
        modalContainer.innerHTML = "";
      });
  
      addPhotoButton.addEventListener("click", function () {
        document.getElementById("modal-container").innerHTML = "";
        createAjoutModal();
      });
  
      loadGalleryImagesForSuppressionModal();
    }
  
    function loadGalleryImagesForSuppressionModal() {
      const modalGallery = document.querySelector(".modal-gallery");
  
      fetch("http://localhost:5678/api/works")
          .then((response) => {
              if (!response.ok) {
                  throw new Error("Network response was not ok");
              }
              return response.json();
          })
          .then((data) => {
              if (!modalGallery) return;
              modalGallery.innerHTML = "";
  
              data.forEach((project) => {
                  const modalImageContainer = document.createElement("div");
                  modalImageContainer.setAttribute("id", project.id);
                  modalImageContainer.classList.add("image-container");
  
                  const modalImg = document.createElement("img");
                  modalImg.src = project.imageUrl;
                  modalImg.alt = project.title;
  
                  const trashIcon = document.createElement("i");
                  trashIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
                  trashIcon.addEventListener("click", function () {
                      deleteProject(project.id);
                  });
  
                  modalImageContainer.append(modalImg, trashIcon);
                  modalGallery.appendChild(modalImageContainer);
              });
          })
          .catch((error) => {
              console.error("Erreur lors du chargement des images :", error);
          });
  }  
  
  function deleteProject(projectId) {
    const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (confirmDelete) {
          fetch('http://localhost:5678/api/works/${projectId}', {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + authToken,
            },
          })
          .then((response) => {
            if (response.ok) {
              const imageContainer = document.getElementById(projectId);
              if (imageContainer) {
                imageContainer.remove();
              }
            } else {
              console.error("Erreur lors de la suppression du projet");
            }
          })
          .catch((error) => {
            console.error("Erreur lors de la suppression du projet :", error);
          });
        }
      }

    //Modale d'ajout

    function createAjoutModal() {
      const modalContainer = document.getElementById("modal-container");
      const modal = document.createElement("div");
      modal.classList.add("modal");
      modal.setAttribute("id", "ajout-modal");
  
      const modalContent = document.createElement("div");
      modalContent.classList.add("modal-content");
      modalContent.setAttribute("id", "modale-ajout");
  
      const modalHeader = document.createElement("div");
      modalHeader.classList.add("modal-header");
  
      const backButton = document.createElement("span");
      backButton.classList.add("back-button");
      backButton.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  
      const closeButton = document.createElement("span");
      closeButton.classList.add("close-button");
      closeButton.innerHTML = "&times;";
  
      const title = document.createElement("h2");
      title.textContent = "Ajout Photo";
  
      const addPhotoForm = document.createElement("div");
      addPhotoForm.classList.add("add-photo-form");
  
      const photoUploadContainer = document.createElement("div");
      photoUploadContainer.classList.add("photo-upload-container");
  
      const uploadPlaceholder = document.createElement("div");
      uploadPlaceholder.classList.add("upload-placeholder");
      uploadPlaceholder.innerHTML = '<i class="fa-regular fa-image"></i>';
  
      const uploadPhotoButton = document.createElement("button");
      uploadPhotoButton.setAttribute("id", "upload-photo-button");
      uploadPhotoButton.textContent = "+ Ajouter photo";
  
      const infoText = document.createElement("p");
      infoText.textContent = "jpg. png : 4mo max";
  
      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.setAttribute("id", "file-input");
      fileInput.classList.add("hidden");
  
      const photoPreview = document.createElement("img");
      photoPreview.setAttribute("id", "photo-preview");
      photoPreview.classList.add("hidden");
      photoPreview.setAttribute("alt", "Photo preview");
  
      const photoDetails = document.createElement("div");
      photoDetails.classList.add("photo-details");
  
      const titleLabel = document.createElement("label");
      titleLabel.setAttribute("for", "photo-title");
      titleLabel.textContent = "Titre";
  
      const photoTitle = document.createElement("input");
      photoTitle.setAttribute("type", "text");
      photoTitle.setAttribute("id", "photo-title");
  
      const categoryLabel = document.createElement("label");
      categoryLabel.setAttribute("for", "photo-category");
      categoryLabel.textContent = "Catégorie";
  
      const photoCategory = document.createElement("select");
      photoCategory.setAttribute("id", "photo-category");
      const option1 = document.createElement("option");
      option1.setAttribute("value", "");
      const option2 = document.createElement("option");
      option2.setAttribute("value", "hotels et restaurants");
      option2.textContent = "Hôtels & Restaurants";
      const option3 = document.createElement("option");
      option3.setAttribute("value", "appartements");
      option3.textContent = "Appartements";
      const option4 = document.createElement("option");
      option4.setAttribute("value", "objets");
      option4.textContent = "Objets";
      photoCategory.append(option1, option2, option3, option4);
  
      const hr = document.createElement("hr");
  
      const submitPhotoButton = document.createElement("button");
      submitPhotoButton.setAttribute("id", "submit-photo-button");
      submitPhotoButton.textContent = "Valider";
  
      photoUploadContainer.append(
        uploadPlaceholder,
        uploadPhotoButton,
        infoText,
        fileInput,
        photoPreview
      );
      photoDetails.append(titleLabel, photoTitle, categoryLabel, photoCategory);
      addPhotoForm.append(
        photoUploadContainer,
        photoDetails,
        hr,
        submitPhotoButton
      );
      modalHeader.append(backButton, closeButton, title);
      modalContent.append(modalHeader, addPhotoForm);
      modal.append(modalContent);
      modalContainer.append(modal);
  
      uploadPhotoButton.addEventListener("click", function () {
        fileInput.click();
      });
  
      closeButton.addEventListener("click", function () {
        const modalContainer = document.getElementById("modal-container");
        modalContainer.innerHTML = "";
      });

    //Affichage de l'image dans fileinput

  document
    .getElementById("upload-photo-button")
    .addEventListener("click", function () {
      document.getElementById("file-input").click();
    });
  document
    .getElementById("file-input")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const photoPreview = document.getElementById("photo-preview");
          photoPreview.src = e.target.result;
          photoPreview.classList.remove("hidden");
          document.querySelector(".upload-placeholder").classList.add("hidden");
          document
            .getElementById("upload-photo-button")
            .classList.add("hidden");
          document
            .querySelector(".photo-upload-container p")
            .classList.add("hidden");
        };
        reader.readAsDataURL(file);
      }
    });


   // Essai incomplet de l'envoi du projet à l'API
console.log();
  document.getElementById("submit-photo-button");
  submitPhotoButton.addEventListener("click", (event) => {
    event.preventDefault();
    
    if (!fileInput || !fileInput.files || !fileInput.files[0] || !photoTitle || !photoCategory) {
      alert("Veuillez remplir tous les champs et sélectionner une image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);
    formData.append("title", photoTitle.value);
    formData.append("category", photoCategory.value);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + authToken,
      },
      body: formData,
    })
      .then((data) => {
        console.log("Réponse de l'API :", data);
        alert("Photo ajoutée avec succès.");
        document.querySelector(".modal").classList.add("hidden");
        loadGalleryImages();
        fetchProjects();
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de la demande :", error);
      });
  });

fetchCategories();

  function loadGalleryImages() {
    fetch("http://localhost:5678/api/works")
      .then(response => response.json())
      .then(data => {
        console.log("Images de la galerie chargées :", data);
        // Logique pour afficher les images de la galerie
      })
      .catch(error => {
        console.error("Erreur lors du chargement des images de la galerie :", error);
      });
  }

      backButton.addEventListener("click", function () {
        modalContainer.innerHTML = "";
        createSuppressionModal();
      });
    }

    fetchProjects();

});
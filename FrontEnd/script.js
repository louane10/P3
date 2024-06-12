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
        categoriesMenu.innerHTML = ''; 
    
        const categories = ['Tous', 'Objets', 'Appartements', 'Hôtels & Restaurants'];
        
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
        firstButton.classList.add('active');
      }
    
      //filtrer les projets par catégorie
      function filterProjects(category, projects) {
        if (category === 'Tous') {
          displayProjects(projects);
        } else {
          const filteredProjects = projects.filter(project => project.category === category);
          displayProjects(filteredProjects);
        }
      }
    
      // catégorie active
      function setActiveCategory(activeButton) {
        const buttons = document.querySelectorAll('#categories-menu button');
        buttons.forEach(button => {
          button.classList.remove('active');
        });
        activeButton.classList.add('active');
      }
  
    fetchProjects();
  });
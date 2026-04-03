// Global variables
let allPublications = [];
let showingSelected = true;

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
  loadPublications();
  
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
  
  const toggleButton = document.getElementById('toggle-publications');
  if (toggleButton) {
    toggleButton.addEventListener('click', togglePublications);
  }
});

function loadPublications() {
  fetch('publications.json')
    .then(response => response.json())
    .then(data => {
      allPublications = data.publications;
      renderPublications(true);
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      document.getElementById('publications-sections').innerHTML = `Error loading publications.`;
    });
}

function togglePublications() {
  showingSelected = !showingSelected;
  renderPublications(showingSelected);
  
  const toggleButton = document.getElementById('toggle-publications');
  toggleButton.textContent = showingSelected ? 'Show All' : 'Show Selected';
}

// Main rendering function that splits publications into categories
function renderPublications(selectedOnly) {
  // Define our containers
  const containers = {
    'Conference': document.getElementById('conference-container'),
    'Journal': document.getElementById('journal-container'),
    'Preprint': document.getElementById('preprint-container')
  };

  // Clear all containers
  Object.values(containers).forEach(container => {
    if (container) container.innerHTML = '';
  });

  // Filter based on "Selected" state if needed
  const pubsToProcess = selectedOnly ? 
    allPublications.filter(pub => pub.selected === 1) : 
    allPublications;

  // Sort and append to respective containers
  pubsToProcess.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    const category = publication.topic; // This matches "Conference", "Journal", or "Preprint"
    
    if (containers[category]) {
      containers[category].appendChild(pubElement);
    }
  });

  // Hide category headings if they are empty
  Object.keys(containers).forEach(key => {
    const heading = containers[key].previousElementSibling;
    if (containers[key].children.length === 0) {
      heading.style.display = 'none';
    } else {
      heading.style.display = 'block';
    }
  });
}

function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';
  
  const content = document.createElement('div');
  content.className = 'pub-content';
  
  const title = document.createElement('div');
  title.className = 'pub-title';
  title.textContent = publication.title;
  content.appendChild(title);
  
  const authors = document.createElement('div');
  authors.className = 'pub-authors';
  authors.textContent = publication.authors.join(', ');
  content.appendChild(authors);
  
  const venueContainer = document.createElement('div');
  venueContainer.className = 'pub-venue-container';
  
  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = publication.venue;
  venueContainer.appendChild(venue);
  
  if (publication.award) {
    const award = document.createElement('div');
    award.className = 'pub-award';
    award.textContent = publication.award;
    venueContainer.appendChild(award);
  }
  
  content.appendChild(venueContainer);
  
  if (publication.links) {
    const links = document.createElement('div');
    links.className = 'pub-links';
    
    Object.entries(publication.links).forEach(([type, url]) => {
      if (url && url !== "#") {
        const link = document.createElement('a');
        link.href = url;
        link.textContent = `[${type.toUpperCase()}]`;
        link.style.marginRight = "10px";
        links.appendChild(link);
      }
    });
    content.appendChild(links);
  }
  
  pubItem.appendChild(content);
  return pubItem;
}

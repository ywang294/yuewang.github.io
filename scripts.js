// Global variables
let allPublications = [];

document.addEventListener('DOMContentLoaded', function() {
  loadPublications();
  
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
});

function loadPublications() {
  fetch('publications.json')
    .then(response => response.json())
    .then(data => {
      allPublications = data.publications;
      // 页面加载时就渲染好，但容器是隐藏的
      renderPublications();
    })
    .catch(error => {
      console.error('Error loading publications:', error);
      document.getElementById('publications-sections').innerHTML = `Error loading publications.`;
    });
}

// 修改后的切换逻辑：只控制展开和收起
function togglePublications() {
  const content = document.getElementById('publications-content');
  const icon = document.getElementById('toggle-icon');
  const isHidden = content.style.display === "none";

  if (isHidden) {
    content.style.display = "block";
    icon.style.transform = "rotate(90deg)"; // 箭头向下
  } else {
    content.style.display = "none";
    icon.style.transform = "rotate(0deg)";  // 箭头向右
  }
}

function renderPublications() {
  const containers = {
    'Conference': document.getElementById('conference-container'),
    'Journal': document.getElementById('journal-container'),
    'Preprint': document.getElementById('preprint-container')
  };

  Object.values(containers).forEach(container => {
    if (container) container.innerHTML = '';
  });

  // 不再过滤 selected，直接展示所有
  allPublications.forEach(publication => {
    const pubElement = createPublicationElement(publication);
    const category = publication.topic;
    
    if (containers[category]) {
      containers[category].appendChild(pubElement);
    }
  });

  // 隐藏没有内容的分类标题
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

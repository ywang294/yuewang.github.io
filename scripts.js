// 全局变量，存储论文数据
let allPublications = [];

document.addEventListener('DOMContentLoaded', function() {
  // 1. 加载数据
  loadPublications();
  
  // 2. 绑定点击事件（不再依赖 HTML 里的 onclick）
  const pubHeader = document.getElementById('publications-header');
  if (pubHeader) {
    pubHeader.addEventListener('click', function() {
      const content = document.getElementById('publications-content');
      const icon = document.getElementById('toggle-icon');
      
      // 检查当前状态（处理首次点击可能不灵的情况）
      const isHidden = content.style.display === "none" || content.style.display === "";

      if (isHidden) {
        content.style.display = "block";
        if (icon) icon.style.transform = "rotate(90deg)";
      } else {
        content.style.display = "none";
        if (icon) icon.style.transform = "rotate(0deg)";
      }
    });
  }

  // 3. 初始动画延迟
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.animationDelay = `${index * 0.1}s`;
  });
});

function loadPublications() {
  fetch('publications.json')
    .then(response => {
      if (!response.ok) throw new Error('JSON load failed');
      return response.json();
    })
    .then(data => {
      allPublications = data.publications;
      renderPublications(); // 渲染数据
    })
    .catch(error => {
      console.error('Error:', error);
      const container = document.getElementById('publications-sections');
      if (container) container.innerHTML = "Error loading publications.";
    });
}

function renderPublications() {
  const containers = {
    'Conference': document.getElementById('conference-container'),
    'Journal': document.getElementById('journal-container'),
    'Preprint': document.getElementById('preprint-container')
  };

  // 清空现有内容
  Object.values(containers).forEach(c => { if(c) c.innerHTML = ''; });

  // 填充数据
  allPublications.forEach(pub => {
    const pubElement = createPublicationElement(pub);
    const category = pub.topic;
    if (containers[category]) {
      containers[category].appendChild(pubElement);
    }
  });

  // 如果某个分类没论文，隐藏标题
  Object.keys(containers).forEach(key => {
    const heading = containers[key]?.previousElementSibling;
    if (heading && containers[key].children.length === 0) {
      heading.style.display = 'none';
    }
  });
}

function createPublicationElement(publication) {
  const pubItem = document.createElement('div');
  pubItem.className = 'publication-item';
  
  // 组装 HTML 内容
  let linksHTML = '';
  if (publication.links) {
    Object.entries(publication.links).forEach(([type, url]) => {
      if (url && url !== "#") {
        linksHTML += `<a href="${url}" style="margin-right:10px;">[${type.toUpperCase()}]</a>`;
      }
    });
  }

  pubItem.innerHTML = `
    <div class="pub-content">
      <div class="pub-title">${publication.title}</div>
      <div class="pub-authors">${publication.authors.join(', ')}</div>
      <div class="pub-venue-container">
        <div class="pub-venue">${publication.venue}</div>
        ${publication.award ? `<div class="pub-award">${publication.award}</div>` : ''}
      </div>
      <div class="pub-links">${linksHTML}</div>
    </div>
  `;
  return pubItem;
}

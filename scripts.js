document.addEventListener('DOMContentLoaded', function() {
  // 只有当页面上有论文容器时才运行加载逻辑
  if (document.getElementById('conference-container')) {
    loadPublications();
  }
});

function loadPublications() {
  fetch('publications.json')
    .then(response => response.json())
    .then(data => {
      let pubs = data.publications;
      // 按年份从新到旧排序
      pubs.sort((a, b) => {
        const yearA = parseInt(a.venue.match(/20\d{2}/)) || 0;
        const yearB = parseInt(b.venue.match(/20\d{2}/)) || 0;
        return yearB - yearA;
      });
      renderByType(pubs);
    });
}

function renderByType(pubs) {
  const containers = {
    'Conference': document.getElementById('conference-container'),
    'Journal': document.getElementById('journal-container'),
    'Preprint': document.getElementById('preprint-container')
  };

  pubs.forEach(pub => {
    const item = document.createElement('div');
    item.className = 'publication-item';
    item.style.marginBottom = "20px";
    
    let linksHTML = '';
    if (pub.links) {
        Object.entries(pub.links).forEach(([type, url]) => {
            if (url && url !== "#") linksHTML += `<a href="${url}" target="_blank" style="margin-right:10px;">[${type.toUpperCase()}]</a>`;
        });
    }

    item.innerHTML = `
      <div class="pub-title" style="font-weight:bold;">${pub.title}</div>
      <div class="pub-authors">${pub.authors.join(', ')}</div>
      <div class="pub-venue"><em>${pub.venue}</em> ${pub.award ? `<span style="color:red; font-weight:bold;">(${pub.award})</span>` : ''}</div>
      <div class="pub-links">${linksHTML}</div>
    `;
    
    if (containers[pub.topic]) {
      containers[pub.topic].appendChild(item);
    }
  });
}

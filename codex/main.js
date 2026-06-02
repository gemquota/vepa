let codexData = {};
let activeEntry = null;

async function init() {
    try {
        const response = await fetch('./entries.json');
        codexData = await response.json();
        renderEntryList();
        setupEventListeners();
    } catch (err) {
        console.error('Failed to load codex data:', err);
    }
}

function renderEntryList(filter = '') {
    const list = document.getElementById('entry-list');
    list.innerHTML = '';
    
    Object.keys(codexData).sort().forEach(key => {
        const entry = codexData[key];
        if (filter && !entry.title.toLowerCase().includes(filter.toLowerCase()) && !key.toLowerCase().includes(filter.toLowerCase())) {
            return;
        }
        
        const li = document.createElement('li');
        li.className = 'entry-item';
        if (activeEntry === key) li.classList.add('active');
        li.innerText = entry.title || key;
        li.onclick = () => selectEntry(key);
        list.appendChild(li);
    });
}

function selectEntry(key) {
    activeEntry = key;
    const entry = codexData[key];
    if (!entry) return;
    
    document.getElementById('empty-state').classList.add('hidden');
    const view = document.getElementById('entry-view');
    view.classList.remove('hidden');
    
    document.getElementById('entry-title').innerText = entry.title || key;
    document.getElementById('entry-summary').innerText = entry.summary || '';
    document.getElementById('entry-body').innerText = entry.content || '';
    
    const tagsContainer = document.getElementById('entry-tags');
    tagsContainer.innerHTML = '';
    (entry.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.innerText = tag;
        tagsContainer.appendChild(span);
    });
    
    renderEntryList(document.getElementById('codex-search').value);
}

function setupEventListeners() {
    document.getElementById('codex-search').oninput = (e) => {
        renderEntryList(e.target.value);
    };
    
    // Check for URL parameters to open a specific entry
    const params = new URLSearchParams(window.location.search);
    const entryParam = params.get('entry');
    if (entryParam && codexData[entryParam]) {
        selectEntry(entryParam);
    }
}

init();

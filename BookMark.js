let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
let editIndex = null;

const titleInput = document.getElementById('titleInput');
const urlInput = document.getElementById('urlInput');
const tagInput = document.getElementById('tagInput');
const saveBtn = document.getElementById('saveBtn');
const saveBtnText = document.getElementById('saveBtnText');
const cancelBtn = document.getElementById('cancelBtn');
const searchInput = document.getElementById('searchInput');
const bookmarkList = document.getElementById('bookmarkList');
const countBadge = document.getElementById('countBadge');
const formTitle = document.getElementById('formTitle');

function renderBookmarks(filterText = '') {
    bookmarkList.innerHTML = '';
    
    const filtered = bookmarks.filter(b => 
        b.title.toLowerCase().includes(filterText.toLowerCase()) || 
        b.tag.toLowerCase().includes(filterText.toLowerCase())
    );

    countBadge.textContent = filtered.length;

    if (filtered.length === 0) {
        bookmarkList.innerHTML = `<div style="grid-column: 1/-1; text-align:center; color:#64748b; padding:40px;">No bookmarks found.</div>`;
        return;
    }

    filtered.forEach((b, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-header">
                <h4>${b.title}</h4>
                <span class="tag">#${b.tag || 'general'}</span>
            </div>
            <div class="card-actions">
                <a href="${b.url}" target="_blank" class="btn-visit"><i class="fa-solid fa-arrow-up-right-from-square"></i> Visit 🔗</a>
                <button onclick="editBookmark(${index})" class="btn-edit"><i class="fa-solid fa-pen"></i> Edit ✏</button>
                <button onclick="deleteBookmark(${index})" class="btn-delete"><i class="fa-solid fa-trash"></i> Delete 🗑</button>
            </div>
        `;
        bookmarkList.appendChild(card);
    });
}

function saveBookmark() {
    const title = titleInput.value.trim();
    let url = urlInput.value.trim();
    const tag = tagInput.value.trim();

    if (!title || !url) {
        alert('Please fill in Title and URL!');
        return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    if (editIndex !== null) {
        bookmarks[editIndex] = { title, url, tag };
        editIndex = null;
    } else {
        bookmarks.push({ title, url, tag });
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    resetInputs();
    renderBookmarks();
}

window.editBookmark = function(index) {
    editIndex = index;
    titleInput.value = bookmarks[index].title;
    urlInput.value = bookmarks[index].url;
    tagInput.value = bookmarks[index].tag;

    formTitle.textContent = 'Edit Bookmark';
    saveBtnText.textContent = 'Update';
    cancelBtn.classList.remove('hidden');
    titleInput.focus();
};

window.deleteBookmark = function(index) {
    bookmarks.splice(index, 1);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    renderBookmarks();
};

function resetInputs() {
    titleInput.value = '';
    urlInput.value = '';
    tagInput.value = '';
    editIndex = null;
    formTitle.textContent = 'Add New Bookmark';
    saveBtnText.textContent = 'Save Bookmark';
    cancelBtn.classList.add('hidden');
}

saveBtn.addEventListener('click', saveBookmark);
cancelBtn.addEventListener('click', resetInputs);
searchInput.addEventListener('input', (e) => renderBookmarks(e.target.value));

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        saveBookmark();
    } else if (e.key === 'Escape') {
        resetInputs();
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        searchInput.focus();
    }
});

renderBookmarks();

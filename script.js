const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');


let bookmarks=[];

// Show Modal, Focus on Input
function showModal(){
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Validate Form

function validate(nameValue, urlValue){
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if (!nameValue || !urlValue) {
        alert('Please submit values for Both fields ');
        return false
    }
    if(!urlValue.match(regex)){
        alert('Please provide a valid web adress');
        return false;
    }
    // Valid
    return true
}
// Delete bookmark

function deleteBookmark(url){
    
    bookmarks.forEach((bookmark, i) => {
        if(bookmark.url === url){
            bookmarks.splice(i,1);
        }
    });
    // update bookmark array in local storage re-populate the dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// Build bookmarks
function buildBookmarks(){
    bookmarksContainer.textContent='';
    bookmarks.forEach((bookmark)=> {
        const {name, url} = bookmark;
        // item
        const item = document.createElement('div');
        item.classList.add('item');
        // Close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fas', 'fa-times');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        // Favicon/ link Container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        // Favicon
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'Favicon');
        //Link
        const link = document.createElement('a');
        link.setAttribute('href', `${url}`);
        link.setAttribute('target', '_blank');
        link.textContent= name;
        // Appends to bookmark container
        linkInfo.append(favicon, link);
        item.append(closeIcon, linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

// Fetch bookmarks
function fetchBookmarks(){
    // get bookmarks from local storage if available
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    }else{
        bookmarks = [
            {
                name: 'pape',
                url: 'https://www.github.com/papesaliouka'
            }
        ]; 
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// handle Data from form
function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://, https://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)){
        return false
    }
    const bookmark = {
        name: nameValue,
        url: urlValue
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Modal Event listener
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e)=> (e.target === modal ? modal.classList.remove('show-modal') : false));

// Event listener 
bookmarkForm.addEventListener('submit', storeBookmark)


// on laod
fetchBookmarks();
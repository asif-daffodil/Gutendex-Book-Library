// Select DOM elements
const bookList = document.getElementById('bookList');
const searchBar = document.getElementById('searchBar');
const genreFilter = document.getElementById('genreFilter');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageNumber = document.getElementById('pageNumber');
const loadingSpinner = document.getElementById('loading'); // Loading spinner element

let currentPage = 1;
let nextPageUrl = null;
let prevPageUrl = null;
let booksData = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const baseUrl = 'https://gutendex.com/books/?';

// Show the loading spinner
function showLoading() {
    loadingSpinner.style.display = 'block';
}

// Hide the loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Fetch books from the API
async function fetchBooks(url = baseUrl) {
    try {
        showLoading();  // Show loading spinner while fetching
        const response = await fetch(url);
        const data = await response.json();
        booksData = data.results;
        nextPageUrl = data.next;  // Store the next page URL
        prevPageUrl = data.previous;  // Store the previous page URL

        // Enable/disable pagination buttons based on availability of pages
        prevPageBtn.disabled = !prevPageUrl;
        nextPageBtn.disabled = !nextPageUrl;

        displayBooks();
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        hideLoading();  // Hide loading spinner after data has been fetched
    }
}

// Display books in the DOM
function displayBooks() {
    bookList.innerHTML = '';  // Clear the book list
    booksData.forEach(book => {
        const isLiked = wishlist.includes(book.id);
        const genres = book.bookshelves.join(', ');
        const card = `
            <div class="book-card">
                <img src="${book.formats['image/jpeg'] || ''}" alt="${book.title}">
                <h3>${book.title}</h3>
                <p>Author: ${book.authors.map(author => author.name).join(', ')}</p>
                <p>Genres: ${genres}</p>
                <button class="wishlist-btn ${isLiked ? 'liked' : ''}" data-id="${book.id}">${isLiked ? '❤️' : '♡'}</button>
            </div>
        `;
        bookList.innerHTML += card;
    });

    attachWishlistEvents();
}

// Add event listeners to wishlist buttons
function attachWishlistEvents() {
    const buttons = document.querySelectorAll('.wishlist-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = parseInt(e.target.dataset.id);
            if (wishlist.includes(bookId)) {
                wishlist = wishlist.filter(id => id !== bookId);
            } else {
                wishlist.push(bookId);
            }
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            displayBooks();
        });
    });
}

// Pagination controls - Previous Page
prevPageBtn.addEventListener('click', () => {
    if (prevPageUrl) {
        fetchBooks(prevPageUrl);  // Fetch the previous page using prevPageUrl
        currentPage--;  // Decrement the current page count
        pageNumber.textContent = currentPage;
    }
});

// Pagination controls - Next Page
nextPageBtn.addEventListener('click', () => {
    if (nextPageUrl) {
        fetchBooks(nextPageUrl);  // Fetch the next page using nextPageUrl
        currentPage++;  // Increment the current page count
        pageNumber.textContent = currentPage;
    }
});

// Real-time search by title
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const searchUrl = `${baseUrl}search=${encodeURIComponent(searchTerm)}`;
    fetchBooks(searchUrl);
});

// Filter by genre
genreFilter.addEventListener('change', (e) => {
    const genre = e.target.value;
    const genreUrl = genre ? `${baseUrl}topic=${encodeURIComponent(genre)}` : baseUrl;
    fetchBooks(genreUrl);
});

// Initialize the page with the first set of books
fetchBooks();

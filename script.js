// Select DOM elements
const bookList = document.getElementById('bookList');
const searchBar = document.getElementById('searchBar');
const genreFilter = document.getElementById('genreFilter');
const paginationContainer = document.querySelector('.pagination'); // Pagination container
const loadingSpinner = document.getElementById('loading'); // Loading spinner element

let currentPage = 1;
let totalPages = 1; // Total number of pages
let booksData = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const baseUrl = 'https://gutendex.com/books/?page=';

// Show the loading spinner
function showLoading() {
    loadingSpinner.style.display = 'block';
}

// Hide the loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Fetch books from the API
async function fetchBooks(page = 1, url = `${baseUrl}${page}`) {
    try {
        showLoading();  // Show loading spinner while fetching
        const response = await fetch(url);
        const data = await response.json();
        booksData = data.results;
        totalPages = Math.ceil(data.count / 32);  // Assuming 32 books per page

        displayBooks();
        createPagination(totalPages);
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

// Create numbered pagination buttons
function createPagination(totalPages) {
    paginationContainer.innerHTML = ''; // Clear previous pagination
    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.classList.add('page-btn');
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => goToPage(i)); // Add event listener to each button
        paginationContainer.appendChild(pageBtn);
    }
}

// Go to a specific page when clicked
function goToPage(page) {
    if (page !== currentPage) {
        currentPage = page;
        fetchBooks(currentPage); // Fetch the books for the selected page
    }
}

// Real-time search by title
searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const searchUrl = `${baseUrl}search=${encodeURIComponent(searchTerm)}`;
    fetchBooks(currentPage, searchUrl);
});

// Filter by genre
genreFilter.addEventListener('change', (e) => {
    const genre = e.target.value;
    const genreUrl = genre ? `${baseUrl}topic=${encodeURIComponent(genre)}` : baseUrl;
    fetchBooks(currentPage, genreUrl);
});

// Initialize the page with the first set of books
fetchBooks();

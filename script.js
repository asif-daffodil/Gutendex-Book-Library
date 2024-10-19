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
        createPagination(totalPages, currentPage); // Create pagination with ellipses
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

// Create pagination with ellipses
function createPagination(totalPages, currentPage) {
    paginationContainer.innerHTML = ''; // Clear previous pagination
    const maxVisiblePages = 5; // Number of pages to show around the current page

    // Add "First" page button
    if (currentPage > 1) {
        const firstPageBtn = createPageButton(1);
        paginationContainer.appendChild(firstPageBtn);
    }

    // Add "..." before current pages if needed
    if (currentPage > maxVisiblePages) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
    }

    // Show pages around the current page
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageButton(i);
        paginationContainer.appendChild(pageBtn);
    }

    // Add "..." after current pages if needed
    if (endPage < totalPages - 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
    }

    // Add "Last" page button
    if (currentPage < totalPages) {
        const lastPageBtn = createPageButton(totalPages);
        paginationContainer.appendChild(lastPageBtn);
    }
}

// Helper function to create individual page buttons
function createPageButton(page) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = page;
    pageBtn.classList.add('page-btn');
    if (page === currentPage) {
        pageBtn.classList.add('active');
    }
    pageBtn.addEventListener('click', () => goToPage(page)); // Add event listener to each button
    return pageBtn;
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

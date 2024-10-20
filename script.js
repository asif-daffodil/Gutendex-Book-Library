// Select DOM elements
const bookList = document.getElementById('bookList');
const searchBar = document.getElementById('searchBar');
const genreFilter = document.getElementById('genreFilter');
const paginationContainer = document.querySelector('.pagination'); // Pagination container
const loadingSpinner = document.getElementById('loading'); // Loading spinner element

let currentPage = 1;
let totalPages = 1; // Total number of pages
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
const baseUrl = 'https://gutendex.com/books/';

// Show the loading spinner
function showLoading() {
    loadingSpinner.style.display = 'block';
}

// Hide the loading spinner
function hideLoading() {
    loadingSpinner.style.display = 'none';
}

// Fetch books per page
async function fetchBooks(page = 1, query = '') {
    try {
        showLoading();  // Show loading spinner while fetching
        const response = await fetch(`${baseUrl}?page=${page}${query}`);
        const data = await response.json();
        totalPages = Math.ceil(data.count / 32);  // Calculate total pages based on the count

        displayBooks(data.results);
        createPagination(totalPages, currentPage); // Create pagination dynamically
    } catch (error) {
        console.error("Error fetching books:", error);
    } finally {
        hideLoading();  // Hide loading spinner after data has been fetched
    }
}

// Display books in the DOM
function displayBooks(books) {
    bookList.innerHTML = '';  // Clear the book list
    books.forEach(book => {
        const isLiked = wishlist.includes(book.id);
        // Clean genres by removing "Browsing:" prefix
        const genres = book.bookshelves
            .map(genre => genre.replace(/Browsing:\s*/g, '')) // Remove "Browsing:" from genre names
            .join(', ');
        const authors = book.authors.map(author => author.name).join(', '); // Handle multiple authors
        const bookCover = book.formats['image/jpeg'] || ''; // Fetch the cover image if available

        const card = `
            <div class="book-card">
                <img src="${bookCover}" class="lazyload" alt="${book.title}">
                <h3>${book.title}</h3>
                <p><strong>Author(s):</strong> ${authors}</p>
                <p><strong>Genres:</strong> ${genres}</p>
                <p><strong>ID:</strong> ${book.id}</p>
                <button class="wishlist-btn ${isLiked ? 'liked' : ''}" data-id="${book.id}">
                    ${isLiked ? '❤️' : '♡'}
                </button>
            </div>
        `;
        bookList.innerHTML += card;
    });

    attachWishlistEvents(); // Reattach event listeners for wishlist buttons
}

document.addEventListener("DOMContentLoaded", function() {
    const lazyImages = document.querySelectorAll(".lazyload");

    const lazyLoad = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;  // Set the real image source
                observer.unobserve(img);  // Stop observing this image
            }
        });
    };

    const observer = new IntersectionObserver(lazyLoad);

    lazyImages.forEach(img => {
        observer.observe(img);
    });
});



// Add event listeners to wishlist buttons
function attachWishlistEvents() {
    const buttons = document.querySelectorAll('.wishlist-btn');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const bookId = parseInt(e.target.dataset.id);  // Get book ID from button

            // Toggle wishlist state
            if (wishlist.includes(bookId)) {
                // Remove from wishlist
                wishlist = wishlist.filter(id => id !== bookId);
                e.target.textContent = '♡';  // Change the button icon to "unliked"
                e.target.classList.remove('liked');  // Remove 'liked' class
            } else {
                // Add to wishlist
                wishlist.push(bookId);
                e.target.textContent = '❤️';  // Change the button icon to "liked"
                e.target.classList.add('liked');  // Add 'liked' class
            }

            // Save updated wishlist to localStorage
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        });
    });
}


// Create pagination with ellipses
function createPagination(totalPages, currentPage) {
    paginationContainer.innerHTML = ''; // Clear previous pagination
    const maxVisiblePages = 5; // Number of pages to show around the current page

    // Always show "Page 1"
    const firstPageBtn = createPageButton(1);
    paginationContainer.appendChild(firstPageBtn);

    // Add "..." before the current pages if the gap is large (e.g., more than 2 pages between 1 and currentPage)
    if (currentPage > 3) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
    }

    // Show pages around the current page (2 pages before and after)
    const startPage = Math.max(2, currentPage - 2); // Start from page 2 to avoid duplicating page 1
    const endPage = Math.min(totalPages - 1, currentPage + 2); // End before the last page to avoid duplicating

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageButton(i);
        paginationContainer.appendChild(pageBtn);
    }

    // Add "..." after the current pages if needed
    if (currentPage < totalPages - 3) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);
    }

    // Always show the "Last" page
    if (totalPages > 1) {
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
    const searchUrl = `&search=${encodeURIComponent(searchTerm)}`;
    fetchBooks(currentPage, searchUrl);
});

// Filter by genre
genreFilter.addEventListener('change', (e) => {
    const genre = e.target.value;
    const genreUrl = genre ? `&topic=${encodeURIComponent(genre)}` : '';
    fetchBooks(currentPage, genreUrl); // Fetch books based on the selected genre
});

// Initialize the page with the first set of books
fetchBooks();

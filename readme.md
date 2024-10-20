Below is a `README.md` file that describes how your project works, including setup, features, and instructions for using the code you provided.

---

# Book Listing and Wishlist App

This is a web application that fetches books from the **Gutendex API** and allows users to:
- Browse through books with **pagination**.
- Search for books by title using a **real-time search** feature.
- Filter books by **genre**.
- Add books to a **wishlist**, which is stored in `localStorage`.
- View book details on a separate **book detail page**.
- Use **lazy loading** for images to improve performance.
- Persist **search and filter preferences** across page reloads using `localStorage`.

## Features
- **Book List with Pagination**: Users can browse books page by page.
- **Real-time Search**: Users can search for books by title, and results are fetched in real-time.
- **Genre Filter**: Users can filter books based on genres, and the filtered results will be displayed.
- **Wishlist**: Users can add or remove books from their wishlist, which is stored in `localStorage` and persists between sessions.
- **Book Details**: Each book links to a detail page with more information about the book, including author(s), genres, download count, etc.
- **Lazy Loading**: Book cover images are loaded lazily to improve page load times.
- **Persisted Preferences**: Search and filter preferences are saved in `localStorage`, so when a user reloads the page, their preferences are applied automatically.

## Setup and Installation

1. Clone this repository or download the files.
    ```bash
    git clone https://github.com/your-repo/book-listing-app.git
    ```

2. Open the `index.html` file in your web browser to view the book listing page.

3. For development, you can use a simple local web server to run the project:
    - If you have Python installed, you can run the following command in the project directory:
    ```bash
    python -m http.server
    ```
    Then, open your browser and go to `http://localhost:8000`.

## Project Structure

```bash
.
├── index.html        # The homepage that lists books and handles search/filter
├── book.html         # The detail page for individual books
├── style.css         # CSS file for styling the application
├── app.js            # JavaScript logic for fetching books, wishlist, and pagination
└── README.md         # This README file
```

### API
This app uses the **Gutendex API** to fetch books. The API provides book data including title, author, genre, cover image, and more.

Example API request:
```
https://gutendex.com/books/?page=1&search=dickens&topic=fiction
```

## Usage

### Homepage (`index.html`)

- The homepage shows a list of books fetched from the **Gutendex API**.
- Users can:
  - **Search for books** using the search bar. The search term is applied in real-time, fetching filtered results from the API.
  - **Filter books by genre** using the dropdown menu.
  - **Add books to their wishlist** by clicking the heart icon (`♡` or `❤️`). Wishlisted books are saved in `localStorage` and persist across sessions.
  - **View book details** by clicking on a book title or cover. This takes them to the `book.html` page, where they can see more information about the book.

### Book Detail Page (`book.html`)

- The detail page shows more information about the selected book, including:
  - Title
  - Author(s) (with birth and death years, if available)
  - Genres
  - Download count
  - Language(s)
  - Subjects
  - Copyright status (if available)
- Users can also add or remove the book from their wishlist directly from the detail page.
- The **Back to Home** button lets users return to the homepage.

### Wishlist
- The wishlist feature stores books in `localStorage` and allows users to mark/unmark books as wishlisted.
- The heart icon (`♡` for unliked and `❤️` for liked) shows the wishlist status of each book.

### Lazy Loading
- Images are lazily loaded to improve performance, meaning book cover images are only loaded when they are about to appear in the viewport.

### Persisted Preferences
- The user’s **search term** and **selected genre** are saved in `localStorage`, and when the page is reloaded, the search and filter preferences are automatically applied.

## Customization

### Adding More Genres
- To add more genres to the genre filter, simply update the `<select>` element in `index.html`:
  ```html
  <select id="genreFilter">
      <option value="">Filter by genre</option>
      <option value="Science Fiction">Science Fiction</option>
      <option value="Romance">Romance</option>
      <!-- Add more genres as needed -->
  </select>
  ```

### Styles
- You can modify `style.css` to change the look and feel of the application.

## Known Issues
- The **Gutendex API** may have a limit on the number of requests, so ensure not to overload the API with unnecessary requests.
- Make sure the books have valid cover images. Some books may not have an available image, and handling such cases gracefully is recommended.

## Future Enhancements
- Add a dedicated **wishlist page** that lists only wishlisted books.
- Improve the user experience with more advanced pagination controls (e.g., load more button).
- Add smoother **animations** for wishlist interactions.

## License

This project is open-source. You can use, modify, and distribute it freely.
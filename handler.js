const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * Handler to add a new book
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Generate unique ID for the new book
  const id = nanoid(16);

  // Determine if the book is finished based on readPage and pageCount
  const finished = pageCount === readPage;

  // Get current timestamp for insertion and update
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Create new book object
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  // Validate the payload
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Failed to add book. Please provide a book name.',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Failed to add book. readPage cannot be greater than pageCount.',
    });
    response.code(400);
    return response;
  }

  // Add the new book to the books array
  books.push(newBook);

  // Return success response
  const response = h.response({
    status: 'success',
    message: 'Book added successfully.',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

/**
 * Handler to get all books
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // Filter books based on query parameters
  let filteredBooks = books;
  if (name) {
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }
  if (reading !== undefined) {
    filteredBooks = books.filter((book) => book.reading === (reading === '1'));
  }
  if (finished !== undefined) {
    filteredBooks = books.filter((book) => book.finished === (finished === '1'));
  }

  // Map books to required format
  const formattedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  // Return success response with filtered books
  const response = h.response({
    status: 'success',
    data: {
      books: formattedBooks,
    },
  });
  response.code(200);
  return response;
};

/**
 * Handler to get book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Find book by ID
  const book = books.find((b) => b.id === bookId);

  // Return success response if book is found, otherwise return fail response
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book,
      },
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Book not found.',
  });
  response.code(404);
  return response;
};

/**
 * Handler to edit book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Find index of book in books array
  const index = books.findIndex((book) => book.id === bookId);

  // Validate payload
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Failed to update book. Please provide a book name.',
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Failed to update book. readPage cannot be greater than pageCount.',
    });
    response.code(400);
    return response;
  }

  // Update book if found, otherwise return fail response
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };

    const response = h.response({
      status: 'success',
      message: 'Book updated successfully.',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Book not found.',
  });
  response.code(404);
  return response;
};

/**
 * Handler to delete book by id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Find index of book in books array
  const index = books.findIndex((book) => book.id === bookId);

  // Delete book if found, otherwise return fail response
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Book deleted successfully.',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Book not found.',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
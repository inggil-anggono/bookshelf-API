const { nanoid } = require('nanoid');
const books = require('./books');

/**
 * Handler untuk menambahkan buku baru
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Generate unique ID untuk buku baru
  const id = nanoid(16);

  // Tentukan apakah buku telah selesai berdasarkan readPage dan pageCount
  const finished = pageCount === readPage;

  // Dapatkan timestamp saat ini untuk penambahan dan pembaruan
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // Buat objek buku baru
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

  // Validasi payload
  if (!name) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. Mohon isi nama buku"
  });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount"
  });
    response.code(400);
    return response;
  }

  // Tambahkan buku baru ke dalam array books
  books.push(newBook);

  // Return respons sukses
  const response = h.response({
    "status": "success",
    "message": "Buku berhasil ditambahkan",
    "data": {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

/**
 * Handler untuk mendapatkan semua buku
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  // Filter buku berdasarkan query parameters
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

  // Format buku sesuai dengan yang dibutuhkan
  const formattedBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  // Return respons sukses dengan buku yang telah difilter
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
 * Handler untuk mendapatkan buku berdasarkan id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Cari buku berdasarkan ID
  const book = books.find((b) => b.id === bookId);

  // Return respons sukses jika buku ditemukan, jika tidak kembalikan respons gagal
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
    "status": "fail",
    "message": "Buku tidak ditemukan"
});
  response.code(404);
  return response;
};

/**
 * Handler untuk mengedit buku berdasarkan id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Temukan index buku dalam array books
  const index = books.findIndex((book) => book.id === bookId);

  // Validasi payload
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  if (!name) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. Mohon isi nama buku"
  });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      "status": "fail",
      "message": "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount"
  });
    response.code(400);
    return response;
  }

  // Perbarui buku jika ditemukan, jika tidak kembalikan respons gagal
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
      "status": "success",
      "message": "Buku berhasil diperbarui"
  });
    response.code(200);
    return response;
  }

  const response = h.response({
    "status": "fail",
    "message": "Gagal memperbarui buku. Id tidak ditemukan"
});
  response.code(404);
  return response;
};

/**
 * Handler untuk menghapus buku berdasarkan id
 * @param {*} request
 * @param {*} h
 * @returns {Object} response
 */
const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  // Temukan index buku dalam array books
  const index = books.findIndex((book) => book.id === bookId);

  // Hapus buku jika ditemukan, jika tidak kembalikan respons gagal
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      "status": "success",
      "message": "Buku berhasil dihapus"
  });
    response.code(200);
    return response;
  }

  const response = h.response({
    "status": "fail",
    "message": "Buku gagal dihapus. Id tidak ditemukan"
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

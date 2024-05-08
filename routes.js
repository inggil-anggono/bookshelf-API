const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
} = require('./handler');

// Daftar rute API
const routes = [
  // Rute untuk menambahkan buku baru
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  // Rute untuk mendapatkan semua buku
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  // Rute untuk mendapatkan buku berdasarkan ID
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler,
  },
  // Rute untuk mengedit buku berdasarkan ID
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookByIdHandler,
  },
  // Rute untuk menghapus buku berdasarkan ID
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookByIdHandler,
  },
];

// Ekspor daftar rute untuk digunakan di aplikasi lain
module.exports = routes;

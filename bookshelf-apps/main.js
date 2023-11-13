const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];
const RENDER_EVENT = 'render-books'
const SAVED_EVENT = 'save-books'
const SEARCH_EVENT = 'search-books'

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function() {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  incompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
  completeBookshelfList.innerHTML = '';
 
  for (const book of books) {
    const bookElement = makeBook(book);

    if (book.isComplete === false) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);   }
  }
})

document.addEventListener(SEARCH_EVENT, function() {
  const inputSearch = document.getElementById('searchBookTitle').value;

  if(inputSearch === '') {
    document.dispatchEvent(new Event(RENDER_EVENT));
    return;
  } else {
    const filterBook = books.filter((book) => {
      return book.title.toLowerCase().includes(inputSearch.toLowerCase());
    });

    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

  const completeBookshelfList = document.getElementById('completeBookshelfList');
     completeBookshelfList.innerHTML = '';
 
  for (const book of filterBook) {
    const bookElement = makeBook(book);

    if (book.isComplete === false) {
      incompleteBookshelfList.append(bookElement);
    } else {
      completeBookshelfList.append(bookElement);   }
  }
    
  }
})

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', function() {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
  const formInputBook = document.getElementById('inputBook');
  formInputBook.addEventListener('submit', function(event) {
    event.preventDefault();
    addBook();
  });

  const formSearchBook = document.getElementById('searchBook');
  formSearchBook.addEventListener('submit', function(event) {
    event.preventDefault();
    document.dispatchEvent(new Event(SEARCH_EVENT));
  });
})

function addBook(){
  const bookTitle = document.getElementById('inputBookTitle').value
  const bookAuthor = document.getElementById('inputBookAuthor').value
  const bookYear = document.getElementById('inputBookYear').value
  const bookIsComplete = document.getElementById('inputBookIsComplete').checked

  const book = generateBook(bookTitle, bookAuthor, bookYear, bookIsComplete);
  books.push(book);
  
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData()
};

function generateBook(title, author, year, isComplete) {
  return {
    id: +new Date(),
    title,
    author,
    year: Number(year),
    isComplete,
  };
}

function makeBook(bookObject){
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = bookObject.title;
  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = bookObject.author;
  const bookYear = document.createElement('p');
  bookYear.innerText = bookObject.year;

  const action = document.createElement('div');
  action.classList.add('action');

  if(bookObject.isComplete){
    const uncompleteButton = document.createElement('button');
    uncompleteButton.innerText = 'Belum selesai dibaca';
    uncompleteButton.classList.add('green');

    action.append(uncompleteButton);

    uncompleteButton.addEventListener('click', function(event){
      undoBookFromCompleted(bookObject.id);
    });
  } else {
    const completeButton = document.createElement('button');
    completeButton.innerText = 'Selesai dibaca';
    completeButton.classList.add('green');

    action.append(completeButton);

    completeButton.addEventListener('click', function(event){
      addBookToCompleted(bookObject.id);
    });
  }

  const deleteButton = document.createElement('button');
  deleteButton.innerText = 'Hapus buku';
  deleteButton.classList.add('red');

  action.append(deleteButton);

  deleteButton.addEventListener('click', function(event){
    const confirmation = confirm('Apakah anda yakin ingin menghapus buku ini?');
    if(!confirmation) return;
    removeBookFromCompleted(bookObject.id);
  });

  
  const bookItem = document.createElement('article');
  bookItem.classList.add('book_item');
  bookItem.append(bookTitle, bookAuthor, bookYear, action);

  return bookItem;
}

function addBookToCompleted(bookId){
  const book = findBook(bookId);
  book.isComplete = true;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isComplete = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId){
  const bookIndex = findBookIndex(bookId);
  books.splice(bookIndex, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

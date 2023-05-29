import './App.css';
import { useState, useEffect } from 'react';
import BooksList from '../booksList/booksList';
import AddBook from '../addBook/addBook';
import useFirestore from '../../services/useFirestore';

function App() {
  
  const [books, setBooks] = useState([]);//array of books
  const {getBooks, deleteBook} = useFirestore();

  useEffect(() => {
    onRequest();
  }, [])

  //do a request to the server to get books and update books' array
  const onRequest = async () => {
      await getBooks()
          .then(newBooks => {setBooks(newBooks)});      
  }

  //do a request to the server to delete book and update books' array
  const onBookDeleted = (id) => {
    deleteBook(id).then(onRequest());
  }

  return (
      <div className="app">
        <div className="addBook">
          <AddBook onBookAdded={onRequest}/>
        </div>    
        <div className="bookList">
          <BooksList books={books} onBookDeleted={onBookDeleted}/>
        </div>  
      </div>
  );
}

export default App;
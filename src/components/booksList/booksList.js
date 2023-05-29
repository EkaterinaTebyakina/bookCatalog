import './booksList.css';
import useFirestore from '../../services/useFirestore';
import {useState, useEffect} from 'react'
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';

const BooksList = (props) => {

    let books = props.books;
    const {loading, error} = useFirestore();

    //func for creating a map from an book's array
    const setToMap = (map, book, key) => {

        if (map.has(key)) {

            map.set(key, [...map.get(key), book]);

        } else {

            map.set(key, [book]);
        }
    }

    //creating a map where keys are year of book's publication
    const groupBooksByYear = () => {

        if (books) {

            let map = new Map();

            books
            .sort((current, next) => { 
                if (current.publicationYear && next.publicationYear) {      //sort years in descending order
                    return next.publicationYear - current.publicationYear;  //if year is incorrect, book goes to end
                } else if (!current.publicationYear) {
                    return 1;
                } else {
                    return -1;
                }
            })
            .forEach(book => {

                if (book.publicationYear) { //grouping by year

                    setToMap(map, book, book.publicationYear);

                } else {

                    setToMap(map, book, "Год публикации неизвестен");

                }
            })

            //sort books by title

            for (let year of map.keys()) {

                map.set(year, map.get(year).sort((cur, next) => cur.title > next.title ? 1 : -1))
            }

            return map;
        }
        
    }

    //find book for recomendation
    const findGoodBook = () => {

        if (books) {

            //filter by year
            let filteredByYear = books.filter(book => new Date().getFullYear() - book.publicationYear >= 3);

            if (filteredByYear.length > 0) {
                //group by rating
                let map = new Map();
                filteredByYear.forEach(book => {

                    if (book.rating) {
                        setToMap(map, book, book.rating);
                    } else {
                        setToMap(map, book, 0);
                    }
                })

                //select books suitable for the year and with a max rating
                let maxRating = 0;
                maxRating = Math.max(...map.keys());
                let recBooks = map.get(maxRating);

                //if there are several such books, we randomly choose one of them
                if (map.get(maxRating).length > 1) {

                    let randomID = Math.floor(Math.random() * (recBooks.length - 1));
                    return [recBooks[randomID]];

                } else {
                    return [recBooks[0]];
                }

            }
        }
    }

    //passing the id in app component
    const onDeleteBook = (id) => {
        props.onBookDeleted(id)
    }

    //render book
    function renderItem(book,isRec) {

        return (
            <li className="books_item" key={book.id}>
                <div className="book_title"><span>Название: </span>{book.title}</div>
                <ul className="books_grid">
                    <span>Автор/ы: </span>
                    {book.authors.join(', ')}
                </ul>
                {isRec ? <div className="book_year"><span>Год публикации: </span>{book.publicationYear}</div> : null}
                <div className="book_rating"><span>Рейтинг: </span>{book.rating}</div>
                {book.ISBN ? <div className="book_ISBN"><span>ISBN: </span>{book.ISBN}</div> : null}
                <div className='deleteBtn' onClick={(e) => onDeleteBook(book.id)}>удалить</div>
            </li>
        )
    }

    //render one point of list (for example point "2021" 
    //where the nested list of books published this year is located)
    function renderPointOfList(key, books, isRec) {

        const elements = books.map(book => renderItem(book, isRec));

        return (
            <li key={key} className='pointOfList'><span>{key}</span> 
                <ul className="groupBooks">
                    {elements}
                </ul>
            </li>
        )

    }

    //render the whole list
    function renderList(booksMap, isRec) {
        if (books) {

            let elements = [];

            for (let year of booksMap.keys()) {

                elements.push(renderPointOfList(year, booksMap.get(year)))
            }

            return elements;
        }
    }


    const recBook = findGoodBook() ? renderPointOfList("Рекомендуемая книга", findGoodBook(), true) : null;
    const elements = renderList(groupBooksByYear(), false);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;

    return (
        <div className="books__list">
            <ul className="books__grid">
                {recBook}
                {elements}
                {errorMessage}
                {spinner}  
            </ul>
        </div>
    )
}

export default BooksList;
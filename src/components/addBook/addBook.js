import './addBook.css';
import useFirestore from '../../services/useFirestore';
import { Formik, Field, FieldArray } from "formik";
import ErrorMessage from '../errorMessage/ErrorMessage';
import {SignupSchema} from '../../utils/validation'

// "Formik" was used for this component
const AddBook = (props) => {

    const {error, setBook} = useFirestore();
    const errorMessage = error ? <ErrorMessage/> : null;

    return (
        <div>
            <Formik 
            initialValues={{ title: '', publicationYear: new Date().getFullYear(), rating:0, ISBN:'', firstAuthor:'', authors: []}}
            validationSchema={SignupSchema}
            onSubmit={(values, actions) => {
                setTimeout(() => {

                values.authors.push(values.firstAuthor);
                delete values.firstAuthor;
                if (values.ISBN === '') delete values.ISBN;

                setBook(values)

                values.authors = []
                props.onBookAdded()
                actions.resetForm();
                
                actions.setSubmitting(false);
                }, 1000);
            
                
            }}
            >
            {props => (
                <form onSubmit={props.handleSubmit}>
                <label htmlFor="title">Название: </label>
                <input
                    id="title"
                    name="title"
                    type="text"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.title}
                />
                {props.errors.title && props.touched.title ? (<div>{props.errors.title}</div>) : null}
                <label htmlFor="authors">Авторы: </label>
                <div id='firstAuthor'>
                    <input
                        id="firstAuthor"
                        name="firstAuthor"
                        type="text"
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.firstAuthor}
                    />
                </div>
                {props.errors.firstAuthor && props.touched.firstAuthor 
                ? (<div>{props.errors.firstAuthor}</div>) : null}
                <FieldArray
                    id="authors"
                    name="authors"
                    render={arrayHelpers => (
                    <div>
                        {props.values.authors && props.values.authors.length > 0 ? (
                        props.values.authors.map((author, index) => (
        
                            (<div key={index} className='clearfix'>
                                <Field name={`authors.${index}`} className="author"/>
                                <button
                                    className='authorBtn'
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)} // remove an author from the list
                                >
                                    -
                                </button>
                                <button
                                    className='authorBtn'
                                    type="button"
                                    onClick={() => arrayHelpers.insert(index, '')} // insert an empty string at a position
                                >
                                    +
                                </button>
                            </div>) 
                        ))
                        ) : (
                        <button type="button" className='addAuthors' onClick={() => arrayHelpers.push('')}>
                            добавить еще авторов
                        </button>
                        )}
                    </div>
                    )}
                />
                <label htmlFor="publicationYear">Год публикации: </label>
                <input
                    id="publicationYear"
                    name="publicationYear"
                    type="number"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.publicationYear}
                />
                {props.errors.publicationYear && props.touched.publicationYear 
                ? (<div>{props.errors.publicationYear}</div>) : null}

                <label htmlFor="rating">Рейтинг: </label>
                <input
                    id="rating"
                    name="rating"
                    type="number"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.rating}
                />
                {props.errors.rating && props.touched.rating ? (<div>{props.errors.rating}</div>) : null}
                <label htmlFor="ISBN">ISBN: </label>
                <input
                    id="ISBN"
                    name="ISBN"
                    type="text"
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    value={props.values.ISBN}
                />
                {props.errors.ISBN && props.touched.ISBN ? (<div>{props.errors.ISBN}</div>) : null}
                <button type="submit"  className="addBtn">Добавить</button>
                </form>
            )}
            </Formik>
            {errorMessage}
        </div>
    )
}

export default AddBook;
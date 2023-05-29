import { useState } from "react";
import { useCallback } from "react";
import { addDoc, collection, getDocs, deleteDoc, doc} from "@firebase/firestore"
import { db } from "../firebaseSetup/firebase"

const useFirestore = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const ref = collection(db, "books");

    const getBooks = async () => {
       
        setLoading(true);
        return await getDocs(collection(db, "books"))
            .then((querySnapshot)=>{               
                const newData = querySnapshot.docs
                    .map((doc) => ({...doc.data(), id:doc.id }));
                setLoading(false);
                return newData;
            })
            .catch(err => {
                setLoading(false);
                setError(err.message);
                throw err;
            })
       
    }

    const setBook = async (book) => {
        setLoading(true);
        try {
            await addDoc(ref, book)
            setLoading(false);
            //alert("Данные о книге успешно добавлены!\nПожалуйста, обновите страницу, чтобы увидеть изменения в списке")
        } catch(err) {
            setLoading(false);
            setError(err.message);
            throw err;
        }
    }

    const deleteBook = async (docID) => {
        const docRef = doc(db, "books", docID);
        setLoading(true);
        await deleteDoc(docRef)
        .then(() => {
            setLoading(false);
            console.log("Данные о книге успешно удалены!")
        })
        .catch(err => {
            setLoading(false);
            setError(err.message);
            throw err;
        })
    }

    const clearError = useCallback(() => setError(null), []);

    return {loading, error, clearError, setBook, deleteBook, getBooks}
}

export default useFirestore;
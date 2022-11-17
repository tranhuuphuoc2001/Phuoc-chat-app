import { db } from "../firebase/config"
import { useEffect, useState } from "react"

const useFirestore = (collection, condition) => {
    const [documents,setDocuments] = useState([])
    useEffect(() => {
        let collectionRef = db.collection(collection).orderBy('createdAt')
        
        if (condition){
            if ( !condition.compareValue || !condition.compareValue.length)
                return
            collectionRef = collectionRef.where(condition.fieldName, condition.operator, condition.compareValue) //filed,operator,compareValue
        }
        const unsubcribe = collectionRef.onSnapshot((snapshot) => {//lang nghe thay doi cua collection
            const documents = snapshot.docs.map( doc => ({
                ...doc.data(),//data() la func co san cua firestore convert du lieu firestore thanh js binh thuong 
                id: doc.id
            }))
            setDocuments(documents)
        })

        return unsubcribe
    },[collection,condition])

    return documents
}

export default useFirestore
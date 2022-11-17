import  { createContext,useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase/config';
import { Spin } from 'antd'

const AuthContext = createContext() 
function AuthProvider({children}) {
    const [user,setUser] = useState({})
    const [isLoading,setIsLoading] = useState(true)
    const navigate =  useNavigate()

    useEffect(() => {
        const unsubcribed = auth.onAuthStateChanged((user)=>{
            if(user){
                const { displayName, uid, email, photoURL } = user
                setUser({
                    displayName, uid, email, photoURL
                })
                setIsLoading(false)
                navigate('/')
                return
            }
            setIsLoading(false)
            navigate('/login')
            return
        })

        return () =>{
            unsubcribed()
        }
    },[navigate])
    

    return (
        <AuthContext.Provider value={{user}}>
            { isLoading ? <Spin/> : children}
        </AuthContext.Provider>
    );
}
export {AuthContext}
export default AuthProvider;
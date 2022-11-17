import  { createContext,useContext, useMemo, useState } from 'react';
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from './AuthProvider';

const AppContext = createContext() 
function AppProvider({children}) {
    const [isAddRoomModalVisible, setIsAddRoomModalVisible] = useState(false)
    const [isInviteMemberModalVisible, setIsInviteMemberModalVisible] = useState(false)
    const [selectedRoomId,setSelectedRoomId] = useState('')
    const {user:{
        uid
    }} = useContext(AuthContext)
    //find rooms
    const roomsCondition = useMemo( () => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: uid
        }
    }, [uid])
    const rooms = useFirestore('rooms',roomsCondition)

    //get selectedroom
    const selectedRoom = useMemo(() => {
        return rooms.find(room => room.id === selectedRoomId) || {}
    },[rooms,selectedRoomId])
    //find members
    const membersCondition = useMemo( () => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: selectedRoom.members
        }
    }, [selectedRoom.members])
    const members = useFirestore('users',membersCondition)
    return (
        <AppContext.Provider 
            value={{
                rooms,
                isAddRoomModalVisible,
                setIsAddRoomModalVisible,
                selectedRoomId,
                setSelectedRoomId,
                selectedRoom,
                members,
                isInviteMemberModalVisible,
                setIsInviteMemberModalVisible
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
export {AppContext}
export default AppProvider;
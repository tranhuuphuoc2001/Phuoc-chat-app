import { useContext, useMemo, useState } from 'react';
import { Modal, Form, Select, Spin, Avatar } from 'antd'
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { debounce } from 'lodash'
import { db } from '../../firebase/config';

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }){//props = rest
    const [ fetching, setFetching ] = useState(false)
    const [ options, setOptions ] = useState([])
    const debounceFetcher = useMemo( () => {
        const loadOptions = (value) => {
            setOptions([])
            setFetching(true)

            fetchOptions(value, props.curMembers).then( newOptions => {
                setOptions(newOptions)
                setFetching(false)
            })
        }
        return debounce(loadOptions, debounceTimeout)
    },[debounceTimeout,fetchOptions, props.roomId])
    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small'/> : null}
            {...props}
        >
            {
                options.map( option => (
                    <Select.Option key={option.value} value={option.value} title={option.label}>
                        <Avatar src={option.photoURL} size='small'>
                            { option.photoURL ? '' : option.label?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        {`${option.label}`}
                    </Select.Option>
                ))
            }
        </Select>
    )
}

async function fetchUserList(search, curMembers){
    return db
        .collection('users')
        .where('keywords','array-contains',search)
        .orderBy('displayName')
        .limit(20)
        .get()
        .then( snapshot => {//snapshot la gia tri db tra ve
            return snapshot.docs.map( doc => ({
                label: doc.data().displayName,
                value: doc.data().uid,
                photoURL: doc.data().photoURL
            })).filter( opt => !curMembers.includes(opt.value))
        })
}

function InviteMemberModal() {
    const {isInviteMemberModalVisible, setIsInviteMemberModalVisible, selectedRoomId, selectedRoom} = useContext(AppContext)
    const { user:{ uid }} = useContext(AuthContext)
    const [value,setValue] = useState([])
    const [form] = Form.useForm()
    const handelOk = () => {
        //update member for currnent room
        const roomRef = db.collection('rooms').doc(selectedRoomId)//get room by id
        roomRef.update({
            members: [...selectedRoom.members, ...value.map(val => val.value)]
        })
        setIsInviteMemberModalVisible(false)
    }
    const handleCancel = () => {
        setIsInviteMemberModalVisible(false)
    }
    return (
        <div>
            <Modal
                title='Add a member'
                open={isInviteMemberModalVisible}
                onOk={handelOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode='multiple'
                        label='Members name'
                        value={value}
                        placeholder='Type a name'
                        fetchOptions={fetchUserList}
                        onChange={ newValue => setValue(newValue)}
                        style={{width:'100%'}}
                        curMembers={selectedRoom.members}
                        roomId = {selectedRoomId}
                    />
                </Form>
            </Modal>
        </div>
    );
}

export default InviteMemberModal;
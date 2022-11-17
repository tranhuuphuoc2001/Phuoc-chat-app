import { useContext } from 'react';
import { Modal,Form,Input } from 'antd'
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/service';
import { AuthContext } from '../../Context/AuthProvider';


function AddRoomModal() {
    const {isAddRoomModalVisible, setIsAddRoomModalVisible,setSelectedRoomId} = useContext(AppContext)
    const { user:{ uid }} = useContext(AuthContext)
    const [form] = Form.useForm()
    const handelOk = async () => {

        const newRoomId = await addDocument('rooms',{
            ...form.getFieldValue(),//lay cac truong tu Form
            members: [uid]
        })
        form.resetFields()//reset form
        setSelectedRoomId(newRoomId)
        setIsAddRoomModalVisible(false)
    }
    const handleCancel = () => {
        form.resetFields()//reset form
        setIsAddRoomModalVisible(false)
    }
    return (
        <div>
            <Modal
                title='Create room'
                open={isAddRoomModalVisible}
                onOk={handelOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label='Room name' name='name'>
                        <Input/>
                    </Form.Item>
                    <Form.Item label='Room description' name='description'>
                        <Input.TextArea/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default AddRoomModal;
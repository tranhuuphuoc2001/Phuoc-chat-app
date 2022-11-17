import { useContext, useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components'
import { Avatar, Button, Form, Tooltip, Input, Alert } from 'antd'
import { SendOutlined, UserAddOutlined } from '@ant-design/icons'
import Message from './Message';
import { AppContext } from '../../Context/AppProvider';
import { AuthContext } from '../../Context/AuthProvider';
import { addDocument } from '../../firebase/service';
import useFirestore from '../../hooks/useFirestore';

const WrapperStyled = styled.div`
    height: 100vh;
`

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 0 16px;
    align-items: center;
    border-bottom: 1px solid rgba(230,230,230);

    .header{
        &__info{
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        &__name{
            margin: 0;
            font-weight: bold;
        }
        &__description{
            font-size: 12px;
        }
    }    
`

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`

const ContentStyled = styled.div`
    height: calc(100% - 56px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
`

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgb(230,230,230);
    border-radius: 2px;

    .ant-form-item{
        flex: 1;
        margin-bottom: 0;
    }
`

const MessageListStyled = styled.div`
    max-height: 100%;
    overflow: auto;
`

function ChatWindow() {
    const { selectedRoom,members,selectedRoomId,setIsInviteMemberModalVisible } = useContext(AppContext)
    const {user:{
        uid,photoURL,displayName
    }} = useContext(AuthContext)
    const [form] = Form.useForm()
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef()
    
    const handleInputChange = (e) => {
        setInputValue(e.target.value)
    }
    const handleInputSubmit = () => {
        addDocument('messages',{
            uid,
            photoURL,
            displayName,
            text: inputValue,
            roomId: selectedRoomId
        })
        form.resetFields(['message'])
    }

    const messCondition = useMemo( () => {
        return {
            fieldName: 'roomId',
            operator: '==',
            compareValue: selectedRoomId
        }
    }, [selectedRoomId])

    const messages = useFirestore('messages',messCondition)
    useEffect(() => {
        // 👇️ scroll to bottom every time messages change
        messagesEndRef.current?.scrollIntoView({behavior: 'auto'});
      }, [messages]);
    return (
        <WrapperStyled>
            {
                selectedRoomId && (<>
                <HeaderStyled>
                <div className='header__info'>
                    <p className='header__name'>{selectedRoom?.name}</p>
                    <span className='header__description'>{selectedRoom?.description}</span>
                </div>
                <ButtonGroupStyled>
                    <Button 
                        icon={<UserAddOutlined />} 
                        type='text' 
                        onClick={() => setIsInviteMemberModalVisible(true)}
                        >
                        Invite
                    </Button>
                    <Avatar.Group size='small' maxCount={2}>
                        {
                            members.map(member => {
                                return (
                                    <Tooltip key={member.uid} title={member.displayName}>
                                        <Avatar 
                                            src={member.photoURL}
                                        >
                                            { member.photoURL ? '' : member.displayName?.charAt(0)?.toUpperCase()}
                                        </Avatar>
                                    </Tooltip>
                                )
                            })
                        }
                    </Avatar.Group>
                </ButtonGroupStyled>
                </HeaderStyled>
                <ContentStyled>
                    <MessageListStyled>
                        {
                            messages.map( mess => {
                                if(mess.uid === uid)
                                    return (
                                        <Message 
                                            key={mess.id}
                                            text={mess.text} 
                                            photoURL={mess.photoURL} 
                                            displayName={mess.displayName} 
                                            createdAt={mess.createdAt}
                                            authMess
                                        />
                                    )
                                return (
                                    <Message 
                                        key={mess.id}
                                        text={mess.text} 
                                        photoURL={mess.photoURL} 
                                        displayName={mess.displayName} 
                                        createdAt={mess.createdAt}
                                    />
                                )
                            })
                        }
                        <div ref={messagesEndRef}/>
                    </MessageListStyled >
                    <FormStyled form={form}>
                        <Form.Item name='message'>
                            <Input 
                                placeholder='Type something...' 
                                bordered={false} 
                                autoComplete='off'
                                onChange={handleInputChange}
                                onPressEnter={handleInputSubmit}
                                value={inputValue}
                            />
                        </Form.Item>
                        <Button type='primary' icon={<SendOutlined/>} onClick={handleInputSubmit}>Send</Button>
                    </FormStyled>
                </ContentStyled>
                </>) || (
                    <Alert
                        message='Choose a room'
                        type='info'
                        showIcon
                        closable
                        style={{margin:5}}
                    />
                )
            }
            
        </WrapperStyled>
    );
}

export default ChatWindow;
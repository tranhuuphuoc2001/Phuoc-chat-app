import { useContext } from 'react';
import { Collapse, Typography, Button } from 'antd'
import styled from 'styled-components';
import { PlusSquareOutlined } from '@ant-design/icons'
import { AppContext } from '../../Context/AppProvider';

const PanelStyled = styled(Collapse.Panel)`
    &&&{
        .ant-collapse-header,p{
            color: white;
            font-weight: bolder;
            font-size: 18px
        }
        .ant-collapse-content-box{
            padding: 0 40px
        }

        .add-room{
            color: white;
            padding: 0
        }
    }
`
const LinkStyled = styled(Typography.Link)`
    display: block;
    margin-bottom: 5px;
    color: white !important;
`
function RoomList() {
    const { rooms,setIsAddRoomModalVisible,setSelectedRoomId } = useContext(AppContext)

    const handleShowAddRoomModal = () => {
        setIsAddRoomModalVisible(true)
    }

    return (
        <Collapse ghost defaultActiveKey={1}>
            <PanelStyled header="Room List" key="1">
                {
                    rooms.map( room => (
                        <LinkStyled onClick={() => setSelectedRoomId(room.id)} key={room.id}>
                            {room.name}
                        </LinkStyled>
                    ) )
                }
                <Button 
                    type='text' 
                    icon={<PlusSquareOutlined/>} 
                    className='add-room'
                    onClick={handleShowAddRoomModal}
                >
                    Add Room
                </Button>
            </PanelStyled>
        </Collapse>
    );
}

export default RoomList;
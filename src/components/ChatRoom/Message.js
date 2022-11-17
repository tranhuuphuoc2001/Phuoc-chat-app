import React from 'react';
import { Avatar, Typography } from 'antd'
import styled from 'styled-components';
import { formatRelative  } from 'date-fns'

const WrapperStyled = styled.div`
    margin-bottom: 10px;
    .author{
        margin-left: 5px;
        font-weight: bold
    }

    .date{
        margin-left: 10px;
        font-size: 11px;
        color: #a7a7a7;
    }

    .content{
        padding-left: 30px;
    }
`
function formatDate(seconds){
    let formattedDate = ''
    if(seconds){
        formattedDate = formatRelative(new Date(seconds)*1000, new Date())
        formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
    }
    return formattedDate
}

function Message({ text, displayName, createdAt, photoURL, authMess }) {
    const authStyle = authMess ? {
        background:'rgb(0, 132, 255)',
        padding:'5px',
        borderRadius:'10px',
        width:'fit-content',
        maxWidth:'40%'
    } : {}
    return (
        <WrapperStyled style={authMess ? {alignContent: 'flex-end',display: 'flex', flexDirection: 'column',flexWrap:'wrap'} : {}}>
            <div style={authStyle}>
                <div>
                    <Avatar size='small' src={photoURL}>
                        {photoURL ? '' : displayName.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Typography.Text className='author'>{displayName}</Typography.Text>
                    <Typography.Text className='date'>{formatDate(createdAt?.seconds)}</Typography.Text>
                </div>
                <div className='content'>
                    <Typography.Text>{text}</Typography.Text>
                </div>
            </div>
        </WrapperStyled>
    );
}

export default Message;
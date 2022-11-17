import React from 'react'
import { Row,Col,Typography,Button } from 'antd'
import firebase,{ auth } from '../../firebase/config';
import { addDocument, generateKeywords } from '../../firebase/service';
import GoogleButton from 'react-google-button'

const fbProvider = new firebase.auth.FacebookAuthProvider()
const ggProvider = new firebase.auth.GoogleAuthProvider()
const provider = {
    facebook: fbProvider,
    google: ggProvider
}
function Login() {
    const handleLogin = async (type) =>{
        //promise return auth info
        const { additionalUserInfo, user } = await auth.signInWithPopup(provider[type])
        console.log(user);
        if (additionalUserInfo?.isNewUser){
            addDocument('users',{
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: additionalUserInfo.providerId,
                keywords: generateKeywords(user.displayName)
            })
        }
    }

    return (
        <div>
            <Row justify="center" style={{height:800}}>
                <Col span="8">
                    <Typography.Title style={{textAlign:'center'}} level={3}>My Chat App</Typography.Title>
                    <GoogleButton style={{width:'100%',marginBottom:5}} onClick={() => handleLogin('google')} />
                    <Button type='primary' style={{width:'100%',height:50,fontSize:25}} onClick={() => handleLogin('facebook')} >
                        Sign in with Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default Login;
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Input, Modal } from 'antd';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';

import Loading from '../components/shared/loading';
import { isLogin } from '../utilities/authentication';
import { isEmailFormat, isPasswordFormat } from '../utilities/util';
import BaseView from './base_view';
import * as actions from './sign_up_redux';

class SignUp extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            passwordConfirm: '',
            passwordFormatError: '',
            confirmFailure: '',
            emailFormatError: ''
        }
    }

    componentWillMount() {
        if (isLogin()) this.handleAlreadyLogin();
    }

    handleAlreadyLogin = (e) => {
        this.props.history.push("/");
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        if (nextProps.signUp.isSuccess) {
            Modal.success({ title: '註冊成功，請重新登入！' });
            this.props.history.push("/");
        }
    }

    onEmailChanged = (e) => {
        this.checkPasswords(e.target.value, this.state.password, this.state.passwordConfirm);
        this.setState({ email: e.target.value });
    }

    onPasswordChanged = (e) => {
        this.checkPasswords(this.state.email, e.target.value, this.state.passwordConfirm);
        this.setState({ password: e.target.value });
    }

    onPasswordConfirmChanged = (e) => {
        this.checkPasswords(this.state.email, this.state.password, e.target.value);
        this.setState({ passwordConfirm: e.target.value });
    }

    checkPasswords = (email, password, passwordConfirm) => {
        const emailFormatError = isEmailFormat(email) ? '' : '* Email格式錯誤！';
        const passwordFormatError = isPasswordFormat(password) ? '' : '* 密碼至少需要一個小寫字母、一個大小字母、一個數字、一個特殊符號以及長度超過八！';
        const confirmFailure = password === passwordConfirm ? '' : '* 密碼兩次輸入不同！';

        this.setState({
            emailFormatError,
            passwordFormatError,
            confirmFailure
        });
    }

    onSignUpClick = (e) => {
        const { email, password, passwordFormatError, emailFormatError, confirmFailure } = this.state;

        if (passwordFormatError === '' && emailFormatError === '' && confirmFailure === '') this.props.actions.signUp(email, password);
    }
    
    parseGoogleToken = (token) => {
        let base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    onGoogleLoginSuccess = (response) => {
        const profile = this.parseGoogleToken(response.credential);
        console.log('profile', profile);

        this.props.actions.googleLogin(profile.email, profile.name);
    }

    onGoogleLoginFailure = (error) => {
        if (error) console.log('onGoogleLoginFailure', error);
    }

    render() {
        const { signUp } = this.props;
        const { passwordFormatError, confirmFailure, emailFormatError } = this.state;

        return (
            <div className='container'>
                {signUp.isLoading && <Loading />}
                <div className='row'>
                    <div className='col-md-4' />
                    <div className='col-md-4'>
                        <SignUpBlock onEmailChanged={this.onEmailChanged} 
                            onPasswordChanged={this.onPasswordChanged}
                            onPasswordConfirmChanged={this.onPasswordConfirmChanged}
                            onFbLoginCallback={this.onFbLoginCallback}
                            onGoogleLoginSuccess={this.onGoogleLoginSuccess}
                            onGoogleLoginFailure={this.onGoogleLoginFailure}
                            onSignUpClick={this.onSignUpClick} />
                        <br />
                        <h6 style={{color: 'red'}}>{passwordFormatError}</h6>
                        <br />
                        <h6 style={{color: 'red'}}>{confirmFailure}</h6>
                        <br />
                        <h6 style={{color: 'red'}}>{emailFormatError}</h6>
                    </div>
                </div>
            </div>
            
        );
    }
}

const SignUpBlock = props => {
    const { onEmailChanged, onPasswordChanged, onPasswordConfirmChanged, onSignUpClick, onFbLoginCallback, onGoogleLoginSuccess, onGoogleLoginFailure } = props;
    
    return (
        <div className='card'>
            <article className='card-body'>
                <h4 className='card-title text-center mb-4 mt-1'>註冊新用戶</h4>
                <hr />
                <Row>
                    <Col span={24}>
                        <Input placeholder='Email' onChange={onEmailChanged}/>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={24}>
                        <Input.Password placeholder='Password' onChange={onPasswordChanged}/>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={24}>
                        <Input.Password placeholder='Password Confirm' onChange={onPasswordConfirmChanged}/>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <Button block={true} type='primary' onClick={onSignUpClick}> Sign Up </Button>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <FacebookLogin appId={FACEBOOK_CLIENT_ID}
                            textButton='sign up with Facebook'
                            fields='email, name'
                            callback={onFbLoginCallback}/>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col>
                        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                            <GoogleLogin text='signup_with' onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} />
                        </GoogleOAuthProvider>

                    </Col>
                </Row>
            </article>
        </div>
    );
}



function mapStateToProps(state) {
    return {
        error: state.baseView,
        signUp: state.signUp,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
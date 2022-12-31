import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Row, Col, Button, Modal } from 'antd';
import { GoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { isLogin } from '../utilities/authentication';
import { isEmailFormat, isPasswordFormat } from '../utilities/util';
import BaseView from './base_view';
import IconInput from '../components/shared/icon_input';
import stringEn from '../constants/string_en';
import * as actions from './login_redux';

const USER_LOGIN = '用戶登入';
const INPUT_ACCOUNT_PASSWORD = '請輸入帳號密碼';
const INPUT_TYPE_ERROR = '帳號密碼格式錯誤';


const googleBtnStyle = {
    background: '#009193',
    borderColor: '#009193',
    color: 'white'
};

class Login extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            password: '',
            isAccountError: false,
            isPasswordError: false
        }
    }

    componentWillMount() {
        if (isLogin()) this.handleAlreadyLogin();
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        if (isLogin()) this.handleAlreadyLogin();
    }

    handleAlreadyLogin = (e) => {
        this.props.history.push('/');
    }

    handleAccountChanged = (e) => {
        let account = e.target.value;
        
        this.setState({ 
            account,
            isAccountError: account ? !isEmailFormat(account) : false
        });
    }

    handlePasswordChanged = (e) => {
        let password = e.target.value;

        this.setState({ 
            password,
            isPasswordError: password ? !isPasswordFormat(password) : false
        });
    }

    onLoginClick = () => {
        const { actions } = this.props;
        const { account, password, isAccountError, isPasswordError } = this.state;
        
        if (!account || !password) {
            Modal.warning({ title: INPUT_ACCOUNT_PASSWORD });
        } else if (isAccountError || isPasswordError) {
            Modal.warning({ title: INPUT_TYPE_ERROR });
        } else {
            actions.login(this.state.account, this.state.password);
        }
    }

    onFbLoginCallback = (response) => {
        this.props.actions.facebookLogin(response.email, response.name);
    }

    onGoogleLoginSuccess = (response) => {
        const profile = response.profileObj;

        this.props.actions.googleLogin(profile.email, profile.name);
    }

    onGoogleLoginFailure = (error) => {
        if (error) {
            console.log('onGoogleLoginFailure', error);
            Modal.error({ title: stringEn.googleLoginFailure });
        }
    }

    render() {
        return (
            <div className='container'>
                <div className='row'>
                    <div className='col-md-4'></div>
                    <div className='col-md-4'>
                        <LoginBlock handleAccountChanged={this.handleAccountChanged} 
                            handlePasswordChanged={this.handlePasswordChanged}
                            onLoginClick={this.onLoginClick}
                            onFbLoginCallback={this.onFbLoginCallback}
                            onGoogleLoginSuccess={this.onGoogleLoginSuccess}
                            onGoogleLoginFailure={this.onGoogleLoginFailure}
                            isAccountError={this.state.isAccountError}
                            isPasswordError={this.state.isPasswordError}/>
                    </div>
                </div>
            </div>
            
        );
    }
}

const LoginBlock = props => {
    const { onLoginClick, onFbLoginCallback, onGoogleLoginSuccess, onGoogleLoginFailure, handleAccountChanged, handlePasswordChanged, isAccountError, isPasswordError } = props;

    return (
        <div className='card'>
            <article className='card-body'>
                <h4 className='card-title text-center mb-4 mt-1'>{USER_LOGIN}</h4>
                <hr />
                <IconInput icon='fa fa-user' placeHolder='Email or Account' type='email' onChange={handleAccountChanged} isError={isAccountError}/>
                <IconInput icon='fa fa-lock' placeHolder='******' type='password' onChange={handlePasswordChanged} isError={isPasswordError}/>
                <div className='form-group'>
                    <Button block={true} onClick={onLoginClick}> Login </Button>
                </div>
                <div className='form-group'>
                    <Row>
                        <Col>
                            <FacebookLogin appId={FACEBOOK_CLIENT_ID}
                                fields='email, name'
                                callback={onFbLoginCallback}/>
                        </Col>
                    </Row>
                </div>
                <div className='form-group'>
                    <Row>
                        <Col>
                            <GoogleLogin clientId={GOOGLE_CLIENT_ID}
                                buttonText='Google login'
                                onSuccess={onGoogleLoginSuccess}
                                onFailure={onGoogleLoginFailure}
                                cookiePolicy={'single_host_origin'} />
                        </Col>
                    </Row>
                </div>
            </article>
        </div>
    );
}



function mapStateToProps(state) {
    return {
        error: state.baseView,
        login: state.login,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));

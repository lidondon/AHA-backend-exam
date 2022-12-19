import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Input, Modal } from 'antd';
import Loading from '../components/shared/loading';
import { isPasswordFormat } from '../utilities/util';
import BaseView from './base_view';
import * as actions from './reset_password_redux';
import stringEn from '../constants/string_en';

class ResetPassword extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            newPassword: '',
            newPasswordConfirm: '',
            passwordFormatError: '',
            confirmFailure: '',
            samePasswordError: ''
        }
    }

    componentWillUnmount() {
        this.props.actions.clear();
    }

    componentWillUpdate(nextProps, nextState) {
        super.componentWillUpdate(nextProps, nextState);
        if (nextProps.resetPassword.isSuccess) {
            Modal.success({ title: stringEn.resetPasswordSuccessfully });
            this.props.history.push("/userprofile");
        }
    }

    onPasswordChanged = (e) => {
        this.checkPasswords(e.target.value, this.state.newPassword, this.state.newPasswordConfirm);
        this.setState({ password: e.target.value });
    }

    onNewPasswordChanged = (e) => {
        this.checkPasswords(this.state.password, e.target.value, this.state.newPasswordConfirm);
        this.setState({ newPassword: e.target.value });
    }

    onNewPasswordConfirmChanged = (e) => {
        this.checkPasswords(this.state.password, this.state.newPassword, e.target.value);
        this.setState({ newPasswordConfirm: e.target.value });
    }

    checkPasswords = (password, newPassword, newPasswordConfirm) => {
        const passwordFormatError = (isPasswordFormat(password) && isPasswordFormat(newPassword) && isPasswordFormat(newPasswordConfirm)) ? '' : '* 密碼至少需要一個小寫字母、一個大小字母、一個數字、一個特殊符號以及長度超過八！';
        const samePasswordError = password === newPassword ? '* 新密碼不可與舊密碼相同！' : '';
        const confirmFailure = newPassword === newPasswordConfirm ? '' : '* 新密碼兩次輸入不同！';

        this.setState({ 
            passwordFormatError,
            samePasswordError,
            confirmFailure
        });
    }

    onResetClick = (e) => {
        const { password, newPassword, passwordFormatError, samePasswordError, confirmFailure } = this.state;

        if (passwordFormatError === '' && samePasswordError === '' && confirmFailure === '') this.props.actions.resetPassword(password, newPassword);
    }
    

    render() {
        const { resetPassword } = this.props;
        const { passwordFormatError, confirmFailure, samePasswordError } = this.state;

        return (
            <div className='container'>
                {resetPassword.isLoading && <Loading />}
                <div className='row'>
                    <div className='col-md-4' />
                    <div className='col-md-4'>
                        <ResetPasswordBlock onPasswordChanged={this.onPasswordChanged} 
                            onNewPasswordChanged={this.onNewPasswordChanged}
                            onNewPasswordConfirmChanged={this.onNewPasswordConfirmChanged}
                            onResetClick={this.onResetClick} />
                        <br />
                        <h6 style={{color: 'red'}}>{passwordFormatError}</h6>
                        <br />
                        <h6 style={{color: 'red'}}>{confirmFailure}</h6>
                        <br />
                        <h6 style={{color: 'red'}}>{samePasswordError}</h6>
                    </div>
                </div>
            </div>
            
        );
    }
}

const ResetPasswordBlock = props => {
    const { onPasswordChanged, onNewPasswordChanged, onNewPasswordConfirmChanged, onResetClick } = props;
    
    return (
        <div className='card'>
            <article className='card-body'>
                <h4 className='card-title text-center mb-4 mt-1'>{stringEn.resetPassword}</h4>
                <hr />
                <Row>
                    <Col span={24}>
                        <Input.Password placeholder='Password' onChange={onPasswordChanged}/>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={24}>
                        <Input.Password placeholder='New Password' onChange={onNewPasswordChanged}/>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={24}>
                        <Input.Password placeholder='New Password Confirm' onChange={onNewPasswordConfirmChanged}/>
                    </Col>
                </Row>
                <br />
                <div className='form-group'>
                    <Button type="primary" onClick={onResetClick}> {stringEn.confirm} </Button>
                </div>
            </article>
        </div>
    );
}



function mapStateToProps(state) {
    return {
        error: state.baseView,
        resetPassword: state.resetPassword,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);

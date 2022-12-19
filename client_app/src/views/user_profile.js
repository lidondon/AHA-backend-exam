import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Button, Input, Modal } from 'antd';
import BaseView from './base_view';
import Loading from '../components/shared/loading';
import * as actions from './user_profile_redux';
import stringEn from '../constants/string_en';
import './user_profile.css';

class UserProfile extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            isShowModal: false,
            newName: ''
        }
    }

    componentWillMount() {
        this.props.actions.getUserInfo();
    }

    onCancelModal = () => {
        this.setState({
            newName: '',
            isShowModal: false
        });
    }

    onUpdateNameClick = (e) => {
        const { name } = this.props.userProfile;

        this.setState({ isShowModal: true, newName: name });
    }

    onUpdateUserNameConfirmClick = (e) => {
        const { id } = this.props.userProfile;
        const { newName } = this.state;

        this.props.actions.updateUserName(id, newName);
        this.setState({ isShowModal: false });
    }

    getModalContent = () => {
        return (
            <div className='container'>
                <Row>
                    <Col span={16}><Input value={this.state.newName} onChange={this.onNewNameChanged} /></Col>
                    <Col offset={1} span={7}><Button type='primary' onClick={this.onUpdateUserNameConfirmClick}>{stringEn.send}</Button></Col>
                </Row>
            </div>
        );
    }

    onNewNameChanged = (e) => {
        this.setState({ newName: e.target.value });
    }

    onResetPasswordClick = (e) => {
        this.props.history.push("/userprofile/resetpassword");
    }

    onSendEmailClick = (e) => {
        this.props.history.push("/");
    }
    
    getUserInfoContent = () => {
        const { userProfile } = this.props;
        const { isShowModal } = this.state;
    
        return (
            <div>
                <Row>
                    <Col offset={2} span={4}><h2>{stringEn.email}: </h2></Col>
                    <Col span={8}><h2>{userProfile.email}</h2></Col>
                </Row>
                <Row>
                    <Col span={2}><Button type='primary' onClick={this.onUpdateNameClick}>{stringEn.update}</Button></Col>
                    <Col span={4}><h2>NAME: </h2></Col>
                    <Col span={8}><h2>{userProfile.name}</h2></Col>
                </Row>
                <Row>
                    <Col offset={2} span={4}><Button type='primary' onClick={this.onResetPasswordClick}>{stringEn.resetPassword}</Button></Col>
                </Row>
                <Modal width='30%' visible={isShowModal} onCancel={this.onCancelModal} footer={null}>
                    {this.getModalContent()}
                </Modal>
            </div>
        );
    }

    render() {
        const { hasVerified, isLoading } = this.props.userProfile;

        if (hasVerified !== -1) this.isNotEmailVerified = !(hasVerified === 1);

        return (
            <div className='container'>
                {isLoading && <Loading />}
                {this.isNotEmailVerified && <Waiting4EmailVerified onSendEmailClick={this.onSendEmailClick} />}
                {hasVerified === 1 && this.getUserInfoContent()}
            </div>
        );
    }
}

const Waiting4EmailVerified = props => {
    return (
        <div className='container'>
            <Row>
                <Col><h6 style={{color: 'red'}}>{stringEn.emailVerifiedFirst}</h6></Col>
                <Col><Button type='primary' onClick={props.onSendEmailClick}>{stringEn.sendVerifyingEmail}</Button></Col>
            </Row>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        userProfile: state.userProfile,
        baseView: state.baseView
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
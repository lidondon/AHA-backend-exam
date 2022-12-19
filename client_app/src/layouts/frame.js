import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Row, Col } from 'antd';

import './frame.css';
import Logo from '../static_files/logo.png';
import { isLogin, logout } from '../utilities/authentication';
import { getLoginData } from '../utilities/authentication';

const LOGIN = '登入';
const SIGN_UP = '註冊';
const LOGOUT = '登出';
const HELLO = '哈囉';

class Frame extends Component {

    onLoginClick = (e) => {
        this.props.history.push('/login');
    }

    onSignUpClick = (e) => {
        this.props.history.push('/signup');
    }

    onLogoutClick = (e) => {
        logout();
        this.props.history.push('/');
    }

    getMenu = () => {
        return isLogin() ? <HaveLogin onLogout={this.onLogoutClick} isSelected={this.isSelected} /> : 
            <NotLogin onLoginClick={this.onLoginClick} onSignUpClick={this.onSignUpClick} />;
    }

    isSelected = path => {
        return (path === this.props.location.pathname) ? 'menu-item-selected' : '';
    }

    render () {
        return (
            <nav className='navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3'>
                <div className='container'>
                    <Col span={3}>
                        <Link className='navbar-brand' to='/'>
                            <img src={Logo} style={{width: '100%', height: 'auto'}} alt='liquorder' />
                        </Link>
                    </Col>
                    <Col span={21}>
                        {this.getMenu()}
                    </Col>
                </div>
            </nav>
        );
    }
}

const NotLogin = (props) => {
    const { onLoginClick, onSignUpClick } = props;

    return (
        <Row>
            <Col offset={18} span={2}><Button onClick={onLoginClick}>{LOGIN}</Button></Col>
            <Col span={2}><Button type='primary' onClick={onSignUpClick}>{SIGN_UP}</Button></Col>
        </Row>
    );
}

const HaveLogin = (props) => {
    const { isSelected } = props;

    return (
        <Row>
            <Col span={16}>
                <div className='navbar-collapse collapse '>
                    <ul className='navbar-nav flex-grow-1'>
                        <li className='nav-item'>
                            <Link className='nav-link text-dark' to='/userprofile'>
                                <span className={`menu-item ${isSelected('/userprofile')}`}>User Profile</span>
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link className='nav-link text-dark' to='/userstatistics'>
                                <span className={`menu-item ${isSelected('/userstatistics')}`}>User Statistics</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Col>
            <Col span={8} >
                <span className='hello'>{`${HELLO}，${getLoginData().name}`}</span>
                <Button onClick={props.onLogout} className='login'>{LOGOUT}</Button>
            </Col>
        </Row>
    );
}

export default withRouter(Frame);

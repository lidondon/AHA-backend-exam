import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Row, Col, Table } from 'antd';
import Loading from '../components/shared/loading';
import BaseView from './base_view';
import * as actions from './user_statistics_redux';

const COLUMNS = [
    {
        title: "id",
        dataIndex: "id",
        width: "5%"
    },
    {
        title: "email",
        dataIndex: "email",
        width: "10%"
    },
    {
        title: "name",
        dataIndex: "name",
        width: "10%"
    },
    {
        title: "created time",
        dataIndex: "createdTime",
        width: "10%"
    },
    {
        title: "login times",
        dataIndex: "loginTimes",
        width: "5%"
    },
    {
        title: "the last action time",
        dataIndex: "theLastActionTime",
        width: "10%"
    },
    {
        title: "action",
        dataIndex: "action",
        width: "15%"
    }
];

class UserStatistics extends BaseView {

    componentWillMount() {
        console.log('componentWillMount');
        this.props.actions.getUsers();
        this.props.actions.getUserStatistics();
    }    

    render() {
        const { isLoading, usersCount, todayActiveUserCount, average7daysUserCount, users } = this.props.userStatistics;

        return (
            <div className='container'>
                {isLoading && <Loading />}
                <Row>
                    <Col span={4}><h5>Users count: {usersCount}</h5></Col>
                    <Col span={8}><h5>Active user count today : {todayActiveUserCount}</h5></Col>
                    <Col span={12}><h5>Average active users count in the last 7 days: {average7daysUserCount}</h5></Col>
                </Row>
                <Row>
                    <Table columns={COLUMNS} dataSource={users} rowKey="id" showHeader={true} pagination={false}/>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    console.log('mapStateToProps', state);
    return {
        error: state.baseView,
        userStatistics: state.userStatistics,
        baseView: state.baseView
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserStatistics);
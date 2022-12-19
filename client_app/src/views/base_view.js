import React, { Component } from 'react';
import { notification, Icon } from 'antd';
import { assembleErrorMsg } from '../utilities/util';

import Store from '../redux/store';
import { clearServerError } from './base_view_redux'

const ERROR_OCCUR = '發生錯誤！';

class BaseView extends Component {
    constructor(props) {
        super(props);
        this.isNotEmailVerified = false;
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.baseView && nextProps.baseView) {
            const { serverError } = nextProps.baseView;
            
            if (this.props.baseView.serverError != serverError && serverError) {
                if (serverError.response.status ===423) {
                    this.isNotEmailVerified = true;
                    this.props.history.push("/userprofile");
                } else {
                    this.showError(serverError);
                    Store.dispatch(clearServerError());
                }
            }
        }
    }

    showError = (error) => {
        const errorMsg = assembleErrorMsg('', error)

        notification.open({
            message: ERROR_OCCUR,
            description: errorMsg,
            icon: <Icon type='frown' style={{color: 'red'}} />,
            duration: null,
            style: { background: 'pink' }
        });
    }
}

export default BaseView;

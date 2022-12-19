import 'antd/dist/antd.css';
import React from 'react';
import { render } from 'react-dom';
import { HashRouter, Route, Redirect } from 'react-router-dom';
import { Provider } from 'react-redux';

import './app.css'
import Frame from './layouts/frame';
import Home from './views/home';
import Login from './views/login';
import SignUp from './views/sign_up';
import UserProfile from './views/user_profile';
import UserStatistics from './views/user_statistics';
import ResetPassword from './views/reset_password';
import { isLogin } from './utilities/authentication';
import Store from './redux/store';

class App extends React.Component {
    render () {
        return (
            <HashRouter>
                {/* <div className="background text"> */}
                <div>
                    <Frame />
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/signup" component={SignUp}/>
                    <PrivateRoute exact path="/userprofile" component={UserProfile}/>
                    <PrivateRoute exact path="/userprofile/resetpassword" component={ResetPassword}/>
                    <PrivateRoute exact path="/userstatistics" component={UserStatistics}/>
                </div>
            </HashRouter>
        );
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => isLogin()  ? <Component {...props} /> : <Redirect to='/login' />} />
)

render(
    <Provider store={Store}>
        <App />
    </Provider>
, document.getElementById('app'));
import { createStore, applyMiddleware } from 'redux';

import axiosMiddleware from '../middlewares/axios_middleware';
import reducers from '../redux/root_reducers';

export default createStore(reducers, applyMiddleware(axiosMiddleware));

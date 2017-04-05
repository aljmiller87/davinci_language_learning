import { createStore, applyMiddleware } from 'redux';
import  { mainReducer }  from './reducers/reducers';
import thunk from 'redux-thunk';


export default createStore(mainReducer, applyMiddleware(thunk));
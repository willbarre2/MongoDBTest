import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.scss';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import { getUsers } from './actions/users.actions';
// permet async ds redux
import thunk from 'redux-thunk';
// dev tools
import { composeWithDevTools } from 'redux-devtools-extension';
// import logger from 'redux-logger';
import { getPosts } from './actions/post.action';


const store = createStore(
  // rajouter logger après thunk si on veux l'utiliser
  rootReducer, composeWithDevTools(applyMiddleware(thunk))
)

store.dispatch(getUsers());
store.dispatch(getPosts());

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);




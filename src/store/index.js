// import { createStore, applyMiddleware } from 'redux';
// import thunkMiddleware from 'redux-thunk';
// import rootReducer from './reducers';

// const middlewares = [thunkMiddleware];

// if (process.env.NODE_ENV === 'development') {
//   middlewares.push(require('redux-logger').createLogger());
// }

// export default function configStore() {
//   const store = createStore(rootReducer, applyMiddleware(...middlewares));
//   return store;
// }
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

const composeEnhancers =  window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export default function configStore() {
  const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk)
  ));
  return store
}
import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./Reducer";

const appReducer = combineReducers({
  reducer,
});

export const store = createStore(appReducer, composeWithDevTools());

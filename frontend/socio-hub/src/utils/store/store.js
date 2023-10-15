import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice";
import { persistStore, persistReducer, FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE } from "redux-persist";
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    user: userSlice,
    admin: adminSlice
})

const persitConfig = {
    key: 'root',
    storage,
    version: 1
}

const persitedReducer = persistReducer(persitConfig, rootReducer)

const store = configureStore({
    reducer: persitedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [REGISTER, FLUSH, PURGE, PAUSE, PERSIST, REHYDRATE]
        }
    })
})

const persistor = persistStore(store)

export { persistor, store }
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userProfileReducer from './slices/userProfileSlice'
import jobDetailsReducer from './slices/jobDetailsSlice'
import coverLetterReducer from './slices/coverLetterSlice'

const persistConfig = {
  key: 'covercraft-root',
  storage,
  whitelist: ['userProfile', 'jobDetails', 'coverLetter'],
}

const rootReducer = combineReducers({
  userProfile: userProfileReducer,
  jobDetails: jobDetailsReducer,
  coverLetter: coverLetterReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { configureStore } from '@reduxjs/toolkit';
import { editorReducer, tilesReducer, chunksReducer, levelReducer } from './reducers';

const store = configureStore({
  reducer: {
    editor: editorReducer,
    tiles: tilesReducer,
    chunks: chunksReducer,
    level: levelReducer,
  },
});

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
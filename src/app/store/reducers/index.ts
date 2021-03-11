
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { userReducer } from './user.reducer';
export const reducers: ActionReducerMap<any> = { user: userReducer };
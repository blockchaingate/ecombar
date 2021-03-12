import { createReducer, on } from '@ngrx/store';
import { login, logout, updateMerchantStatus } from '../actions/user.actions';
import { UserState } from '../states/user.state';
export const initialState: UserState = {
    email: '',
    role: '',
    token: '',
    displayName: '',
    merchantId: '',
    myPhotoUrl: '',
    merchantStatus: ''
};
 
const _userReducer = createReducer(
  initialState,
  on(login, (state, {userState}) => {
    return userState
  }),
  on(logout, (state) => initialState))
  on(updateMerchantStatus,  (state: UserState, {newStatus}) => {
    return {...state, merchantStatus: newStatus};
  });
 
export function userReducer(state, action) {
  return _userReducer(state, action);
}
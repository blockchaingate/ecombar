import { createAction, props } from '@ngrx/store';
import { UserState } from '../states/user.state';

export const login = createAction('[User Component] Login', props<{userState: UserState}>());
export const updateMerchantStatus = createAction('[User Component] Merchant status', props<{newStatus: string}>());
export const updateWalletExgAddress = createAction('[User Component] Merchant walletExgAddress', props<{newWalletExgAddress: string}>());
export const logout = createAction('[User Component] Logout');
import { AppState } from '../states';
import { UserState } from '../states/user.state';
import { createSelector } from '@ngrx/store';

export const selectUser = (state: AppState) => state.user;
 
export const selectUserRole = createSelector(
    selectUser,
  (state: UserState) => state.role
)

export const selectMyPhotoUrl = createSelector(
  selectUser,
  (state: UserState) => state.myPhotoUrl
)

export const selectEmail = createSelector(
  selectUser,
  (state: UserState) => state.email
)

export const selectDisplayName = createSelector(
  selectUser,
  (state: UserState) => state.displayName
)

export const selectMerchantId = createSelector(
  selectUser,
  (state: UserState) => state.merchantId
)

export const selectMerchantStatus = createSelector(
  selectUser,
  (state: UserState) => state.merchantStatus
)

export const selectWalletExgAddress = createSelector(
  selectUser,
  (state: UserState) => state.walletExgAddress
)

export const selectToken = createSelector(
  selectUser,
  (state: UserState) => state.token
)
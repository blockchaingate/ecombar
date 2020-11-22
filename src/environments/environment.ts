// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  env: 'dev',
  production: false,
  appid: '5f80c3b09577e8dc2f8db596',
  cat_typ: 'ecombar',
//  EX_GATEWAY: 'https://test.blockchaingate.com/v2/payment/gateway',
//  EX_WEBSITE: 'http://localhost:4200/',
  endpoints: {
    local: 'https://test.blockchaingate.com/v2/',
    test: 'https://test.blockchaingate.com/v2/',
    prod: 'https://blockchaingate.com/v2/',
    blockchaingate: 'https://test.blockchaingate.com/v2/',
    website: 'https://test.exchangily.com/',
  },
  moneris: {
    ps_store_id: '9VGAUtore3',
    hpp_key: 'hpRS5R56OATG'
  },
  paypal_client_id: 'AdmdQayzrKMsDPxU89G_UWcLVfFlHhG-zfFm4I75F6xusJ64AIBOre6J6NxfzsM6JStHQmtviHoCp59x'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

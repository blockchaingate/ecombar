// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';
export const environment = {
  env: 'dev',
  production: false,
  appid: '5f80c3b09577e8dc2f8db596',
  cat_typ: 'ecombar',
  IDDOCK: '/iddock',
  PUBLIC_KEY: '8aff99f9727143fccd28e62df14e4e67305faa70d19b4cb0b9d4cde18ea3cd23c8e58bda3c26e10813aaa6020f3d07a3d9f83a9062cfe662a600949325378b99',
//  EX_GATEWAY: 'https://test.blockchaingate.com/v2/payment/gateway',
//  EX_WEBSITE: 'http://localhost:4200/',


  endpoints: {
    local: 'https://test.blockchaingate.com/v2/',
    test: 'https://test.blockchaingate.com/v2/',
    prod: 'https://blockchaingate.com/v2/',
    kanban: 'https://kanbantest.fabcoinapi.com/',
    blockchaingate: 'https://test.blockchaingate.com/v2/',
    website: 'https://test.exchangily.com/',
    BTC: {
        exchangily: 'https://btctest.fabcoinapi.com/'
    },
    FAB: {
        exchangily: 'https://fabtest.fabcoinapi.com/'
    },
    ETH: {
        exchangily: 'https://ethtest.fabcoinapi.com/',
        // etherscan: 'https://api-ropsten.etherscan.io/'
    },
    BCH: {
        exchangily: 'https://bchtest.fabcoinapi.com/',
    },
    DOGE: {
        exchangily: 'https://dogetest.fabcoinapi.com/',
    },
    LTC: {
        exchangily: 'https://ltctest.fabcoinapi.com/',
    }    
  },
  chains: {
    BTC: {
        network: Btc.networks.testnet,
        satoshisPerBytes: 60,
        bytesPerInput: 148
    },
    DOGE: {
        network: {
            messagePrefix: '\u0019Dogecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
            pubKeyHash: 0x71,
            scriptHash: 0xc4,
            wif: 0xf1,
        },
        satoshisPerBytes: 400000,
        bytesPerInput: 148
    },
    LTC: {
        network: {
            messagePrefix: '\u0019Litecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x0436f6e1,
                private: 0x0436ef7d,
            },
            pubKeyHash: 0x6f,
            scriptHash: 0x3a,
            wif: 0xef,
        },
        satoshisPerBytes: 200,
        bytesPerInput: 148
    },
    BCH: {
        network: {
            messagePrefix: '\u0018Bitcoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef,
        },
        satoshisPerBytes: 50,
        bytesPerInput: 148
    },
    ETH: {
        chain: 'ropsten',
        hardfork: 'byzantium',
        gasPrice: 90,
        gasPriceMax: 200,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    FAB: {
        network: Btc.networks.testnet,
        chain: {
            name: 'test',
            networkId: 212,
            chainId: 212
        },
        satoshisPerBytes: 100,
        bytesPerInput: 148,
        gasPrice: 50,
        gasLimit: 800000
    },
    TRX: {
        network: {
            messagePrefix: '\x15TRON Signed Message:\n'
        },
        feeLimit: 15,
        feeLimitToken: 15,
        fullNode: 'https://api.trongrid.io',
        solidityNode: 'https://api.trongrid.io',
        eventServer: 'https://api.trongrid.io'  
    },    
    KANBAN: {
        chain: {
            name: 'test',
            networkId: 212,
            chainId: 212
        },
        gasPrice: 50000000,
        gasLimit: 20000000
    }
  },

  addresses: {

    //exchangilyRecipient: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
      ecombarOfficial: {
        ETH: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
      },
    smartContract: {
        feeDistribution: '0xb6ac5e2283125e79b181b08a59646e32abf37b1b',
        locker: '0x3a3bc5a481892291720de88c17e1b41ae6a6a3e1',
        contractList: '0x048c5f93f6c9576d597d25a1c49bba137941b56b',

        NFT_Exchange: '0x2c8aa9e76fc3c92a799c6c68926bd24e53ff9abb',
        ProxyRegistry: '0x2e553ad1cd6ba24be952cc7273e4d869d19b1586',
        FABLOCK: '0xa7d4a4e23bf7dd7a1e03eda9eb7c28a016fd54aa',
        //IDDOCK: '0xc0f941945bd45fc295cfc63fc7df75e633e6fa00',
        FEE_CHARGER: '0x7c1251d4bcba989411d72361f14914aeab870aee',
        SEVEN_STAR_KEY_NODE: '',
        SEVEN_STAR_CUSTOMER_REFERRAL: '',
        EXG: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
        USDT: '0x1c35eCBc06ae6061d925A2fC2920779a1896282c',
        DUSD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
        // BNB: '0xE90e361892d258F28e3a2E758EEB7E571e370c6f',
        INB: '0x919c6d21670fe8cEBd1E86a82a1A74E9AA2988F8',
        REP: '0x4659c4A33432A5091c322E438e0Fb1D286A1EbdE',
        HOT: '0x6991d9fff5de74085f5c786d425403601280c8f4',
        CEL: '0xa07a1ab0a8e4d95683dce8d22d0ed665499f0a2b',
        MATIC: '0x39ccec89a2251652265ab63fdcd551b6f65e37d5',
        IOST: '0x4dd868d8d961f202e3244a25871105b5e1feaa62',
        MANA: '0x4527fa0ce6f221a7b9e54412d7a3edd9a37c350a',
        FUN: '0x98e6affb8192ffd89a62e27dc5a594cd3c1fc8db', //??
        WAX: '0xb2140669d08a02b78a9fb4a9ebe36371ae023e5f',
        ELF: '0xdd3d64919c119a7cde45763b94cf3d1b33fdaff7',
        GNO: '0x94fd1b18c927935d4f1751239172ad212281f4ac',
        POWR: '0x6e981f5d973a3ab55ff9db9a77f4123b71d833dd',
        WINGS: '0x08705dc287150ba2da249b5a1b0c3b99c71b4100',
        MTL: '0x1c9b5afa112b42b12fb06b62e5f1e159af49dfa7',
        KNC: '0x3aad796ceb3a1063f727c6d0c698e37053292d10',
        GVT: '0x3e610d9fb322063e50d185e2cc1b45f007e7180c',
        DRGN: '0xbbdd7a557a0d8a9bf166dcc2730ae3ccec7df05c',
        NVZN: '0xf18e828a19c00764522e50a511fffd521de4b119'
    },
   exchangilyOfficial: {
    EXG: '0xed76be271bb47a6df055bbc2039733c26fdecc82',
    FAB: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
    BTC: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
    ETH: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    USDT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    DUSD: '0xed76be271bb47a6df055bbc2039733c26fdecc82',
    BCH: 'bchtest:qrkhd038rw685m0s2kauyquhx0pxlhkvsg6dydtwn9',
    LTC: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
    DOGE: 'nqqkf8PqJj3CUjwLMEcjJDfpiU5NDcMUrB',
    // BNB: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    INB: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    REP: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    HOT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    CEL: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    MATIC: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    IOST: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    MANA: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    FUN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E', // ??
    WAX: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    ELF: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    GNO: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E', 
    POWR: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    WINGS: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    MTL: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    KNC: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    GVT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    DRGN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    NVZN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E'
   },
    promotionOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'
    },
    otcOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'
    }
},

  CoinType: {
    BTC: 1,
    ETH: 60,
    FAB: 1150,
    BCH: 1,
    LTC: 1,
    DOGE: 1,
    TRX: 195
  },
  moneris: {
    ps_store_id: '9VGAUtore3',
    hpp_key: 'hpRS5R56OATG'
  },
  depositMinimumConfirmations: {
    EXG: 12,
    BTC: 2,
    FAB: 12,
    ETH: 20,
    USDT: 20,
    DUSD: 12,
    BCH: 2,
    LTC: 8,
    DOGE: 20,
    BNB: 20,
    INB: 20,
    REP: 20,
    HOT: 20,
    CEL: 20,
    MATIC: 20,
    IOST: 20,
    MANA: 20,
    FUN: 20,
    WAX: 20,
    ELF: 20,
    GNO: 20,
    POWR: 20,
    WINGS: 20,
    MTL: 20,
    KNC: 20,
    GVT: 20,
    DRGN: 20,
    NVZN: 20
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

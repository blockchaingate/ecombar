import * as Btc from 'bitcoinjs-lib';
export const environment = {
  env: 'prod',
  production: true,
  appid: '5b6a8688905612106e976a69',
  cat_typ: 'ecom',
  
  endpoints: {
    prod: 'https://blockchaingate.com/v2/',
    blockchaingate: 'https://blockchaingate.com/v2/',
    website: 'http://exchangily.com/',
    kanban: 'https://kanbanprod.fabcoinapi.com/',
    BTC: {
      exchangily: 'https://btcprod.fabcoinapi.com/'
    },
    FAB: {
        exchangily: 'https://fabprod.fabcoinapi.com/'
    },
    ETH: {
        exchangily: 'https://ethprod.fabcoinapi.com/',
    },
    BCH: {
        exchangily: 'https://bchprod.fabcoinapi.com/',
    },
    DOGE: {
        exchangily: 'https://dogeprod.fabcoinapi.com/',
    },
    LTC: {
        exchangily: 'https://ltcprod.fabcoinapi.com/',
    }    
  },
  chains: {
    BTC: {
        network: Btc.networks.bitcoin,
        satoshisPerBytes: 90,
        bytesPerInput: 152
    },
    DOGE: {
        network: {
            messagePrefix: '\u0019Dogecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x02facafd,
              private: 0x02fac398,
            },
            pubKeyHash: 0x1e,
            scriptHash: 0x16,
            wif: 0x9e,
        },            
        satoshisPerBytes: 1500000,
        bytesPerInput: 148
    },

    LTC: {
        network: {
            messagePrefix: '\u0019Litecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x019da462,
              private: 0x019d9cfe,
            },
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0,
        },            
        satoshisPerBytes: 150,
        bytesPerInput: 148
    },  
    BCH: {
        network: {
            messagePrefix: '\u0018Bitcoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x0488b21e,
              private: 0x0488ade4,
            },
            pubKeyHash: 28,
            scriptHash: 40,
            wif: 0x80,
        },            
        satoshisPerBytes: 9,
        bytesPerInput: 148
    },               
    ETH: {
        chain: 'mainnet',
        hardfork: 'petersburg',
        gasPrice: 90,
        gasPriceMax: 200,
        gasLimit: 21000,
        gasLimitToken: 70000
    },
    FAB: {
        network: Btc.networks.bitcoin,
        chain: {
            name: 'mainnet',
            networkId: 0,
            chainId: 0
        },
        satoshisPerBytes: 100,
        bytesPerInput: 152,
        gasPrice: 50,
        gasLimit: 800000
    },
    KANBAN: {
        chain: {
            name: 'mainnet',
            networkId: 211,
            chainId: 211
        },
        gasPrice: 50000000,
        gasLimit: 20000000
    }
  },
  CoinType: {
    BTC: 0,
    ETH: 60,
    FAB: 1150,
    BCH: 145,
    LTC: 2,
    DOGE: 3
  },   
  moneris: {
    ps_store_id: '9VGAUtore3',
    hpp_key: 'hpRS5R56OATG'
<<<<<<< HEAD
  },
=======
  },  

addresses: {
    smartContract: {
        FABLOCK: '0x04baa04d9550c49831427c6abe16def2c579af4a',
        EXG: '0xa3e26671a38978e8204b8a37f1c2897042783b00',
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        DUSD: '0x46e0021c17d30a2db972ee5719cdc7e829ed9930',
        //BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        INB: '0x17aa18a4b64a55abed7fa543f2ba4e91f2dce482',
        REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
        HOT: '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
        CEL: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
        MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        IOST: '0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab',
        MANA: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
        FUN: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
        WAX: '0x39bb259f66e1c59d5abef88375979b4d20d98022',
        ELF: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e',
        GNO: '0x6810e776880c02933d47db1b9fc05908e5386b96', 
        POWR: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
        WINGS: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
        MTL: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
        KNC: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
        GVT: '0x103c3A209da59d3E7C4A89307e66521e081CFDF0',
        DRGN: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e'
    },
    /*
    exchangilyOfficial: [
        { name: 'EXG', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' },
        { name: 'FAB', address: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu' },
        { name: 'BTC', address: '1CKg6irbGXHxBHuTx7MeqYQUuMZ8aEok8z' },
        { name: 'ETH', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
        { name: 'USDT', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
        { name: 'DUSD', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' }
    ],
    */
   exchangilyOfficial: {
    EXG: '0xfd46d4292e1f89c78e9e700a4976c8960d785f8b',
    FAB: '1Q6CooU5zjy5qXdEaNw3u2Rhm3J6Mb5hap',
    BTC: '1Q6CooU5zjy5qXdEaNw3u2Rhm3J6Mb5hap',
    ETH: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    USDT: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    DUSD: '0xfd46d4292e1f89c78e9e700a4976c8960d785f8b',
    BCH: 'bitcoincash:qr75d4pf9c0cn3uwnecq5jtkeztq67zl3v3enf6wh0',
    LTC: 'LiKA51mv5QD96LKPkWvMB3VTyFfNVKjFVv',
    DOGE: 'DUEJM4QjJ9sNNXoqJxvcSnbJeB2PgbPCa9',
    //BNB: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06',
    INB: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    REP: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    HOT: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    CEL: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    MATIC: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    IOST: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    MANA: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    FUN: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    WAX: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    ELF: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    GNO: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73', 
    POWR: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    WINGS: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    MTL: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    KNC: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    GVT: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    DRGN: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73'        
   },
    promotionOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
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
    otcOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
    }
},  
>>>>>>> master
  paypal_client_id: 'AdmdQayzrKMsDPxU89G_UWcLVfFlHhG-zfFm4I75F6xusJ64AIBOre6J6NxfzsM6JStHQmtviHoCp59x'
};

import * as Btc from 'bitcoinjs-lib';
export const environment = {
  env: 'prod',
  production: true,
  appid: '5b6a8688905612106e976a69',
  PUBLIC_KEY: '8aff99f9727143fccd28e62df14e4e67305faa70d19b4cb0b9d4cde18ea3cd23c8e58bda3c26e10813aaa6020f3d07a3d9f83a9062cfe662a600949325378b99',
  IDDOCK: 'http://localhost:4201',
  cat_typ: 'ecom',
  
  endpoints: {
    prod: 'https://api.blockchaingate.com/v2/',
    blockchaingate: 'https://api.blockchaingate.com/v2/',
    website: 'https://exchangily.com/',
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
    DOGE: 3,
    TRX: 195
  },   
  moneris: {
    ps_store_id: '9VGAUtore3',
    hpp_key: 'hpRS5R56OATG'
  },  
addresses: {
    
    //exchangilyRecipient: '',
    ecombarOfficial: {
        ETH: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
    },
    smartContract: {
        feeDistribution: '0xf3b46ef452099ec2b6f81644b6da75c91c5e116a',
        locker: '0x08283086b2192666128b7a6eaf66df2dfd3f1b6b',
        exchangeRate: '0xc790135e17490400a46bebff9efcc77dac39bdcf',
        sevenStarProxy: '0x541ce3f716a3d6b64b0da9f51e7fe8ad52294f28',
        
        
        NFT_Exchange: '0x3f33980e2767fa3683595afddeab163af46a5566',
        ProxyRegistry: '0x640677e09c8f063d4a0a3a5a03a7bb7d4b3c13f7',                   
        FABLOCK: '0x04baa04d9550c49831427c6abe16def2c579af4a',
        EXG: '0xa3e26671a38978e8204b8a37f1c2897042783b00',
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        DUSD: '0x46e0021c17d30a2db972ee5719cdc7e829ed9930',
        DCAD: '0x39296a9d1c5019fd64c9ef4cd0e657403bf10405',
        DCNY: '0xcb856b9d1184232a3ec1ae735b39778c6e65a33a',
        DJPY: '0xec794fc70b9db714a4dec2581bce6764b3731a84',
        DGBP: '0xb1c07ddae8f2f449e8896874ac307325c39842d3',
        DEURO: '0xadf9ec6c2f28217c0c8c8a173e0c06c4e6cbe4a1',
        DAUD: '0xbc01e6e46369c6fc61fefa722dd081d1c0f1c096',
        DMYR: '0x2a81b44e3c3d0bd3941c636ae3e945460b7ad49d',
        DKRW: '0x14221b728caab28eea480fb114b1edd36c72ffaf',
        DPHP: '0x4ef2bfe2726b006f6ef85e59555e23c8a7ada071',
        DTHB: '0xaf90bd20af338203e807b63417c40eb3cd45ce2e',
        DTWD: '0x5b98385998bb78fe55b547c2baa1abc4fd31e4e9',
        DSGD: '0xfc32f23a8246d9882149f2aeb2548e9a6da51746',
        DHKD: '0x838eac199995a3252bf513bad4b04741767c4331',
        DINR: '0x16c3f0a2af0f1661c556f6dd9c4c12843ccedf7a',
        DMXN: '0x9b5fe4f9fb3a20d0fc2d2b4533a047994adf51bc',
        DBRL: '0x0e0eab64b2473a0912ff767904cc013402dfc822',
        DNGN: '0xd45948d6cc0450fd97e161fafe973e59a90799c5',
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
    EXG: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    FAB: '1GJ9cTDJM93Y9Ug443nLix7b9wYyPnad55',
    BTC: '1GJ9cTDJM93Y9Ug443nLix7b9wYyPnad55',
    ETH: '0x4983f8634255762A18D854790E6d35A522E2633a',
    USDT: '0x4983f8634255762A18D854790E6d35A522E2633a',
    DUSD: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',

    DCAD: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DCNY: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DJPY: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DGBP: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DEURO: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DAUD: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DMYR: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DKRW: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DPHP: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DTHB: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DTWD: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DSGD: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DHKD: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DINR: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DMXN: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DBRL: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
    DNGN: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',    


    BCH: 'bitcoincash:qznusftmq4cac0fuj6eyke5vv45njxe6eyafcld37l',
    LTC: 'LaX6sfX8RoHbQHNDEBmdzyBMN9vFa95FXL',
    DOGE: 'DLSF9i9weYwpgUrendmuGiHC35HGoHuvR9',
    TRX: 'TGfvRWxddNoWrghwE5zC1JEcbXyMdPATdo',
    //BNB: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06',
    INB: '0x4983f8634255762A18D854790E6d35A522E2633a',
    REP: '0x4983f8634255762A18D854790E6d35A522E2633a',
    HOT: '0x4983f8634255762A18D854790E6d35A522E2633a',
    CEL: '0x4983f8634255762A18D854790E6d35A522E2633a',
    MATIC: '0x4983f8634255762A18D854790E6d35A522E2633a',
    IOST: '0x4983f8634255762A18D854790E6d35A522E2633a',
    MANA: '0x4983f8634255762A18D854790E6d35A522E2633a',
    FUN: '0x4983f8634255762A18D854790E6d35A522E2633a',
    WAX: '0x4983f8634255762A18D854790E6d35A522E2633a',
    ELF: '0x4983f8634255762A18D854790E6d35A522E2633a',
    GNO: '0x4983f8634255762A18D854790E6d35A522E2633a', 
    POWR: '0x4983f8634255762A18D854790E6d35A522E2633a',
    WINGS: '0x4983f8634255762A18D854790E6d35A522E2633a',
    MTL: '0x4983f8634255762A18D854790E6d35A522E2633a',
    KNC: '0x4983f8634255762A18D854790E6d35A522E2633a',
    GVT: '0x4983f8634255762A18D854790E6d35A522E2633a',
    DRGN: '0x4983f8634255762A18D854790E6d35A522E2633a'        
   },
    promotionOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
    },
    otcOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
    }
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

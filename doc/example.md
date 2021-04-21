# Exchange example
Note: all following calls and txs should be sent to NFT_Exchange contract
- Order:
   ```
    struct Order { 
       /* Exchange address, intended as a versioning mechanism. */ 
       address exchange; 
       /* Order maker address. */ 
       address maker; 
       /* Order taker address, if specified. */ 
       address taker; 
       /* Maker relayer fee of the order, unused for taker order. */ 
       uint makerRelayerFee; 
       /* Taker relayer fee of the order, or maximum taker fee for a taker order. */ 
       uint takerRelayerFee; 
       /* Maker protocol fee of the order, unused for taker order. */ 
       uint makerProtocolFee; 
       /* Taker protocol fee of the order, or maximum taker fee for a taker order. */ 
       uint takerProtocolFee; 
       /* Order fee recipient or zero address for taker order. */ 
       address feeRecipient; 
       /* Fee method (protocol token or split fee). */ 
       FeeMethod feeMethod; 
       /* Side (buy/sell). */ 
       SaleKindInterface.Side side; 
       /* Kind of sale. */ 
       SaleKindInterface.SaleKind saleKind; 
       /* Target. */ 
       address target; 
       /* HowToCall. */ 
       AuthenticatedProxy.HowToCall howToCall; 
       /* Calldata. */ 
       bytes calldata; 
       /* Calldata replacement pattern, or an empty byte array for no replacement. */ 
       bytes replacementPattern; 
       /* Static call target, zero-address for no static call. */ 
       address staticTarget; 
       /* Static call extra data. */ 
       bytes staticExtradata; 
       /* Token used to pay for the order. */ 
       uint coinType; 
       /* Base price of the order (in paymentTokens). */ 
       uint basePrice; 
       /* Auction extra parameter - minimum bid increment for English auctions, starting/ending price difference. */ 
       uint extra; 
       /* Listing timestamp. */ 
       uint listingTime; 
       /* Expiration timestamp - 0 for no expiry. */ 
       uint expirationTime; 
       /* Order salt, used to prevent duplicate hashes. */ 
       uint salt; 
   }
   ```
 
- Token owner list the item for trade
   - prepare the order parameters and call `hashToSign_` to hash an order, returning the hash that a client must sign, including the standard message prefix: `"\x17Kanban Signed Message:\n32"` 
   -
   ```
   function hashToSign_(
       address[6] addrs,
       uint[10] uints,
       FeeMethod feeMethod,
       SaleKindInterface.Side side,
       SaleKindInterface.SaleKind saleKind,
       AuthenticatedProxy.HowToCall howToCall,
       bytes calldata,
       bytes replacementPattern,
       bytes staticExtradata)
       public
       pure
       returns (bytes32)
   ```
   Corresponding order parameters are:
   ```
   Order(
       addrs[0],
       addrs[1],
       addrs[2],
       uints[0],
       uints[1],
       uints[2],
       uints[3],
       addrs[3],
       feeMethod,  -> 0: ProtocolFee, 1: SplitFee
       side,       -> 0: Buy, 1: Sell
       saleKind,   -> 0: FixedPrice, 1: DutchAuction
       addrs[4],
       howToCall,  -> 0: Call, 1: DelegateCall
       calldata,
       replacementPattern,
       addrs[5],
       staticExtradata,
       uints[4],
       uints[5],
       uints[6],
       uints[7],
       uints[8],
       uints[9])
   ```
 
   - For testing purpose, after you sign the order, you can call `recoverAddressTest(bytes32 hash, uint8 v, bytes32 r, bytes32 s)` to recover the sender(seller) address to check if it is the correct address
 
    - **Sell** order Example  
        ```
        ["0xbfdee10992140b342683837468eb24a728fe7c6b",  // exchange address, please verify
        "0xd46d7e8d5a9f482aeeb0918bef6a10445159f297",   // order maker address, here we use owner address, please change
        "0x0000000000000000000000000000000000000000",   // order taker address, leave it empty cuz when create sell order, you dont know who will be the taker
        "0x0000000000000000000000000000000000000FEE",   // fee recipient address, you can change it
        "0x69ceac3966ec47c3fce3f1a6ae8d89c385a949a0",   // NFT address, please verify 
        "0x0000000000000000000000000000000000000000"]   // static target address, just leave it empty
 
        [250,                       // maker relayer fee, 250 means 2.5% of price will be paid to fee recipient
        0,                          // taker relayer fee, use 0
        0,                          // maker protocol fee, use 0
        0,                          // taker protocol fee, use 0
        196609,                     // coin type, here is usdt
        100000000000000000000,      // price = 100
        0,                          // extra, use 0
        1621010968,                 // timestamp for listing time
        1621010968,                 // timestamp fpr expiration time 
        12345]                      // salt, used to prevent duplicate hashes, you can change it use some algorithm or something like that
 
        1,                          // fee method, use 0
        1,                          // 1 means sell order
        0,                          // sale kind, use 0
        0                           // how to use, use 0

        // call data: the partial data used to call nft contract to move funds, will combined with taker's order using replacementPattern. the actual call data based on what function you use. here is an example to call `transferFrom(address from, address to, uint256 tokenId)`
        0x23b872dd - function signature for transfer, based on what function you use
        000000000000000000000000d46d7e8d5a9f482aeeb0918bef6a10445159f297
        0000000000000000000000000000000000000000000000000000000000000000
        0000000000000000000000000000000000000000000000000000000000000001

        // replacementPattern
        0x00000000
        0000000000000000000000000000000000000000000000000000000000000000
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        0000000000000000000000000000000000000000000000000000000000000000

        // static extra data, can leave it empty
        0x00
        ```
    
    - **Buy** order example
        ```
        ["0xbfdee10992140b342683837468eb24a728fe7c6b",  // exchange address, please verify
        "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",   // order maker address, here we use sender address, please change
        "0xd46d7e8d5a9f482aeeb0918bef6a10445159f297",   // order taker address, which is the item owner's address
        "0x0000000000000000000000000000000000000000",   // fee recipient address, leave it empty
        "0x69ceac3966ec47c3fce3f1a6ae8d89c385a949a0",   // NFT address, please verify 
        "0x0000000000000000000000000000000000000000"]   // static target address, just leave it empty
 
        [250,                       // maker relayer fee, 250 means 2.5% of price will be paid to fee recipient
        0,                          // taker relayer fee, use 0
        0,                          // maker protocol fee, use 0
        0,                          // taker protocol fee, use 0
        196609,                     // coin type, here is usdt
        100000000000000000000,      // price = 100
        0,                          // extra, use 0
        1621010968,                 // timestamp for listing time
        1621010968,                 // timestamp fpr expiration time 
        67890]                      // salt, used to prevent duplicate hashes, you can change it use some algorithm or something like that
 
        1,                          // fee method, use 0
        0,                          // 0 means buy order
        0,                          // sale kind, use 0
        0                           // how to use, use 0

        // call data: the partial data used to call nft contract to move funds, will combined with taker's order using replacementPattern
        0x23b872dd - function signature for transfer, based on what function you use
        0000000000000000000000000000000000000000000000000000000000000000
        000000000000000000000000Ab8483F64d9C6d1EcF9b849Ae677dD3315835cb2
        0000000000000000000000000000000000000000000000000000000000000001

        // replacementPattern
        0x00000000
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        0000000000000000000000000000000000000000000000000000000000000000
        0000000000000000000000000000000000000000000000000000000000000000

        // static extra data, can leave it empty
        0x00
        ```


   - After all orders are signed, buyer create a tx to call `atomicMatch_` to perform the trade.  
   ```
   function atomicMatch_(
       address[12] addrs,
       uint[20] uints,
       uint8[8] feeMethodsSidesKindsHowToCalls,
       bytes calldataBuy,
       bytes calldataSell,
       bytes replacementPatternBuy,
       bytes replacementPatternSell,
       bytes staticExtradataBuy,
       bytes staticExtradataSell,
       uint8[2] vs,
       bytes32[5] rssMetadata)
   ```
   corresponding parameters:
   ```
   Order( // buy
       addrs[0],
       addrs[1],
       addrs[2],
       uints[0],
       uints[1],
       uints[2],
       uints[3],
       addrs[3],
       FeeMethod(feeMethodsSidesKindsHowToCalls[0]),
       SaleKindInterface.Side(feeMethodsSidesKindsHowToCalls[1]),
       SaleKindInterface.SaleKind(feeMethodsSidesKindsHowToCalls[2]),
       addrs[4],
       AuthenticatedProxy.HowToCall(feeMethodsSidesKindsHowToCalls[3]),
       calldataBuy,
       replacementPatternBuy,
       addrs[5],
       staticExtradataBuy,
       uints[4],
       uints[5],
       uints[6],
       uints[7],
       uints[8],
       uints[9]),     
   Sig(vs[0],              // v
       rssMetadata[0],     // r
       rssMetadata[1]),    // s
   Order( // sell
       addrs[6],
       addrs[7],
       addrs[8],
       uints[10],
       uints[11],
       uints[12],
       uints[13],
       addrs[9],
       FeeMethod(feeMethodsSidesKindsHowToCalls[4]),
       SaleKindInterface.Side(feeMethodsSidesKindsHowToCalls[5]),
       SaleKindInterface.SaleKind(feeMethodsSidesKindsHowToCalls[6]),
       addrs[10],
       AuthenticatedProxy.HowToCall(feeMethodsSidesKindsHowToCalls[7]),
       calldataSell,
       replacementPatternSell,
       addrs[11],
       staticExtradataSell,
       uints[14],
       uints[15],
       uints[16],
       uints[17],
       uints[18],
       uints[19]),
   Sig(vs[1],              // v
       rssMetadata[2],     // r
       rssMetadata[3]),    // s
   rssMetadata[4]
   ```
- Basically you just concatenate two orders and add their v,r,s

- Example `atomicMatch_`:
    ```
        ["0xbfdee10992140b342683837468eb24a728fe7c6b",  
        "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",   
        "0xd46d7e8d5a9f482aeeb0918bef6a10445159f297",   
        "0x0000000000000000000000000000000000000000",   
        "0x69ceac3966ec47c3fce3f1a6ae8d89c385a949a0",   
        "0x0000000000000000000000000000000000000000",   
        "0xbfdee10992140b342683837468eb24a728fe7c6b",  
        "0xd46d7e8d5a9f482aeeb0918bef6a10445159f297",   
        "0x0000000000000000000000000000000000000000",   
        "0x0000000000000000000000000000000000000FEE",   
        "0x69ceac3966ec47c3fce3f1a6ae8d89c385a949a0",
        "0x0000000000000000000000000000000000000000"]
 
        [250,                       // maker relayer fee, 250 means 2.5% of price will be paid to fee recipient
        0,                          // taker relayer fee, use 0
        0,                          // maker protocol fee, use 0
        0,                          // taker protocol fee, use 0
        196609,                     // coin type, here is usdt
        100000000000000000000,      // price = 100
        0,                          // extra, use 0
        1621010968,                 // timestamp for listing time
        1621010968,                 // timestamp fpr expiration time 
        67890,                      // salt
        250,                        // maker relayer fee, 250 means 2.5% of price will be paid to fee recipient
        0,                          // taker relayer fee, use 0
        0,                          // maker protocol fee, use 0
        0,                          // taker protocol fee, use 0
        196609,                     // coin type, here is usdt
        100000000000000000000,      // price = 100
        0,                          // extra, use 0
        1621010968,                 // timestamp for listing time
        1621010968,                 // timestamp fpr expiration time 
        12345]                       // salt
 
        [1,                          // fee method, use 0
        0,                          // 0 means buy order
        0,                          // sale kind, use 0
        0                           // how to use, use 0
        1,                          // fee method, use 0
        1,                          // 1 means sell order
        0,                          // sale kind, use 0
        0]                           // how to use, use 0

        // call data buy
        0x23b872dd
        0000000000000000000000000000000000000000000000000000000000000000
        000000000000000000000000Ab8483F64d9C6d1EcF9b849Ae677dD3315835cb2
        0000000000000000000000000000000000000000000000000000000000000001

        // call data sell
        0x23b872dd
        000000000000000000000000d46d7e8d5a9f482aeeb0918bef6a10445159f297
        0000000000000000000000000000000000000000000000000000000000000000
        0000000000000000000000000000000000000000000000000000000000000001

        // replacementPattern buy
        0x00000000
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        0000000000000000000000000000000000000000000000000000000000000000
        0000000000000000000000000000000000000000000000000000000000000000

        // replacementPattern sell
        0x00000000
        0000000000000000000000000000000000000000000000000000000000000000
        ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
        0000000000000000000000000000000000000000000000000000000000000000

        // static extra data buy
        0x00

        // static extra data sell
        0x00

        // v
        [buy order v, 
        sell order v]

        // r
        [buy order r, 
        sell order r]

        // s
        [buy order s, 
        sell order s]

        // metadata
        0x00
    ```




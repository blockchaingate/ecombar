import {Price, Coin } from '../interfaces/kanban.interface';

export const coin_list: Coin[] = [
    { id: 0, name: '' },
    { id: 1, name: 'USDT' },
    { id: 2, name: 'BTC' },
    { id: 3, name: 'ETH' },
    { id: 4, name: 'FAB' },
    { id: 5, name: 'EXG' },
    { id: 6, name: 'DUSD' },
    { id: 7, name: 'DSC' },
    { id: 8, name: 'BST' },
    { id: 9, name: 'DCAD' },
    { id: 10, name: 'DCNY' },
    { id: 11, name: 'DJPY' },
    { id: 12, name: 'DGBP' },
    { id: 13, name: 'DEURO' },
    { id: 14, name: 'DAUD' },
    { id: 15, name: 'DMYR' },
    { id: 16, name: 'DKRW' },
    { id: 17, name: 'DPHP' },
    { id: 18, name: 'DTHB' },
    { id: 19, name: 'DTWD' },
    { id: 20, name: 'DSGD' },
    { id: 21, name: 'DHKD' },
    { id: 22, name: 'DINR' },
    { id: 23, name: 'DMXN' },
    { id: 24, name: 'DBRL' },
    { id: 25, name: 'DNGN' },

    { id: 26, name: 'BCH' },
    { id: 27, name: 'LTC' },
    { id: 28, name: 'DOGE' },
    { id: 29, name: 'BNB' },
    { id: 30, name: 'INB' },
    { id: 31, name: 'HOT' },
    { id: 32, name: 'CEL' },
    { id: 33, name: 'MATIC' },
    { id: 34, name: 'IOST' },
    { id: 35, name: 'MANA' },
    { id: 36, name: 'WAX' },
    { id: 37, name: 'ELF' },
    { id: 38, name: 'GNO' },
    { id: 39, name: 'POWR' },
    { id: 40, name: 'WINGS' },
    { id: 41, name: 'MTL' },
    { id: 42, name: 'KNC' },
    { id: 43, name: 'GVT' },
    { id: 44, name: 'REP' },
    { id: 45, name: 'FUN' },
    { id: 46, name: 'DRGN' }
];

export const coin_list_for_ecombar: Coin[] = [
    { id: 1, name: 'DUSD' },
    { id: 2, name: 'USDT' },
    { id: 3, name: 'BTC' },
    { id: 4, name: 'ETH' },
    { id: 5, name: 'FAB' },
    { id: 5, name: 'EXG' },
    { id: 5, name: 'DSC' },
    { id: 5, name: 'BST' }
];

export const price_list: Price[] = [
    { id: 0, coin_id: 5, base_id: 6, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/DUSD' },
    { id: 1, coin_id: 4, base_id: 6, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/DUSD' },
    { id: 2, coin_id: 4, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/USDT' },
    { id: 3, coin_id: 2, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BTC/USDT' },
    { id: 4, coin_id: 5, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/USDT' },
    { id: 5, coin_id: 3, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ETH/USDT' },
    { id: 6, coin_id: 4, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/BTC' },
    { id: 7, coin_id: 5, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/BTC' },
    { id: 8, coin_id: 3, base_id: 2, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ETH/BTC' },
    { id: 9, coin_id: 4, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/ETH' },
    { id: 10, coin_id: 5, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'EXG/ETH' },
    { id: 11, coin_id: 4, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FAB/EXG' },

    { id: 12, coin_id: 7, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/EXG' },
    { id: 13, coin_id: 7, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/USDT' },
    { id: 14, coin_id: 7, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BCH/ETH' },

    { id: 15, coin_id: 8, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/EXG' },
    { id: 16, coin_id: 8, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/USDT' },
    { id: 17, coin_id: 8, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'LTC/ETH' },

    { id: 18, coin_id: 9, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/EXG' },
    { id: 19, coin_id: 9, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/USDT' },
    { id: 20, coin_id: 9, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DOGE/ETH' },

    { id: 21, coin_id: 10, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BNB/EXG' },
    { id: 22, coin_id: 10, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BNB/USDT' },
    { id: 23, coin_id: 10, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'BNB/ETH' },

    { id: 24, coin_id: 11, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/EXG' },
    { id: 25, coin_id: 11, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/USDT' },
    { id: 26, coin_id: 11, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'INB/ETH' },

    { id: 27, coin_id: 12, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/EXG' },
    { id: 28, coin_id: 12, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/USDT' },
    { id: 29, coin_id: 12, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'HOT/ETH' },

    { id: 30, coin_id: 13, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/EXG' },
    { id: 31, coin_id: 13, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/USDT' },
    { id: 32, coin_id: 13, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'CEL/ETH' },

    { id: 33, coin_id: 14, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/EXG' },
    { id: 34, coin_id: 14, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/USDT' },
    { id: 35, coin_id: 14, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MATIC/ETH' },

    { id: 36, coin_id: 15, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/EXG' },
    { id: 37, coin_id: 15, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/USDT' },
    { id: 38, coin_id: 15, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'IOST/ETH' },

    { id: 39, coin_id: 16, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/EXG' },
    { id: 40, coin_id: 16, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/USDT' },
    { id: 41, coin_id: 16, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MANA/ETH' },

    { id: 42, coin_id: 17, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/EXG' },
    { id: 43, coin_id: 17, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/USDT' },
    { id: 44, coin_id: 17, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WAX/ETH' },

    { id: 45, coin_id: 18, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/EXG' },
    { id: 46, coin_id: 18, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/USDT' },
    { id: 47, coin_id: 18, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'ELF/ETH' },

    { id: 48, coin_id: 19, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/EXG' },
    { id: 49, coin_id: 19, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/USDT' },
    { id: 50, coin_id: 19, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GNO/ETH' },

    { id: 51, coin_id: 20, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/EXG' },
    { id: 52, coin_id: 20, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/USDT' },
    { id: 53, coin_id: 20, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'POWR/ETH' },

    { id: 54, coin_id: 21, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/EXG' },
    { id: 55, coin_id: 21, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/USDT' },
    { id: 56, coin_id: 21, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'WINGS/ETH' },

    { id: 57, coin_id: 22, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/EXG' },
    { id: 58, coin_id: 22, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/USDT' },
    { id: 59, coin_id: 22, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'MTL/ETH' },

    { id: 60, coin_id: 23, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/EXG' },
    { id: 61, coin_id: 23, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/USDT' },
    { id: 62, coin_id: 23, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'KNC/ETH' },

    { id: 63, coin_id: 24, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/EXG' },
    { id: 64, coin_id: 24, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/USDT' },
    { id: 65, coin_id: 24, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'GVT/ETH' },

    { id: 66, coin_id: 25, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/EXG' },
    { id: 67, coin_id: 25, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/USDT' },
    { id: 68, coin_id: 25, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'REP/ETH' },

    { id: 69, coin_id: 26, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/EXG' },
    { id: 70, coin_id: 26, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/USDT' },
    { id: 71, coin_id: 26, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'FUN/ETH' },

    { id: 72, coin_id: 27, base_id: 5, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/EXG' },
    { id: 73, coin_id: 27, base_id: 1, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/USDT' },
    { id: 74, coin_id: 27, base_id: 3, price: 0, change24h: 0, price24hh: 0, price24hl: 0, vol24h: 0, symbol: 'DRGN/ETH' }
];

import {Price, Coin } from '../interfaces/kanban.interface';

export const coin_list: Coin[] = [
    { id: 0, name: '', rate: 1 },
    { id: 1, name: 'USDT', rate: 1 },
    { id: 2, name: 'BTC', rate: 1 },
    { id: 3, name: 'ETH', rate: 1 },
    { id: 4, name: 'FAB', rate: 1 },
    { id: 5, name: 'EXG', rate: 1 },
    { id: 6, name: 'DUSD', rate: 1 },
    { id: 7, name: 'DSC', rate: 1 },
    { id: 8, name: 'BST', rate: 1 },
    { id: 9, name: 'DCAD', rate: 1 },
    { id: 10, name: 'DCNY', rate: 1 },
    { id: 11, name: 'DJPY', rate: 1 },
    { id: 12, name: 'DGBP', rate: 1 },
    { id: 13, name: 'DEURO', rate: 1 },
    { id: 14, name: 'DAUD', rate: 1 },
    { id: 15, name: 'DMYR', rate: 1 },
    { id: 16, name: 'DKRW', rate: 1 },
    { id: 17, name: 'DPHP', rate: 1 },
    { id: 18, name: 'DTHB', rate: 1 },
    { id: 19, name: 'DTWD', rate: 1 },
    { id: 20, name: 'DSGD', rate: 1 },
    { id: 21, name: 'DHKD', rate: 1 },
    { id: 22, name: 'DINR', rate: 1 },
    { id: 23, name: 'DMXN', rate: 1 },
    { id: 24, name: 'DBRL', rate: 1 },
    { id: 25, name: 'DNGN', rate: 1 },

    { id: 26, name: 'BCH', rate: 1 },
    { id: 27, name: 'LTC', rate: 1 },
    { id: 28, name: 'DOGE', rate: 1 },
    { id: 29, name: 'BNB', rate: 1 },
    { id: 30, name: 'INB', rate: 1 },
    { id: 31, name: 'HOT', rate: 1 },
    { id: 32, name: 'CEL', rate: 1 },
    { id: 33, name: 'MATIC', rate: 1 },
    { id: 34, name: 'IOST', rate: 1 },
    { id: 35, name: 'MANA', rate: 1 },
    { id: 36, name: 'WAX', rate: 1 },
    { id: 37, name: 'ELF', rate: 1 },
    { id: 38, name: 'GNO', rate: 1 },
    { id: 39, name: 'POWR', rate: 1 },
    { id: 40, name: 'WINGS', rate: 1 },
    { id: 41, name: 'MTL', rate: 1 },
    { id: 42, name: 'KNC', rate: 1 },
    { id: 43, name: 'GVT', rate: 1 },
    { id: 44, name: 'REP', rate: 1 },
    { id: 45, name: 'FUN', rate: 1 },
    { id: 46, name: 'DRGN', rate: 1 }
];

export const coin_list_for_ecombar: Coin[] = [
    { id: 1, name: 'DUSD', rate: 1 },
    { id: 2, name: 'USDT', rate: 1 },
    { id: 3, name: 'BTC', rate: 1 },
    { id: 4, name: 'ETH', rate: 1 },
    { id: 5, name: 'FAB', rate: 1 },
    { id: 5, name: 'EXG', rate: 1 },
    { id: 5, name: 'DSC', rate: 1 },
    { id: 5, name: 'BST', rate: 1 }
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

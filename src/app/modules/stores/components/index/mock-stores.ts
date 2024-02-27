
// 虚拟商家数据（测试）

export class StoreInfo {    // 商家列表
    image: string;
    name: string;
    phone: string;
    text: string;
    star: string;    // 小数显示不便
    address: string;
}

export class StoreInfo2 {    // 热门推荐
    order: number;
    image: string;
    name: string;
    text: string;
}

export class StoreInfo3 {    // 最新入驻
    image: string;
    name: string;
    text: string;
    star: string;    // 小数显示不便
}

// import { StoreInfo } from './StoreInfo';

export const StoreList: StoreInfo[] = [    // 商家列表
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 1", star: "4.9", phone: "(416)111-2221", text: "标签11 标签12", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 2", star: "4.8", phone: "(416)111-2222", text: "标签21 标签22", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 3", star: "4.7", phone: "(416)111-2223", text: "标签31 标签32", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 4", star: "4.6", phone: "(416)111-2224", text: "标签41 标签42", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 5", star: "4.5", phone: "(416)111-2225", text: "标签51 标签52", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 6", star: "4.4", phone: "(416)111-2226", text: "标签61 标签62", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 7", star: "4.3", phone: "(416)111-2227", text: "标签71 标签72", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 8", star: "4.3", phone: "(416)111-2228", text: "标签81 标签82", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 9", star: "4.1", phone: "(416)111-2229", text: "标签91 标签92", address: "多伦多北约克" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 10",star: "4.0", phone: "(416)111-2220", text: "标签01 标签02", address: "多伦多北约克" },
];

export const StoreListHot: StoreInfo2[] = [    // 热门推荐
    { order: 1, image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 1", text: "五星餐厅 无敌湖景" },
    { order: 2, image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 3", text: "四星餐厅 五星服务" },
    { order: 3, image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 5", text: "好吃 纯天然" },
    { order: 4, image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 7", text: "好吃 好玩" },
    { order: 5, image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 9", text: "价美 物廉" },
];

export const StoreListNew: StoreInfo3[] = [    // 最新入驻
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 6", star: "1.0", text: "九折酬宾" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 7", star: "1.0", text: "九折酬宾" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 8", star: "0.5", text: "九折酬宾" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 9", star: "0.0", text: "九折酬宾" },
    { image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", name: "Aukfa 10",star: "0.0", text: "九折酬宾" },
];

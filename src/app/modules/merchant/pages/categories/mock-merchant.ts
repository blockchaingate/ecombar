
// 虚拟商家数据（测试）

export class StoreInfo {    // 商家信息
    image: string;
    name: string;
    phone: string;
    text: string;
    star: string;    // 小数显示不便
    address: string;
}

export const MyStore: StoreInfo = { 
    image: "https://prodid.s3.amazonaws.com/45fdssirfssss/aukfa.png", 
    name: "Aukfa 1", 
    phone: "(416)111-2221", 
    text: "标签11 标签12", 
    star: "4.9", 
    address: "多伦多北约克" 
}

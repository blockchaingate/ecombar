
// import aguid from 'aguid'
import { customAlphabet } from 'nanoid'
import { MongoClient } from "mongodb";    // https://docs.mongodb.com/drivers/node/current/

import config from '../config.js';
import logger from "../logger.js";

const nanoid = customAlphabet('2345678abcdefhijkmnpqrstuvwxyz', 10)    // 自定义字母和大小

export default {

    async listProduct( skip, limit ) {
        try {
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("product");
            if (skip == null) skip = 0;    // 缺省从头开始
            if (limit == null) limit = config.mongo.find.limit;    // 缺省用最大值 100
            const docs = await table.aggregate([    // aggregate 聚合操作
                {   $skip: skip    // .skip(skip)  跳过指定数量的文档
                },
                {   $limit: limit    // .limit(limit)  限制返回的文档数量
                },
            ]).toArray();
            client.close();    // 关闭数据库先
            return docs;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return null;    // 错误返回
        }
    },

    async infoProduct( id ) {
        try {
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("product");
            let docs = await table.aggregate([    // aggregate 聚合操作
                {   $match: { "id": id }    // 条件筛选关键词，类似 MySQL 的 where
                },
                {   $limit: 1    // .limit(limit)  限制返回的文档数量
                },
            ]).toArray();
            client.close();    // 关闭数据库先
            if (docs.length >= 1) {    // 查到有此记录
                return docs[0];
            } else {
                return -2;
            }
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async deleteProduct( id ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("product");
            const res = await table.deleteOne( { "id": id } );    // deleteMany 多条
            flag = res.deletedCount;    // 删除记录个数
            client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async createProduct( category, title, titleSc, titleTc, subtitle, subtitleSc, subtitleTc, desc, descSc, descTc, 
        flavor, flavorSc, flavorTc, sizes, sizesSc, sizesTc, price, taxRate, quantity, images ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("product");
            const uuid = nanoid();
            const titleSet = {
                "en": title,
                "sc": titleSc,
                "tc": titleTc
            };
            const subtitleSet = {
                "en": subtitle,
                "sc": subtitleSc,
                "tc": subtitleTc
            };
            const descSet = {
                "en": desc,
                "sc": descSc,
                "tc": descTc
            };
            const flavorSet = {
                "en": flavor,
                "sc": flavorSc,
                "tc": flavorTc
            };
            const sizesSet = {
                "en": sizes,
                "sc": sizesSc,
                "tc": sizesTc
            };
            await table.insertOne( {"id": uuid, "category": category, 
                                    "title": title, "titleSet": titleSet, "subtitleSet": subtitleSet, "descSet": descSet,
                                    "flavorSet": flavorSet, "sizesSet": sizesSet, 
                                    "price": price, "taxRate": taxRate, "quantity": quantity, "images": images} );
            await client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async updateProduct( uuid, category, title, titleSc, titleTc, subtitle, subtitleSc, subtitleTc, desc, descSc, descTc, 
        flavor, flavorSc, flavorTc, sizes, sizesSc, sizesTc, price, taxRate, quantity, images ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("product");
            const res = await table.findOne( {"id": uuid} );    // 查找指定记录
            if (res != null) {
                const titleSet = {
                    "en": title,
                    "sc": titleSc,
                    "tc": titleTc
                };
                const subtitleSet = {
                    "en": subtitle,
                    "sc": subtitleSc,
                    "tc": subtitleTc
                };
                const descSet = {
                    "en": desc,
                    "sc": descSc,
                    "tc": descTc
                };
                const flavorSet = {
                    "en": flavor,
                    "sc": flavorSc,
                    "tc": flavorTc
                };
                const sizesSet = {
                    "en": sizes,
                    "sc": sizesSc,
                    "tc": sizesTc
                };
                    const res0 = await table.updateOne( {"id": uuid}, 
                                { $set: {"category": category, 
                                         "title": title, "titleSet": titleSet, "subtitleSet": subtitleSet, "descSet": descSet,
                                         "flavorSet": flavorSet, "sizesSet": sizesSet, 
                                         "price": price, "taxRate": taxRate, "quantity": quantity, "images": images}} );
                flag = res0.modifiedCount;    // 更改记录个数
            } else {
                flag = -2;    // 此记录不存在
            }
            await client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

}

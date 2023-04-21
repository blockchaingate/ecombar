
// import aguid from 'aguid'
import { customAlphabet } from 'nanoid'
import { MongoClient } from "mongodb";    // https://docs.mongodb.com/drivers/node/current/

import config from '../config.js';
import logger from "../logger.js";

const nanoid = customAlphabet('2345678abcdefhijkmnpqrstuvwxyz', 10)    // 自定义字母和大小

export default {

    async listTable( skip, limit ) {
        try {
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("table");
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

    async infoTable( number ) {
        try {
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("table");
            let docs = await table.aggregate([    // aggregate 聚合操作
                {   $match: { "number": number }    // 条件筛选关键词，类似 MySQL 的 where
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

    async deleteTable( number ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("table");
            const res = await table.deleteOne( { "number": number } );    // deleteMany 多条
            flag = res.deletedCount;    // 删除记录个数
            client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async createTable( number, name, nameSc, nameTc ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("table");
            let res = await table.findOne( {"number": number} );    // 查找首条记录
            if (res != null) {    // 已存在此记录
                flag = -2;
            } else {
                const nameSet = {
                    "en": name,
                    "sc": nameSc,
                    "tc": nameTc
                };
                await table.insertOne( {"number": number, "name": name, "nameSet": nameSet} );
            } 
            await client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async updateTable( number, name, nameSc, nameTc ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("table");
            let res = await table.findOne( {"number": number} );    // 查找首条记录
            if (res != null) {    // 已存在此记录
                const nameSet = {
                    "en": name,
                    "sc": nameSc,
                    "tc": nameTc
                };
                const res0 = await table.updateOne( {"number": number}, 
                                { $set: {"name": name, "nameSet": nameSet}} );
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

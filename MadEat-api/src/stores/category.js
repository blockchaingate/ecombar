
// import aguid from 'aguid'
import { customAlphabet } from 'nanoid'
import { MongoClient } from "mongodb";    // https://docs.mongodb.com/drivers/node/current/

import config from '../config.js';
import logger from "../logger.js";

const nanoid = customAlphabet('2345678abcdefhijkmnpqrstuvwxyz', 10)    // 自定义字母和大小

export default {

    async listCategory( skip, limit ) {
        try {
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("category");
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

    async infoCategory( id ) {
        try {
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("category");
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

    async deleteCategory( id ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("category");
            const res = await table.deleteOne( { "id": id } );    // deleteMany 多条
            flag = res.deletedCount;    // 删除记录个数
            client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async createCategory( name, nameSc, nameTc, image, category ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("category");
            const uuid = nanoid();
            const nameSet = {
                "en": name,
                "sc": nameSc,
                "tc": nameTc
            };
            await table.insertOne( {"id": uuid, "name": name, "nameSet": nameSet, "image": image, "category": category} );
            await client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async updateCategory( uuid, name, nameSc, nameTc, image, category ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("category");
            const res = await table.findOne( {"id": uuid} );    // 查找指定记录
            if (res != null) {
                    const nameSet = {
                        "en": name,
                        "sc": nameSc,
                        "tc": nameTc
                    };
                    const res0 = await table.updateOne( {"id": uuid}, 
                                { $set: {"name": name, "nameSet": nameSet, "image": image, "category": category}} );
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


import aguid from 'aguid'
import { customAlphabet } from 'nanoid'
import { MongoClient } from "mongodb";    // https://docs.mongodb.com/drivers/node/current/

import config from '../config.js';
import logger from "../logger.js";

const nanoid = customAlphabet('2345678abcdefhijkmnpqrstuvwxyz', 10)    // 自定义字母和大小

export default {

    async listOrder( tNumber, skip, limit ) {
        try {
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("order");
            if (tNumber == null) tNumber = 0;    // 缺省查找全部
            if (skip == null) skip = 0;    // 缺省从头开始
            if (limit == null) limit = config.mongo.find.limit;    // 缺省用最大值 100
            let docs = [];
            if (tNumber <= 0) {
                docs = await table.aggregate([    // aggregate 聚合操作
                    {   $skip: skip    // .skip(skip)  跳过指定数量的文档
                    },
                    {   $limit: limit    // .limit(limit)  限制返回的文档数量
                    },
                ]).toArray();
            } else {
                docs = await table.aggregate([    // aggregate 聚合操作
                    {   $match: { "table": tNumber }    // 条件筛选关键词，类似 MySQL 的 where
                    },
                    {   $skip: skip    // .skip(skip)  跳过指定数量的文档
                    },
                    {   $limit: limit    // .limit(limit)  限制返回的文档数量
                    },
                ]).toArray();
            }
            client.close();    // 关闭数据库先
            return docs;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return null;    // 错误返回
        }
    },

    async infoOrder( id ) {
        try {
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("order");
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

    async deleteOrder( id ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("order");
            const res = await table.deleteOne( { "id": id } );    // deleteMany 多条
            flag = res.deletedCount;    // 删除记录个数
            client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async createOrder( tNumber, total, subtotal, tax, items, status ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("order");
            const uuid = aguid();
            const uuid2 = aguid();
            const time = Math.floor(Date.now() / 1000);    // 秒级时间戳
            await table.insertOne( {"id": uuid, "idExt": uuid2, "table": tNumber, 
                                    "total": total, "subtotal": subtotal, "tax": tax, "tips": 0, "items": items,
                                    "status": status, "create": time, "update": time} );
            await client.close();    // 关闭数据库先
            return flag;
        } catch(err) {    // catch any mongo error here
            console.error(err); 
            return -1;    // 错误返回
        }
    },

    async updateOrder( idExt, total, subtotal, tax, tips, items, status ) {
        try {
            let flag = 1;    // 成功标志
            const client = await MongoClient.connect(config.mongo.url);
            const db = client.db();    // "madeat"
            const table = db.collection("order");
            const res = await table.findOne( {"idExt": idExt} );    // 查找指定记录
            if (res != null) {
                    const time = Math.floor(Date.now() / 1000);    // 秒级时间戳
                    const res0 = await table.updateOne( {"idExt": idExt}, 
                                { $set: {"total": total, "subtotal": subtotal, "tax": tax, "tips": tips, "items": items, 
                                         "status": status, "update": time}} );
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

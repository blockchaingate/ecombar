
import errors, { PermissionError, BusinessError } from "../errors/errors.js";

import table_store from '../../stores/table.js'

export default {

    async listTable( skip, limit ) {
        const res = await table_store.listTable(skip, limit);

        if (res == null) {    // null 错误返回，[] 查无记录
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async infoTable( number ) {
        const res = await table_store.infoTable(number);

        switch (res) {    // -1 错误返回，-2 无此记录
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.RECORD_NOT_EXISTS);  break;    // 此记录不存在
        }
        return res;
    },

    async deleteTable( id ) {
        const res = await table_store.deleteTable(id);

        if (res == null) {    // null 错误返回，[] 查无记录
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async createTable( number, name, nameSc, nameTc ) {
        if (nameSc == null) nameSc = "";    // 缺省为 ""
        if (nameTc == null) nameTc = "";    // 缺省为 ""

        const res = await table_store.createTable(number, name, nameSc, nameTc);

        switch (res) {    // -1 错误返回，1 操作成功
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.TABLE_EXISTS);  break;    // 此桌台已存在
        }
        return res;
    },

    async updateTable( number, name, nameSc, nameTc ) {
        if (nameSc == null) nameSc = "";    // 缺省为 ""
        if (nameTc == null) nameTc = "";    // 缺省为 ""

        const res = await table_store.updateTable(number, name, nameSc, nameTc);

        switch (res) {    // -1 错误返回，1 操作成功
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.RECORD_NOT_EXISTS);  break;    // 此记录不存在
        }
        return res;
    },

}


import order_store from '../../stores/order.js'

import errors, { PermissionError, BusinessError } from "../errors/errors.js";

export default {

    async listOrder( skip, limit ) {
        const res = await order_store.listOrder(skip, limit);

        if (res == null) {    // null 错误返回，[] 查无记录
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async infoOrder( id ) {
        const res = await order_store.infoOrder(id);

        switch (res) {    // -1 错误返回，-2 无此记录
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.RECORD_NOT_EXISTS);  break;    // 此记录不存在
        }
        return res;
    },
    
    async deleteOrder( id ) {
        const res = await order_store.deleteOrder(id);

        if (res == null) {    // null 错误返回，[] 查无记录
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async createOrder( tNumber, total, subtotal, tax, items, status ) {
        const res = await order_store.createOrder(tNumber, total, subtotal, tax, items, status);

        if (res == -1) {    // -1 错误返回，1 操作成功
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async updateOrder( idExt, total, subtotal, tax, tips, items, status ) {
        if (tips == null) tips = 0;    // 缺省为 0
        const res = await order_store.updateOrder(idExt, total, subtotal, tax, tips, items, status);

        switch (res) {    // -1 错误返回，1 操作成功
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.RECORD_NOT_EXISTS);  break;    // 此记录不存在
        }
        return res;
    },

}


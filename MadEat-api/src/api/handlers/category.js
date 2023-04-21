
import category_store from '../../stores/category.js'

import errors, { PermissionError, BusinessError } from "../errors/errors.js";

export default {

    async listCategory( skip, limit ) {
        const res = await category_store.listCategory(skip, limit);

        if (res == null) {    // null 错误返回，[] 查无记录
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async infoCategory( id ) {
        const res = await category_store.infoCategory(id);

        switch (res) {    // -1 错误返回，-2 无此记录
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.RECORD_NOT_EXISTS);  break;    // 此记录不存在
        }
        return res;
    },
    
    async deleteCategory( id ) {
        const res = await category_store.deleteCategory(id);

        if (res == null) {    // null 错误返回，[] 查无记录
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async createCategory( name, nameSc, nameTc, image, category ) {
        if (nameSc == null) nameSc = "";    // 缺省为 ""
        if (nameTc == null) nameTc = "";    // 缺省为 ""
        if (image == null) image = "";    // 缺省为 ""
        if (category == null) category = "";    // 缺省为 ""

        const res = await category_store.createCategory(name, nameSc, nameTc, image, category);

        if (res == -1) {    // -1 错误返回，1 操作成功
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async updateCategory( id, name, nameSc, nameTc, image, category ) {
        if (nameSc == null) nameSc = "";    // 缺省为 ""
        if (nameTc == null) nameTc = "";    // 缺省为 ""
        if (image == null) image = "";    // 缺省为 ""
        if (category == null) category = "";    // 缺省为 ""

        const res = await category_store.updateCategory(id, name, nameSc, nameTc, image, category);

        switch (res) {    // -1 错误返回，1 操作成功
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.RECORD_NOT_EXISTS);  break;    // 此记录不存在
        }
        return res;
    },

}

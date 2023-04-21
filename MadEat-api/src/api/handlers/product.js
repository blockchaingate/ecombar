
import product_store from '../../stores/product.js'

import errors, { PermissionError, BusinessError } from "../errors/errors.js";

export default {

    async listProduct( skip, limit ) {
        const res = await product_store.listProduct(skip, limit);

        if (res == null) {    // null 错误返回，[] 查无记录
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async infoProduct( id ) {
        const res = await product_store.infoProduct(id);

        switch (res) {    // -1 错误返回，-2 无此记录
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.RECORD_NOT_EXISTS);  break;    // 此记录不存在
        }
        return res;
    },

    async deleteProduct( id ) {
        const res = await product_store.deleteProduct(id);

        if (res == null) {    // null 错误返回，[] 查无记录
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async createProduct( category, title, titleSc, titleTc, subtitle, subtitleSc, subtitleTc, desc, descSc, descTc, 
        flavor, flavorSc, flavorTc, sizes, sizesSc, sizesTc, price, taxRate, quantity, images ) {
        if (category == null) category = "";    // 缺省为 ""
        if (titleSc == null) titleSc = "";    // 缺省为 ""
        if (titleTc == null) titleTc = "";    // 缺省为 ""
        if (subtitle == null) subtitle = "";    // 缺省为 ""
        if (subtitleSc == null) subtitleSc = "";    // 缺省为 ""
        if (subtitleTc == null) subtitleTc = "";    // 缺省为 ""
        if (desc == null) desc = "";    // 缺省为 ""
        if (descSc == null) descSc = "";    // 缺省为 ""
        if (descTc == null) descTc = "";    // 缺省为 ""

        if (flavor == null) flavor = "";    // 缺省为 ""
        if (flavorSc == null) flavorSc = "";    // 缺省为 ""
        if (flavorTc == null) flavorTc = "";    // 缺省为 ""
        if (sizes == null) sizes = "";    // 缺省为 ""
        if (sizesSc == null) sizesSc = "";    // 缺省为 ""
        if (sizesTc == null) sizesTc = "";    // 缺省为 ""
        if (images == null) images = "";    // 缺省为 ""

        if (flavor == "") {
            flavor = [];
        } else {
            flavor = flavor.split('|');    // 按 | 分割
        }
        if (flavorSc == "") {
            flavorSc = [];
        } else {
            flavorSc = flavorSc.split('|');    // 按 | 分割
        }
        if (flavorTc == "") {
            flavorTc = [];
        } else {
            flavorTc = flavorTc.split('|');    // 按 | 分割
        }
        if (sizes == "") {
            sizes = [];
        } else {
            sizes = sizes.split('|');    // 按 | 分割
        }
        if (sizesSc == "") {
            sizesSc = [];
        } else {
            sizesSc = sizesSc.split('|');    // 按 | 分割
        }
        if (sizesTc == "") {
            sizesTc = [];
        } else {
            sizesTc = sizesTc.split('|');    // 按 | 分割
        }
        if (images == "") {
            images = [];
        } else {
            images = images.split('|');    // 按 | 分割
        }
         
        const res = await product_store.createProduct(category, title, titleSc, titleTc, subtitle, subtitleSc, subtitleTc, desc, descSc, descTc, 
            flavor, flavorSc, flavorTc, sizes, sizesSc, sizesTc, price, taxRate, quantity, images);

        if (res == -1) {    // -1 错误返回，1 操作成功
            throw new BusinessError(errors.CONNECT_ERROR);
        }
        return res;
    },

    async updateProduct( id, category, title, titleSc, titleTc, subtitle, subtitleSc, subtitleTc, desc, descSc, descTc, 
        flavor, flavorSc, flavorTc, sizes, sizesSc, sizesTc, price, taxRate, quantity, images ) {
        if (category == null) category = "";    // 缺省为 ""
        if (titleSc == null) titleSc = "";    // 缺省为 ""
        if (titleTc == null) titleTc = "";    // 缺省为 ""
        if (subtitle == null) subtitle = "";    // 缺省为 ""
        if (subtitleSc == null) subtitleSc = "";    // 缺省为 ""
        if (subtitleTc == null) subtitleTc = "";    // 缺省为 ""
        if (desc == null) desc = "";    // 缺省为 ""
        if (descSc == null) descSc = "";    // 缺省为 ""
        if (descTc == null) descTc = "";    // 缺省为 ""

        if (flavor == null) flavor = "";    // 缺省为 ""
        if (flavorSc == null) flavorSc = "";    // 缺省为 ""
        if (flavorTc == null) flavorTc = "";    // 缺省为 ""
        if (sizes == null) sizes = "";    // 缺省为 ""
        if (sizesSc == null) sizesSc = "";    // 缺省为 ""
        if (sizesTc == null) sizesTc = "";    // 缺省为 ""
        if (images == null) images = "";    // 缺省为 ""

        if (flavor == "") {
            flavor = [];
        } else {
            flavor = flavor.split('|');    // 按 | 分割
        }
        if (flavorSc == "") {
            flavorSc = [];
        } else {
            flavorSc = flavorSc.split('|');    // 按 | 分割
        }
        if (flavorTc == "") {
            flavorTc = [];
        } else {
            flavorTc = flavorTc.split('|');    // 按 | 分割
        }
        if (sizes == "") {
            sizes = [];
        } else {
            sizes = sizes.split('|');    // 按 | 分割
        }
        if (sizesSc == "") {
            sizesSc = [];
        } else {
            sizesSc = sizesSc.split('|');    // 按 | 分割
        }
        if (sizesTc == "") {
            sizesTc = [];
        } else {
            sizesTc = sizesTc.split('|');    // 按 | 分割
        }
        if (images == "") {
            images = [];
        } else {
            images = images.split('|');    // 按 | 分割
        }
         
        const res = await product_store.updateProduct(id, category, title, titleSc, titleTc, subtitle, subtitleSc, subtitleTc, desc, descSc, descTc, 
            flavor, flavorSc, flavorTc, sizes, sizesSc, sizesTc, price, taxRate, quantity, images);

        switch (res) {    // -1 错误返回，1 操作成功
            case -1: throw new BusinessError(errors.CONNECT_ERROR);  break;    // 数据库连接错
            case -2: throw new BusinessError(errors.RECORD_NOT_EXISTS);  break;    // 此记录不存在
        }
        return res;
    },

}




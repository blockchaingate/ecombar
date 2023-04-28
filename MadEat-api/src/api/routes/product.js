
import Joi from '@hapi/joi'

import { handleRestException } from "../handlers.js";
import product_handler from '../handlers/product.js'

import errors, { PermissionError, BusinessError } from "../errors/errors.js";

import config from '../../config.js';

export default (server) => {

    server.route({
        method: 'GET',
        path: '/product/list',
        config: {
            tags: ['api'],
            description: '查看 Product 列表（游客）',
            auth: false,
            validate: {
                query: Joi.object({    // 可改 skip, limit
                    skip: Joi.number().integer().min(0),
                    limit: Joi.number().integer().min(1).max(1000),    // 最多 1000 条
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            product_handler.listProduct(request.query.skip, request.query.limit))
    })

    server.route({
        method: 'GET',
        path: '/product/info',
        config: {
            tags: ['api'],
            description: '查看 Product 信息（游客）',
            auth: false,
            validate: {
                query: Joi.object({
                    id: Joi.string().required(),
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            product_handler.infoProduct(request.query.id))
    })

    server.route({
        method: 'DELETE',
        path: '/product/delete',
        config: {
            tags: ['api'],
            description: '删除 Product',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                query: Joi.object({
                    id: Joi.string().required(),
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            product_handler.deleteProduct(request.query.id))
    })

    server.route({
        method: 'PUT',
        path: '/product/create',
        config: {
            tags: ['api'],
            description: '增添 Product',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                payload: {
                    // “id 类别编号”自动生成
                    category: Joi.string().max(50).allow(''),    // 缺省为 ""
                    title: Joi.string().max(200).required(), 
                    titleSc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    titleTc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    subtitle: Joi.string().max(200).allow(''),    // 缺省为 ""
                    subtitleSc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    subtitleTc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    desc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    descSc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    descTc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    flavor: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    flavorSc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    flavorTc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    sizes: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    sizesSc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    sizesTc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    price: Joi.number().required(),
                    taxRate: Joi.number().required(),
                    quantity: Joi.number().required(),
                    images: Joi.string().max(1000).allow(''),    // 缺省为 ""
                }
            },
        },
        handler: (request) => handleRestException( async () =>
            product_handler.createProduct( request.payload.category,  // request.auth.credentials.id, 
                request.payload.title, request.payload.titleSc, request.payload.titleTc, 
                request.payload.subtitle, request.payload.subtitleSc, request.payload.subtitleTc, 
                request.payload.desc, request.payload.descSc, request.payload.descTc, 
                request.payload.flavor, request.payload.flavorSc, request.payload.flavorTc, 
                request.payload.sizes, request.payload.sizesSc, request.payload.sizesTc, 
                request.payload.price, request.payload.taxRate, request.payload.quantity, request.payload.images))
    })

    server.route({
        method: 'PUT',
        path: '/product/update',
        config: {
            tags: ['api'],
            description: '修改 Product',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                payload: {
                    id: Joi.string().max(50).required(), 
                    category: Joi.string().max(50).allow(''),    // 缺省为 ""
                    title: Joi.string().max(200).required(), 
                    titleSc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    titleTc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    subtitle: Joi.string().max(200).allow(''),    // 缺省为 ""
                    subtitleSc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    subtitleTc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    desc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    descSc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    descTc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    flavor: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    flavorSc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    flavorTc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    sizes: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    sizesSc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    sizesTc: Joi.string().max(1000).allow(''),    // 缺省为 ""
                    price: Joi.number().required(),
                    taxRate: Joi.number().required(),
                    quantity: Joi.number().required(),
                    images: Joi.string().max(1000).allow(''),    // 缺省为 ""
                }
            },
        },
        handler: (request) => handleRestException( async () =>
            product_handler.updateProduct( request.payload.id, request.payload.category,  // request.auth.credentials.id, 
                request.payload.title, request.payload.titleSc, request.payload.titleTc, 
                request.payload.subtitle, request.payload.subtitleSc, request.payload.subtitleTc, 
                request.payload.desc, request.payload.descSc, request.payload.descTc, 
                request.payload.flavor, request.payload.flavorSc, request.payload.flavorTc, 
                request.payload.sizes, request.payload.sizesSc, request.payload.sizesTc, 
                request.payload.price, request.payload.taxRate, request.payload.quantity, request.payload.images))
    })
}

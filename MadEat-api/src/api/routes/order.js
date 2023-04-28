
import Joi from '@hapi/joi'

import { handleRestException } from "../handlers.js";
import order_handler from '../handlers/order.js'

import errors, { PermissionError, BusinessError } from "../errors/errors.js";

import config from '../../config.js';

export default (server) => {

    server.route({
        method: 'GET',
        path: '/order/list',
        config: {
            tags: ['api'],
            description: '查看 Order 列表（游客）',
            auth: false,
            validate: {
                query: Joi.object({    // 可改 skip, limit
                    table: Joi.number().integer().min(0),  // 指定桌台，全部为０
                    skip: Joi.number().integer().min(0),
                    limit: Joi.number().integer().min(1).max(1000),    // 最多 1000 条
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            order_handler.listOrder(request.query.table, request.query.skip, request.query.limit))
    })

    server.route({
        method: 'GET',
        path: '/order/info',
        config: {
            tags: ['api'],
            description: '查看 Order 信息（游客）',
            auth: false,
            validate: {
                query: Joi.object({
                    id: Joi.string().required(),
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            order_handler.infoOrder(request.query.id))
    })

    server.route({
        method: 'DELETE',
        path: '/order/delete',
        config: {
            tags: ['api'],
            description: '删除 Order',
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
            order_handler.deleteOrder(request.query.id))
    })

    server.route({
        method: 'PUT',
        path: '/order/create',
        config: {
            tags: ['api'],
            description: '增添 Order',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                payload: {
                    // “id 类别编号”自动生成
                    table: Joi.number().integer().min(0).required(),
                    total: Joi.number().min(0).required(),
                    subtotal: Joi.number().min(0).required(),
                    tax: Joi.number().min(0).required(),
                    items: Joi.array().items( Joi.object({
                        pid: Joi.string().required(),
                        title: Joi.string().required(),
                        flavor: Joi.string().allow(''),
                        size: Joi.string().allow(''),
                        price: Joi.number().min(0).required(),
                        taxRate: Joi.number().min(0).required(),
                        quantity: Joi.number().min(0).integer().required(),
                        flag: Joi.number().integer().required()
                    }) ).default([]),
                    status: Joi.number().integer().required(),
                }
            },
        },
        handler: (request) => handleRestException( async () =>
            order_handler.createOrder(  // request.auth.credentials.id, 
                request.payload.table, request.payload.total, request.payload.subtotal, request.payload.tax, 
                request.payload.items, request.payload.status))
    })

    server.route({
        method: 'PUT',
        path: '/order/update',
        config: {
            tags: ['api'],
            description: '修改 Order',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                payload: {
                    idExt: Joi.string().required(),
                    total: Joi.number().min(0).required(),
                    subtotal: Joi.number().min(0).required(),
                    tax: Joi.number().min(0).required(),
                    tips: Joi.number().min(0),
                    items: Joi.array().items( Joi.object({
                        pid: Joi.string().required(),
                        title: Joi.string().required(),
                        flavor: Joi.string().allow(''),
                        size: Joi.string().allow(''),
                        price: Joi.number().min(0).required(),
                        taxRate: Joi.number().min(0).required(),
                        quantity: Joi.number().min(0).integer().required(),
                        flag: Joi.number().integer().required()
                    }) ).default([]),
                    status: Joi.number().integer().required(),
                }
            },
        },
        handler: (request) => handleRestException( async () =>
            order_handler.updateOrder(  // request.auth.credentials.id, 
                request.payload.idExt, request.payload.total, request.payload.subtotal, request.payload.tax, request.payload.tips, 
                request.payload.items, request.payload.status))
    })

}

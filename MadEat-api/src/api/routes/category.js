
import Joi from '@hapi/joi'

import { handleRestException } from "../handlers.js";
import category_handler from '../handlers/category.js'

import errors, { PermissionError, BusinessError } from "../errors/errors.js";

import config from '../../config.js';

export default (server) => {

    server.route({
        method: 'GET',
        path: '/category/list',
        config: {
            tags: ['api'],
            description: '查看 Category 列表（游客）',
            auth: false,
            validate: {
                query: Joi.object({    // 可改 skip, limit
                    skip: Joi.number().integer().min(0),
                    limit: Joi.number().integer().min(1).max(1000),    // 最多 1000 条
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            category_handler.listCategory(request.query.skip, request.query.limit))
    })

    server.route({
        method: 'GET',
        path: '/category/info',
        config: {
            tags: ['api'],
            description: '查看 Category 信息（游客）',
            auth: false,
            validate: {
                query: Joi.object({
                    id: Joi.string().required(),
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            category_handler.infoCategory(request.query.id))
    })

    server.route({
        method: 'DELETE',
        path: '/category/delete',
        config: {
            tags: ['api'],
            description: '删除 Category',
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
            category_handler.deleteCategory(request.query.id))
    })

    server.route({
        method: 'PUT',
        path: '/category/create',
        config: {
            tags: ['api'],
            description: '增添 Category',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                payload: {
                    // “id 类别编号”自动生成
                    name: Joi.string().max(200).required(), 
                    nameSc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    nameTc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    image: Joi.string().max(200).allow(''),    // 缺省为 ""
                    category: Joi.string().max(50).allow(''),    // 缺省为 ""
                }
            },
        },
        handler: (request) => handleRestException( async () =>
            category_handler.createCategory(  // request.auth.credentials.id, 
                request.payload.name, request.payload.nameSc, request.payload.nameTc, 
                request.payload.image, request.payload.category))
    })

    server.route({
        method: 'PUT',
        path: '/category/update',
        config: {
            tags: ['api'],
            description: '修改 Category',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                payload: {
                    id: Joi.string().max(50).required(), 
                    name: Joi.string().max(200).required(), 
                    nameSc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    nameTc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    image: Joi.string().max(200).allow(''),    // 缺省为 ""
                    category: Joi.string().max(50).allow(''),    // 缺省为 ""
                }
            },
        },
        handler: (request) => handleRestException( async () =>
            category_handler.updateCategory( request.payload.id,  // request.auth.credentials.id, 
                request.payload.name, request.payload.nameSc, request.payload.nameTc, 
                request.payload.image, request.payload.category))
    })

}

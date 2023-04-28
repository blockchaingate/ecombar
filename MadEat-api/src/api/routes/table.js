
import Joi from '@hapi/joi'

import { handleRestException } from "../handlers.js";
import table_handler from '../handlers/table.js'

import errors, { PermissionError, BusinessError } from "../errors/errors.js";

import config from '../../config.js';

export default (server) => {

    server.route({
        method: 'GET',
        path: '/table/list',
        config: {
            tags: ['api'],
            description: '查看 Table 列表（游客）',
            auth: false,
            validate: {
                query: Joi.object({    // 可改 skip, limit
                    skip: Joi.number().integer().min(0),
                    limit: Joi.number().integer().min(1).max(1000),    // 最多 1000 条
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            table_handler.listTable(request.query.skip, request.query.limit))
    })

    server.route({
        method: 'GET',
        path: '/table/info',
        config: {
            tags: ['api'],
            description: '查看 Table 信息（游客）',
            auth: false,
            validate: {
                query: Joi.object({
                    number: Joi.number().integer().required(),
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            table_handler.infoTable(request.query.number))
    })

    server.route({
        method: 'DELETE',
        path: '/table/delete',
        config: {
            tags: ['api'],
            description: '删除 Table',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                query: Joi.object({
                    number: Joi.number().integer().required(),
                })
            },
        },
        handler: (request) => handleRestException( async () =>
            table_handler.deleteTable(request.query.number))
    })

    server.route({
        method: 'PUT',
        path: '/table/create',
        config: {
            tags: ['api'],
            description: '增添 Table',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                payload: {
                    number: Joi.number().integer().required(),
                    name: Joi.string().max(200).required(), 
                    nameSc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    nameTc: Joi.string().max(200).allow(''),    // 缺省为 ""
                }
            },
        },
        handler: (request) => handleRestException( async () =>
            table_handler.createTable( request.payload.number,  // request.auth.credentials.id, 
                request.payload.name, request.payload.nameSc, request.payload.nameTc))
    })

    server.route({
        method: 'PUT',
        path: '/table/update',
        config: {
            tags: ['api'],
            description: '修改 Table',
            auth: false,
            // auth: {
            //     scope: ['user']    // 首先必须 Authorize，否则出错 Failed to fetch.
            // },
            validate: {
                payload: {
                    number: Joi.number().integer().required(),
                    name: Joi.string().max(200).required(), 
                    nameSc: Joi.string().max(200).allow(''),    // 缺省为 ""
                    nameTc: Joi.string().max(200).allow(''),    // 缺省为 ""
                }
            },
        },
        handler: (request) => handleRestException( async () =>
            table_handler.updateTable( request.payload.number,  // request.auth.credentials.id, 
                request.payload.name, request.payload.nameSc, request.payload.nameTc))
    })

}

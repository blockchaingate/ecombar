
import moment from 'moment'
import config from '../config.js';
import logger from "../logger.js";
import errors, { PermissionError, BusinessError } from "./errors/errors.js";

import Boom from '@hapi/boom'

export const handleRestException = async (func, finallyFunc, request) => {
    try {
        return {
            status: 200,    // 成功返回
            error: '0',
            message: '',
            timestamp: moment().utc().format(),    // 时间戳
         // data: ( await func() || "" )    // 返回 func 结果，缺省 ""
            data: ( await func() )    // 返回 func 结果。解决Bug: 数字 0 显示为 ""
        }
    } catch (e) {
        let boom
        if (e instanceof BusinessError) {    // 事务错误
            boom = Boom.badRequest(null, e)
            logger.debug(e)
        } else if (e instanceof PermissionError) {    // 权限错误
            boom = Boom.forbidden(null, e)
            logger.error(e)
        } else {
            boom = Boom.internal(null, e)
            logger.error(e)
        }

        boom.output.payload.status = boom.output.statusCode
        boom.output.payload.data = ""
        boom.output.payload.timestamp = moment().utc().format()
        boom.reformat()
        boom.output.payload.error = e.code || "-1"
        boom.output.payload.message = e.message
        delete boom.output.payload.statusCode
        return boom
    } finally {
        if (finallyFunc) {
            finallyFunc(request)
        }
    }
}


// 定义错误的两种类型

export class PermissionError extends Error {    // 权限错误
    constructor({code, message}) {
        super();
        this.code = code;
        this.message = message
    }
}

export class BusinessError extends Error {    // 事务错误
    constructor({code, message}) {
        super();
        this.code = code;
        this.message = message
    }
}

// 定义错误的编号信息

export default {
    UNKNOWN_ERROR: {code: -1, message: 'Unknown Error'},    // # 未知错误 #

    CONNECT_ERROR: {code: 1, message: 'Connect Error'},    // 数据库连接错
    INVALID_API: {code: 2, message: 'Invalid API'},    // 不合法的 API

    TABLE_EXISTS: {code: 11, message: 'Table Exists'},    // 此桌台已存在
    RECORD_NOT_EXISTS: {code: 12, message: 'Record Not Exists'},    // 此记录不存在
    
}

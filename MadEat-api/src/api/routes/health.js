
// 示例 Route
// ---------- ---------- ---------- ---------- ---------- ----------

import os from "os";

import { handleRestException } from "../handlers.js";

import config from '../../config.js';

// 获取本服 IP地址
function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i ++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}

export default (server) => {

    server.route({    // 使用 Hapi.js 模块
        method: 'GET',
        path: '/health',
        config: {
            tags: ['api'],
            description: 'Default health check',
            auth: false
        },
     // handler: () => handleRestException( () => "Well :)" )
        handler: () => handleRestException( async () => {
            const ip = getIPAdress();    // 本服 IP地址
            const path = config.api.tls.cert;    // 证书路径
            const list = path.split('/');    // 按 / 分割
            const cert = list[list.length - 1];    // 证书文件名
            return `${ip}, ${cert}`;    // "Well :)"
        })
    });

}


import fs from "fs";
import path from "path";
import yaml from "yaml";

export default {
    api: {    // 请见 config.yaml
        name: 'MadEat-api',
        host: 'localhost',    // 指定访问域名 'localhost' / 'api.madeat.ca'
        port: 6060,    // 指定访问端口
        prefix: undefined,
        tls: {
            key:  './src/certs/server.key',
            cert: './src/certs/server.crt'
        },
        swagger: {
            options: {
                pathPrefixSize: 1,
            },
            host: undefined,
            schemes: ['https']    // ['http', 'https']
        },
    },

    logger: {
        level: 'debug',
    },
    auth: {
        secret: "????????",  // Never Share your secret key
    },
    mongo: { },    // 请见 config.yaml
  
    signup: {
        token: {
            expirySeconds: 900,    // 300 (5分), 900 (15分)
        },
    },

    // 载入/初始配置表
    Init() { 
        let buffer = fs.readFileSync(path.resolve('./config.yaml'), 'utf8');    // 读入配置文件（要求'utf8'）
        let config = yaml.parse(buffer);    // 转换 TEXT -> JSON

        this.api.host = config.api.host;
        this.api.port = config.api.port;
        this.api.tls = config.api.tls;

        this.mongo = config.mongo;
    }
    
}

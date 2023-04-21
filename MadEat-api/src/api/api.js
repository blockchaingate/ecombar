
import fs from "fs";
import path from "path";
import config from '../config.js';
import logger from "../logger.js";
import failAction from "./failAction.js";
import { registerAuthStrategy } from "./auth.js";

import Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import Joi from '@hapi/joi';
import HapiSwagger from 'hapi-swagger';
import hapiAuthJwt2 from "hapi-auth-jwt2";    // hapi-auth-jwt2 认证

function getPlugins(apiName, pluginsExtensions, version) {
    const swaggerOptions = {
        debug: true,
        host: config.api.swagger.host,
        schemes: config.api.swagger.schemes,
        info: {
            'title': apiName,
            'version': version
        },
        securityDefinitions: {
            'jwt': {
                'type': 'apiKey',
                'name': 'Authorization',
                'in': 'header'
            }
        },
        security: [{ 'jwt': [] }],
        ...config.api.swagger.options
    };

    let plugins = [
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        },
        hapiAuthJwt2
    ];

    if (pluginsExtensions && pluginsExtensions.length) {
        plugins = plugins.concat(pluginsExtensions)
    }

    return plugins
}

export default {
    async start(appName, routesDirectories, plugins, version) {
     // let defaultRoutes = [path.resolve(__dirname, '../api/routes')].concat(routesDirectories || [])
        let defaultRoutes = routesDirectories || [path.resolve('./src/api/routes')];    // 提供缺省值 [ './src/api/routes' ]

        // let tls = {
        //     key: fs.readFileSync(path.resolve(config.api.tls.key)),    // , 'utf8'
        //     cert: fs.readFileSync(path.resolve(config.api.tls.cert)), 
        // };
        let defaultConOptions = {
            port: config.api.port, 
            host: config.api.host,    // 使用 "0.0.0.0"
            // tls: tls,    // 使用 https
            routes: {
                cors: {
                    origin: ['*'],    // 允许跨域请求
                    credentials: true
                },
                validate: {
                    failAction
                }
            }
        };

        // collect all the endpoints
        let defaultServer = await initServer(appName || config.api.name, defaultConOptions, plugins, version)    // 提供缺省值 config.api.name

        // register the authentication module
        registerAuthStrategy(defaultServer)

        await createRoutes(defaultServer, defaultRoutes)

        return {
            server: defaultServer
        }
    }
}

async function initServer(name, options, plugins, version) {
    let server = new Hapi.server(options);    // 使用 Hapi.js 模块
    server.realm.modifiers.route.prefix = config.api.prefix;
    createErrorLog(server);
    await server.register(getPlugins(name, plugins, version));
    server.validator(Joi);    // 不支持 require('@hapi/joi')
    await server.start();
    logger.info(`${name} Server running at: ${server.info.uri}`);
    return server;
}

function createErrorLog(server) {
    server.events.on('log', (event, tags) => {
        if (tags.error) {
            logger.error(`Server error: ${event ? JSON.stringify(event) : 'unknown'}`)
        }
    })
}

async function createRoutes(server, routeDirs) {
    await Promise.all(routeDirs.map(async route => {
        let files = fs.readdirSync(route)
        await Promise.all(files.map(async file => {
            if (file.indexOf('.js') > -1) {
                // await require(route + '/' + file).default(server)
                // Fix: ERR_UNSUPPORTED_ESM_URL_SCHEME，增加 'file:///'
                let module = await import('file:///' + route + '/' + file);
                module.default(server);
            }
        }))
    }))
}

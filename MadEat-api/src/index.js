
import path from "path";
import config from './config.js';
import api from "./api/api.js";

(async function() {
    config.Init();    // 载入/初始配置表

 // await api.start(config.api.name, [path.resolve(__dirname, './api/routes')])
    await api.start(config.api.name, [path.resolve('./src/api/routes')]);    // [ './src/api/routes' ]
}) ()


// 认证与授权 hapi-auth-jwt2
// ---------- ---------- ---------- ---------- ---------- ----------

import config from '../config.js';

export function registerAuthStrategy(server) {
    server.auth.strategy('jwt', 'jwt',    // 设置认证
        {
            key: config.auth.secret,  // Never Share your secret key
            validate  // validate function defined above
        });

    server.auth.default('jwt');
}

// 自定义一个你的认证方法
export async function validate(decoded, request, h) {
    // 文件: src/util/token.js
    // {
    //     id: '25975232-7237-4237-a237-23aa19a5e497',
    //     scope: [ 'user' ],
    //     iat: 8397212839,    // iat (Issued At)：签发时间
    //     exp: 8397212239     // exp (expiration time)：过期时间
    // }
    return { isValid: true, scope: decoded.scope };
};

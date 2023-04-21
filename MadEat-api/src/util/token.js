
import jwt from "jsonwebtoken";    // JSON Web Token
import config from '../config.js';
import user_store from '../stores/user_store.js'

export async function queryAuthorization( user ) {
    return {
        authorization: jwt.sign(    // 验证信息(必须)
            { id: user.id, scope: JSON.parse(user.group) }, 
            config.auth.secret,
            { algorithm: 'HS256', expiresIn: "24h" }
        ),
        // user: user_store.formatForResult(user),    // 用户基本信息
    };
}

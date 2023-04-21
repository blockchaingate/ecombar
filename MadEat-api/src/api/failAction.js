
// import Boom from '@hapi/boom'
import logger from "../logger.js";

export default async (request, h, err) => {
    // During development, log and respond with the full error.
    logger.error(err);
    throw err;
    // // In prod, log a limited error message and throw the default Bad Request error.
    // logger.error('ValidationError:', err.message);  // Better to use an actual logger here.
    // throw Boom.badRequest(`Invalid request payload input`);
}

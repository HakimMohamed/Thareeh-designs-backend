import { expressjwt } from 'express-jwt';
import constants from '../utils/constants';
import loadConfig from '../config/configLoader';
loadConfig();

const jwtMiddleware = expressjwt({
  secret: process.env.JWT_SECRET!,
  algorithms: ['HS256'],
  requestProperty: 'user',
}).unless({
  path: constants.PUBLIC_ROUTES,
});

export default jwtMiddleware;

import { StatusCodes } from 'http-status-codes';
import CustomApiError from './CustomApiError';

class Unauthorized extends CustomApiError {
  statusCode = StatusCodes.FORBIDDEN;

  constructor(message: string) {
    super(message);
  }
}

export default Unauthorized;

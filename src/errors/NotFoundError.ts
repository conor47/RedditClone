import { StatusCodes } from 'http-status-codes';
import CustomApiError from './CustomApiError';

class NotFoundError extends CustomApiError {
  statusCode = StatusCodes.NOT_FOUND;

  constructor(message: string) {
    super(message);
  }
}

export default NotFoundError;

import { StatusCodes } from 'http-status-codes';
import CustomApiError from './CustomApiError';

class UnauthenticatedError extends CustomApiError {
  statusCode = StatusCodes.UNAUTHORIZED;

  constructor(message: string) {
    super(message);
  }
}

export default UnauthenticatedError;

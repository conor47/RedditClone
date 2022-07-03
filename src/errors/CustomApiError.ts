import { StatusCodes } from 'http-status-codes';

abstract class CustomApiError extends Error {
  protected abstract statusCode: StatusCodes;

  constructor(message: string) {
    super(message);
  }
}

export default CustomApiError;

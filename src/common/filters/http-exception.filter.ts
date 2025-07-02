import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

/**
 * AllExceptionsFilter handles all uncaught exceptions and formats the error response.
 * It ensures a consistent error structure for HTTP responses.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Catches exceptions thrown in the application and sends a formatted JSON response.
   * @param exception The exception that was thrown.
   * @param host The arguments host containing request and response objects.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Standardizes the error response format
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

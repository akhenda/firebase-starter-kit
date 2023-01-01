/**
 * Error response payload
 * @param  {number} code
 * @param  {string} message
 * @return {object}
 */
export function errorPayload(code: number, message: string, rest = {}) {
  return {
    error: {
      code,
      type: (() => {
        switch (code) {
          case 400:
            return 'bad_request';
          case 401:
            return 'unauthorized';
          case 404:
            return 'not_found';
          case 409:
            return 'conflict';
          case 410:
            return 'gone';
          case 422:
            return 'unprocessable_entity';
          case 500:
            return 'internal_server_error';
          default:
            if (code > 400 && code < 500) return 'client_error';
            if (code > 500 && code < 600) return 'server_error';

            return 'unexpected_error';
        }
      })(),
      ...rest,
    },
    message,
    success: false,
  };
}

/**
 * Success response payload
 * @param  {string} message
 * @return {object}
 */
export function successPayload(message: string, rest = {}) {
  return {
    data: { ...rest },
    message,
    success: true,
  };
}

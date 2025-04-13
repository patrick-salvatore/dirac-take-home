export function createErrorResponse(statusCode: number, e: Error) {
  const errorResponse = { status_code: statusCode, msg: e.message };
  return errorResponse;
}

export class HttpError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

export class NotFoundError extends HttpError {
    constructor(message = "Resource not found") {
        super(404, message);
    }
}

export class BadRequestError extends HttpError {
    constructor(message = "Bad request") {
        super(400, message);
    }
}

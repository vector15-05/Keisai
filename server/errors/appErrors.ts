export class AppError extends Error{
    public readonly  statusCode: number
    public readonly isOperational: boolean

    constructor(message: string, statusCode: number, isOperational = true){
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        Object.setPrototypeOf(this, new.target.prototype)

        Error.captureStackTrace(this, this.constructor);

    }
}

export class BadRequestError extends AppError {
    constructor(message = "Bad Request Error"){
        super(message, 400);
    }
}

export class UnauthorisedAccess extends AppError {
    constructor(message = "Unauthorised Access"){
        super(message, 401);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resources not found"){
        super(message, 404);
    }
}
export class Result {

    protected errors = new Array<MessageError>();

    isSuccess = () => this.errors.length == 0;

    appendError(code: string, message: string, error?: Error) {
        const msgError = new MessageError(code, message, error);
        this.errors.push(msgError);
    }

    appendError2(msgError: MessageError) {
        this.errors.push(msgError);
    }

    getErrors = (): MessageError[] => this.errors;

    static ok = (): Result => new Result();

    static fail(code: string, message: string, error?: Error): Result {
        const result = new Result();
        result.appendError(code, message, error);

        return result;
    }

    static fail2(msgError: MessageError): Result {
        const result = new Result();
        result.appendError2(msgError);

        return result;
    }

    static fail5(msgErrors: MessageError[]): Result {
        const result = new Result();
        
        msgErrors.forEach((msgError) => {
            result.appendError2(msgError);
        });

        return result;
    }
}

export class ResultData<TData> extends Result {

    private data: TData;

    constructor(data?: TData) {
        super();
        if (data) {
            this.data = data;
        }
    }

    getData = (): TData => this.data == undefined ? null : this.data;
    static okWithData<TData>(data: TData): ResultData<TData> {
        return new ResultData<TData>(data);
    }

    static fail3<TData>(msgError: MessageError): ResultData<TData> {
        const result = new ResultData<TData>();
        result.appendError2(msgError);

        return result;
    }

    static fail4<TData>(msgErrors: MessageError[]): ResultData<TData> {
        const result = new ResultData<TData>();

        msgErrors.forEach((msgError) => {
            result.appendError2(msgError);
        });

        return result;
    }
}


export class MessageError {

    constructor(code: string, message: string, error?: Error) {
        this.code = code;
        this.message = message;

        if (error) {
            this.error = new ExceptionError(error.name, error.message, error.stack);
        }
    }

    code: string;
    message: string;
    error: ExceptionError;
}

export class ExceptionError implements Error {
    constructor(name: string, message: string, stack?: string) {
        this.name = name;
        this.message = message;
        this.stack = stack;
    }

    name: string;
    message: string;
    stack?: string;
}
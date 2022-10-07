import {Catch, ArgumentsHost, ExceptionFilter} from "@nestjs/common";
import TakenEmailException from "../exceptions/taken.email.exc";
import SomethingWrongExc from "../exceptions/something.wrong.exc";

@Catch(TakenEmailException, SomethingWrongExc)
export class VerifyEmailFilter implements ExceptionFilter {
    catch(exception: TakenEmailException,  host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        response
            .status(400)
            .json({
                message: exception.message,
                statusCode: 400,
                timestamp: new Date().toISOString(),
            });
    }
}
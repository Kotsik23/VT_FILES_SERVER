import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common"
import { NotFoundError } from "@prisma/client/runtime"
import { Response } from "express"

@Catch(NotFoundError)
export class NotFoundExceptionFilter implements ExceptionFilter {
	catch(exception: NotFoundError, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		return response
			.status(HttpStatus.NOT_FOUND)
			.json({ statusCode: HttpStatus.NOT_FOUND, error: "Not Found", message: exception.message })
	}
}

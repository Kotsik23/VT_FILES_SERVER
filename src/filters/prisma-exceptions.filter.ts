import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { Response } from "express"

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
	catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()

		switch (exception.code) {
			case "P2025": {
				return response
					.status(HttpStatus.NOT_FOUND)
					.json({ statusCode: HttpStatus.NOT_FOUND, error: "Not Found", message: "Record not found" })
			}
			case "P2002": {
				return response.status(HttpStatus.CONFLICT).json({
					statusCode: HttpStatus.CONFLICT,
					error: "Conflict",
					message: `Unique constraint failed on the [${exception.meta.target}]`,
				})
			}
			default: {
				console.log(exception)
				return response
					.status(HttpStatus.BAD_REQUEST)
					.json({ statusCode: HttpStatus.BAD_REQUEST, error: "Bad Request", message: "Something went wrong" })
			}
		}
	}
}

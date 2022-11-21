import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { NotFoundExceptionFilter } from "./filters/not-found.filter"
import { PrismaExceptionFilter } from "./filters/prisma-exceptions.filter"

async function bootstrap() {
	const PORT = process.env.PORT || 8001

	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: "http//:localhost:3000",
	})

	app.setGlobalPrefix("api")
	app.useGlobalPipes(new ValidationPipe())
	app.useGlobalFilters(new NotFoundExceptionFilter(), new PrismaExceptionFilter())

	await app.listen(PORT)
}
bootstrap()

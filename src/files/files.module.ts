import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { ServeStaticModule } from "@nestjs/serve-static"
import { path } from "app-root-path"
import { PrismaService } from "src/prisma/prisma.service"
import { FilesController } from "./files.controller"
import { FilesService } from "./files.service"

@Module({
	controllers: [FilesController],
	providers: [FilesService, PrismaService],
	imports: [
		ConfigModule,
		ServeStaticModule.forRoot({
			rootPath: `${path}/uploads`,
			serveRoot: "/uploads",
		}),
	],
})
export class FilesModule {}

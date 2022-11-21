import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseFilePipeBuilder,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { CopyFileDto } from "./dto/copy-file.dto"
import { CreateFolderDto } from "./dto/create-folder.dto"
import { DeleteFileDto } from "./dto/delete-file.dto"
import { RenameDto } from "./dto/rename.dto"
import { FilesService } from "./files.service"

@Controller("files")
export class FilesController {
	constructor(private readonly fileService: FilesService) {}

	@Get()
	async getAllFiles() {
		return this.fileService.getAllFiles({})
	}

	@Get("folder/:folder")
	async getFilesInFolder(@Param("folder") folder: string) {
		return this.fileService.getAllFiles({
			where: {
				folder,
			},
		})
	}

	@Get("folder")
	async readDirectory() {
		return this.fileService.readDirectory()
	}

	@Post("folder")
	async createFolder(@Body() data: CreateFolderDto) {
		return this.fileService.createFolder(data.folder)
	}

	@Post("folder/delete")
	@HttpCode(HttpStatus.OK)
	async deleteFolder(@Body() data: { name: string }) {
		return this.fileService.deleteFolder(data.name)
	}

	@Patch()
	async rename(@Body() dto: RenameDto) {
		return this.fileService.rename(dto)
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@UseInterceptors(FileInterceptor("file"))
	async uploadFile(
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addMaxSizeValidator({ maxSize: 500 * 1000 })
				.build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
		)
		file: Express.Multer.File,
		@Query("folder") folder?: string
	) {
		return this.fileService.uploadFile({ file, folder })
	}

	@Patch("copy")
	async copyFile(@Body() dto: CopyFileDto) {
		return this.fileService.copyFile(dto)
	}

	@Post("delete")
	@HttpCode(HttpStatus.OK)
	async deleteFile(@Body() dto: DeleteFileDto) {
		return this.fileService.deleteFile(dto)
	}
}

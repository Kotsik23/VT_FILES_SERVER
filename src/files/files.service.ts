import { BadRequestException, flatten, HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { path } from "app-root-path"
import { ensureDir, writeFile, existsSync, readdirSync, lstatSync, copySync, renameSync, rmSync } from "fs-extra"
import { PrismaService } from "src/prisma/prisma.service"
import { File, Prisma } from "@prisma/client"
import { UploadFileDto } from "./dto/upload-file.dto"
import { RenameDto } from "./dto/rename.dto"
import { CopyFileDto } from "./dto/copy-file.dto"
import { DeleteFileDto } from "./dto/delete-file.dto"

const uploadsPath = `${path}/uploads/`

@Injectable()
export class FilesService {
	constructor(private readonly configService: ConfigService, private readonly prisma: PrismaService) {}

	async getAllFiles(params: { where?: Prisma.FileWhereInput }): Promise<File[]> {
		const { where } = params
		return this.prisma.file.findMany({
			where,
		})
	}

	async readDirectory(): Promise<string[]> {
		return readdirSync(uploadsPath).map(file => file)
	}

	async createFolder(folder: string): Promise<string> {
		const newFolder = uploadsPath + folder

		if (existsSync(newFolder)) {
			throw new BadRequestException("Such folder is already exists")
		}
		await ensureDir(newFolder)
		return folder
	}

	async rename(dto: RenameDto): Promise<string> {
		const { name, newName, folder } = dto

		let newPath_ = uploadsPath
		let path_ = uploadsPath

		if (folder) {
			newPath_ += folder + "/" + newName
			path_ += folder + "/" + name
		} else {
			newPath_ += newName
			path_ += name
		}

		if (existsSync(newPath_)) {
			throw new BadRequestException("Such file or directory is already exists")
		}

		if (!existsSync(path_)) {
			throw new BadRequestException("There is no such file or directory")
		}

		if (lstatSync(path_).isDirectory()) {
			copySync(path_, newPath_, { recursive: true })
			rmSync(path_, { recursive: true })
			await this.prisma.file.updateMany({
				where: {
					folder: name,
				},
				data: {
					folder: newName,
				},
			})
		} else if (lstatSync(path_).isFile()) {
			await this.prisma.file.update({
				where: {
					name_folder: {
						name,
						folder,
					},
				},
				data: {
					url: this.configService.get("SERVER_URL") + "/uploads/" + folder + "/" + newName,
					name: newName,
				},
			})
			renameSync(path_, newPath_)
		}

		return newName
	}

	async deleteFolder(name: string): Promise<string> {
		if (!existsSync(uploadsPath + name)) {
			throw new BadRequestException("Such folder doesn't exists")
		}

		rmSync(uploadsPath + name, { recursive: true })
		await this.prisma.file.deleteMany({
			where: {
				folder: name,
			},
		})

		return name
	}

	async uploadFile(dto: UploadFileDto): Promise<File> {
		try {
			const { file, folder } = dto
			const uploadFolder = uploadsPath + folder

			if (!existsSync(uploadFolder)) {
				throw new BadRequestException("There is no such folder")
			}

			const serverUrl = this.configService.get("SERVER_URL")
			await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer)

			return this.prisma.file.create({
				data: {
					name: file.originalname,
					url: `${serverUrl}/uploads/${folder}/${file.originalname}`,
					size: file.size,
					mimetype: file.mimetype,
					folder,
				},
			})
		} catch (error) {
			throw new HttpException("Error while creating file", HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	async copyFile(dto: CopyFileDto): Promise<File> {
		const src = uploadsPath + dto.from
		const dest = uploadsPath + dto.to

		if (!existsSync(src)) {
			throw new BadRequestException("Such file doesn't exists")
		}
		const from_name_folder = dto.from.split("/")
		const to_name_folder = dto.to.split("/")

		const file = await this.prisma.file.findUnique({
			where: {
				name_folder: {
					folder: from_name_folder[0],
					name: from_name_folder[1],
				},
			},
		})
		copySync(src, dest)

		return this.prisma.file.create({
			data: {
				url: file.url,
				size: file.size,
				mimetype: file.mimetype,
				folder: to_name_folder[0],
				name: to_name_folder[1],
			},
		})
	}

	async deleteFile(dto: DeleteFileDto): Promise<File> {
		const deletePath = uploadsPath + dto.folder + "/" + dto.name

		if (!existsSync(deletePath)) {
			throw new BadRequestException("Such file doesn't exists")
		}

		rmSync(deletePath)

		return this.prisma.file.delete({
			where: {
				name_folder: {
					name: dto.name,
					folder: dto.folder,
				},
			},
		})
	}
}

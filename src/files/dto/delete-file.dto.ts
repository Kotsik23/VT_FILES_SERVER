import { IsString } from "class-validator"

export class DeleteFileDto {
	@IsString()
	folder: string

	@IsString()
	name: string
}

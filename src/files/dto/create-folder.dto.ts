import { IsString } from "class-validator"

export class CreateFolderDto {
	@IsString()
	folder: string
}

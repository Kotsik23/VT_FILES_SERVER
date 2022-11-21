import { IsOptional, IsString } from "class-validator"

export class RenameDto {
	@IsString()
	name: string

	@IsString()
	newName: string

	@IsOptional()
	@IsString()
	folder?: string
}

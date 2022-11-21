import { IsString } from "class-validator"

export class CopyFileDto {
	@IsString()
	from: string

	@IsString()
	to: string
}

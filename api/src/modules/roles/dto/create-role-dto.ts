import { IsNotEmpty, IsOptional, IsString, IsUUID, validate } from "class-validator";
import { UUID } from "../../../types/common.types";
import { BadRequestException } from "@nestjs/common";

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  createdById?: UUID;
}

export const validateCreateRoleDto = async (dto: CreateRoleDto) => {
  const errors = await validate(dto);
  if (errors.length > 0) {
    throw new BadRequestException(errors);
  }
  return dto;
};

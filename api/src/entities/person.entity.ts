import { Column } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { Gender } from "../constants/person.constants";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class Person extends AbstractEntity {
    // NAME
    @IsNotEmpty({ message: 'Name is required' })
    @Column({ name: 'name', type: 'varchar', length: 255, nullable: false })
    name!: string;

    // EMAIL
    @IsOptional()
    @IsEmail({}, { message: 'Invalid email address' })
    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email?: string;

    // PHONE NUMBER
    @IsOptional()
    @IsString({ message: 'Phone number must be a string' })
    @Column({ name: 'phone_number', type: 'varchar', length: 255, nullable: true })
    phoneNumber?: string;

    // COUNTRY
    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    @Column({ name: 'country', type: 'varchar', length: 255, nullable: true })
    country?: string;

    // GENDER
    @IsOptional()
    @IsEnum(Gender, { message: 'Invalid gender' })
    @Column({ name: 'gender', type: 'enum', enum: Gender, nullable: true })
    gender?: Gender;

    // DATE OF BIRTH
    @IsOptional()
    @IsDate({ message: 'Date of birth must be a date' })
    @Column({ name: 'date_of_birth', type: 'date', nullable: true })
    dateOfBirth?: Date;
}
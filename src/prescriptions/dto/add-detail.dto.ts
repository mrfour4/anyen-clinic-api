import { IsNotEmpty, IsString } from 'class-validator';

export class AddPrescriptionDetailDto {
    @IsNotEmpty()
    @IsString()
    nameAmount: string;

    @IsNotEmpty()
    @IsString()
    dosage: string;
}

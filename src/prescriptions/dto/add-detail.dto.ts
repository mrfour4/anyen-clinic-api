import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddPrescriptionDetailDto {
    @ApiProperty({
        example: 'Paracetamol 500mg x 10 tablets',
        description: 'Name and amount of medication',
    })
    @IsNotEmpty()
    @IsString()
    nameAmount: string;

    @ApiProperty({
        example: 'Take 2 times a day after meals',
        description: 'Dosage instructions',
    })
    @IsNotEmpty()
    @IsString()
    dosage: string;
}

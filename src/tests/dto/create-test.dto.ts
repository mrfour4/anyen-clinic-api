import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateTestDto {
    @ApiProperty({
        example: 'Trắc nghiệm lo âu Beck',
        description: 'Tên bài test',
    })
    @IsNotEmpty()
    name: string;
}

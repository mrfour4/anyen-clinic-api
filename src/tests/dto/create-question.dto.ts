import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
    @ApiProperty({ example: 'Bạn có thường cảm thấy lo lắng không?' })
    @IsNotEmpty()
    questionText: string;

    @ApiProperty({
        example: ['Không bao giờ', 'Đôi khi', 'Thường xuyên'],
        type: [String],
    })
    @IsArray()
    answers: string[];
}

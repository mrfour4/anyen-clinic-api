import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class BulkQuestion {
    @ApiProperty({ example: 'Bạn thường cảm thấy lo lắng vào lúc nào?' })
    @IsNotEmpty()
    @IsString()
    questionText: string;

    @ApiProperty({
        example: ['Buổi sáng', 'Buổi trưa', 'Buổi tối'],
        type: [String],
    })
    @IsArray()
    @IsString({ each: true })
    answers: string[];
}

export class CreateBulkQuestionDto {
    @ApiProperty({
        description: 'Danh sách câu hỏi và các đáp án',
        type: [BulkQuestion],
        example: [
            {
                questionText: 'Bạn có thường cảm thấy lo lắng không?',
                answers: ['Không bao giờ', 'Đôi khi', 'Thường xuyên'],
            },
            {
                questionText: 'Bạn có khó ngủ không?',
                answers: ['Không', 'Đôi khi', 'Thường xuyên'],
            },
        ],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BulkQuestion)
    questions: BulkQuestion[];
}

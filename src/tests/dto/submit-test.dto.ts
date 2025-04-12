import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';

class AnswerItem {
    @ApiProperty({ example: 'questionId-uuid' })
    @IsUUID()
    questionId: string;

    @ApiProperty({ example: 'answerId-uuid' })
    @IsUUID()
    answerId: string;
}

export class SubmitTestDto {
    @ApiProperty({ example: 'testSessionId-uuid' })
    @IsUUID()
    testSessionId: string;

    @ApiProperty({ type: [AnswerItem] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerItem)
    answers: AnswerItem[];
}

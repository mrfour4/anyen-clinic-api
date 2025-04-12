import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SubmitAnswerDto {
    @ApiProperty({ example: 'testSessionId-uuid' })
    @IsUUID()
    testSessionId: string;

    @ApiProperty({ example: 'questionId-uuid' })
    @IsUUID()
    questionId: string;

    @ApiProperty({ example: 'answerId-uuid' })
    @IsUUID()
    answerId: string;
}

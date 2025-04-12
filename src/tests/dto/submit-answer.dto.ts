import { IsUUID } from 'class-validator';

export class SubmitAnswerDto {
    @IsUUID()
    testSessionId: string;

    @IsUUID()
    questionId: string;

    @IsUUID()
    answerId: string;
}

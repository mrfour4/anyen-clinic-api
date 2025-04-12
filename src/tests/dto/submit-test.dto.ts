import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';

class AnswerItem {
    @IsUUID()
    questionId: string;

    @IsUUID()
    answerId: string;
}

export class SubmitTestDto {
    @IsUUID()
    testSessionId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AnswerItem)
    answers: AnswerItem[];
}

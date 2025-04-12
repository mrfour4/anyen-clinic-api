import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class BulkQuestion {
    @IsNotEmpty()
    @IsString()
    questionText: string;

    @IsArray()
    @IsString({ each: true })
    answers: string[];
}

export class CreateBulkQuestionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BulkQuestion)
    questions: BulkQuestion[];
}

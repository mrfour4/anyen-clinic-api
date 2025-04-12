import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
    @IsNotEmpty()
    questionText: string;

    @IsArray()
    answers: string[];
}

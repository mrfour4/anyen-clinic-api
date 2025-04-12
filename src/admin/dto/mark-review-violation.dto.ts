import { IsBoolean } from 'class-validator';

export class MarkReviewViolationDto {
    @IsBoolean()
    isViolated: boolean;
}

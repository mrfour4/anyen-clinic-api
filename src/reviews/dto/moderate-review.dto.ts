import { IsBoolean } from 'class-validator';

export class ModerateReviewDto {
    @IsBoolean()
    isViolated: boolean;
}

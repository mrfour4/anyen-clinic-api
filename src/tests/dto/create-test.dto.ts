import { IsNotEmpty } from 'class-validator';

export class CreateTestDto {
    @IsNotEmpty()
    name: string;
}

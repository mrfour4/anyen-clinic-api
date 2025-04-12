import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateBulkQuestionDto } from './dto/create-bulk-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitTestDto } from './dto/submit-test.dto';
import { TestsService } from './tests.service';

@ApiTags('Psychological Tests')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tests')
export class TestsController {
    constructor(private readonly service: TestsService) {}

    @Post()
    @Roles('admin')
    @ApiOperation({ summary: 'Create new psychological test (Admin only)' })
    @ApiBody({ type: CreateTestDto })
    create(@Body() dto: CreateTestDto) {
        return this.service.createTest(dto);
    }

    @Post(':id/questions')
    @Roles('admin')
    @ApiOperation({ summary: 'Add a single question to test (Admin only)' })
    @ApiBody({ type: CreateQuestionDto })
    createQuestion(
        @Param('id') testId: string,
        @Body() dto: CreateQuestionDto,
    ) {
        return this.service.createQuestion(testId, dto);
    }

    @Post(':id/questions/bulk')
    @Roles('admin')
    @ApiOperation({ summary: 'Add bulk questions to test (Admin only)' })
    @ApiBody({ type: CreateBulkQuestionDto })
    createQuestionsBulk(
        @Param('id') testId: string,
        @Body() dto: CreateBulkQuestionDto,
    ) {
        return this.service.createBulkQuestions(testId, dto);
    }

    @Post(':id/start')
    @Roles('patient')
    @ApiOperation({ summary: 'Start test session for a patient' })
    start(@Req() req, @Param('id') testId: string) {
        return this.service.startTestSession(req.user.userId, testId);
    }

    @Post(':id/answer')
    @Roles('patient')
    @ApiOperation({ summary: 'Submit single answer in test session' })
    @ApiBody({ type: SubmitAnswerDto })
    submitAnswer(@Req() req, @Body() dto: SubmitAnswerDto) {
        return this.service.submitAnswer(req.user.userId, dto);
    }

    @Post(':id/submit')
    @Roles('patient')
    @ApiOperation({ summary: 'Submit entire test session' })
    @ApiBody({ type: SubmitTestDto })
    submitFullTest(@Req() req, @Body() dto: SubmitTestDto) {
        return this.service.submitFullTest(req.user.userId, dto);
    }

    @Get()
    @Roles('admin', 'doctor', 'patient')
    @ApiOperation({ summary: 'Get all tests and question count' })
    getAllTests() {
        return this.service.getAllTestsWithQuestionCount();
    }

    @Get('results/my')
    @Roles('patient')
    @ApiOperation({ summary: 'Get test results for current patient' })
    getMyResults(@Req() req) {
        return this.service.getResultsForPatient(req.user.userId);
    }

    @Get('results/patient/:id')
    @Roles('doctor')
    @ApiOperation({ summary: 'Get test results for a patient (doctor)' })
    getResultsByPatient(@Param('id') patientId: string) {
        return this.service.getResultsForDoctor(patientId);
    }
}

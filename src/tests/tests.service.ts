import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { successResponse } from 'src/utils/response.utils';
import { CreateBulkQuestionDto } from './dto/create-bulk-question.dto';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SubmitTestDto } from './dto/submit-test.dto';

@Injectable()
export class TestsService {
    constructor(private prisma: PrismaService) {}

    async createTest(dto: CreateTestDto) {
        const test = await this.prisma.test.create({
            data: {
                testName: dto.name,
            },
        });

        return successResponse('Test created', test);
    }

    async createQuestion(testId: string, dto: CreateQuestionDto) {
        const question = await this.prisma.question.create({
            data: {
                testId,
                questionText: dto.questionText,
            },
        });

        await Promise.all(
            dto.answers.map((text) =>
                this.prisma.answer.create({
                    data: {
                        questionId: question.id,
                        answerText: text,
                    },
                }),
            ),
        );

        return successResponse('Question and answers created');
    }

    async createBulkQuestions(testId: string, dto: CreateBulkQuestionDto) {
        const createdQuestions: any[] = [];

        for (const q of dto.questions) {
            const question = await this.prisma.question.create({
                data: {
                    testId,
                    questionText: q.questionText,
                },
            });

            await Promise.all(
                q.answers.map((text) =>
                    this.prisma.answer.create({
                        data: {
                            questionId: question.id,
                            answerText: text,
                        },
                    }),
                ),
            );

            createdQuestions.push(question);
        }

        return successResponse('Bulk questions created', createdQuestions);
    }

    async startTestSession(patientId: string, testId: string) {
        const session = await this.prisma.testSession.create({
            data: {
                patientId,
                testId,
            },
        });
        return successResponse('Test session started', session);
    }

    async submitAnswer(patientId: string, dto: SubmitAnswerDto) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: dto.testSessionId },
        });

        if (!session || session.patientId !== patientId) {
            throw new ForbiddenException('Invalid session');
        }

        const result = await this.prisma.testResult.create({
            data: {
                testSessionId: dto.testSessionId,
                questionId: dto.questionId,
                answerId: dto.answerId,
            },
        });

        return successResponse('Answer submitted', result);
    }

    async submitFullTest(patientId: string, dto: SubmitTestDto) {
        const session = await this.prisma.testSession.findUnique({
            where: { id: dto.testSessionId },
        });

        if (!session || session.patientId !== patientId) {
            throw new ForbiddenException('Invalid test session');
        }

        const results = await this.prisma.$transaction(
            dto.answers.map((item) =>
                this.prisma.testResult.create({
                    data: {
                        testSessionId: dto.testSessionId,
                        questionId: item.questionId,
                        answerId: item.answerId,
                    },
                }),
            ),
        );

        return successResponse('Full test submitted', results);
    }

    async getResultsForPatient(patientId: string) {
        const results = await this.prisma.testSession.findMany({
            where: { patientId },
            include: {
                test: true,
                results: {
                    include: {
                        question: true,
                        answer: true,
                    },
                },
            },
        });

        return successResponse('Your test results', results);
    }

    async getResultsForDoctor(patientId: string) {
        const results = await this.prisma.testSession.findMany({
            where: { patientId },
            include: {
                test: true,
                results: {
                    include: {
                        question: true,
                        answer: true,
                    },
                },
            },
        });

        return successResponse('Patient test results', results);
    }

    async getAllTestsWithQuestionCount() {
        const tests = await this.prisma.test.findMany({
            orderBy: { createdAt: 'desc' },
        });

        const testsWithCounts = await Promise.all(
            tests.map(async (test) => {
                const count = await this.prisma.question.count({
                    where: { testId: test.id },
                });

                return {
                    ...test,
                    totalQuestions: count,
                };
            }),
        );

        return successResponse(
            'All tests with question counts',
            testsWithCounts,
        );
    }
}

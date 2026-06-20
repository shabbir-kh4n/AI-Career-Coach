/**
 * Zod validation schemas for all server actions
 */

import { z } from "zod";
import { CONFIG } from "./config";

/**
 * User Input Schemas
 */

export const UserSchema = z.object({
  id: z.string().optional(),
  clerkUserId: z.string(),
  name: z
    .string()
    .min(CONFIG.VALIDATION.MIN_NAME_LENGTH, "Name too short")
    .max(CONFIG.VALIDATION.MAX_NAME_LENGTH, "Name too long"),
  email: z.string().email("Invalid email"),
  bio: z
    .string()
    .min(CONFIG.VALIDATION.MIN_BIO_LENGTH, "Bio too short")
    .max(CONFIG.VALIDATION.MAX_BIO_LENGTH, "Bio too long")
    .optional(),
  industry: z.string().min(1, "Industry required"),
  experience: z.number().int().min(0, "Experience must be non-negative"),
  skills: z.array(z.string()).min(CONFIG.VALIDATION.MIN_SKILLS, "At least one skill required"),
  phone: z.string().optional(),
});

/**
 * Cover Letter Schemas
 */

export const CoverLetterInputSchema = z.object({
  jobTitle: z.string().min(2, "Job title required"),
  companyName: z.string().min(2, "Company name required"),
  jobDescription: z.string().min(10, "Job description too short"),
  industry: z.string().min(1, "Industry required"),
  experience: z.number().int().min(0),
  skills: z.array(z.string()),
  bio: z.string().min(10, "Bio required"),
});

export const CoverLetterSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  content: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
  jobDescription: z.string(),
  status: z.enum(["draft", "completed", "archived"]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Resume Schemas
 */

export const ResumeEntryInputSchema = z.object({
  role: z.string().min(2, "Role required"),
  company: z.string().min(2, "Company required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().default(false),
  description: z.string().min(10, "Description required"),
  skills: z.array(z.string()).optional(),
});

export const ResumeSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  title: z.string(),
  content: z.string(),
  status: z.enum(["draft", "completed"]),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

/**
 * Interview Schemas
 */

export const InterviewQuestionSchema = z.object({
  id: z.string().optional(),
  topic: z.string().min(2, "Topic required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  question: z.string(),
  options: z.array(z.string()).length(4, "Must have 4 options"),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  explanation: z.string().optional(),
  tip: z.string().optional(),
});

export const QuizAnswerInputSchema = z.object({
  questionId: z.string(),
  selectedAnswer: z.enum(["A", "B", "C", "D"]),
  timeTaken: z.number().positive().optional(),
});

export const QuizResultSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  topic: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  score: z.number().int().min(0).max(100),
  totalQuestions: z.number().int().positive(),
  correctAnswers: z.number().int().min(0),
  duration: z.number().int().positive(),
  answers: z.array(QuizAnswerInputSchema),
  feedback: z.string().optional(),
  createdAt: z.date().optional(),
});

/**
 * Dashboard Schemas
 */

export const DashboardStatsSchema = z.object({
  totalResumesSaved: z.number().int().min(0),
  totalCoverLettersGenerated: z.number().int().min(0),
  totalAssessmentsTaken: z.number().int().min(0),
  averageInterviewScore: z.number().min(0).max(100),
  lastActivityDate: z.string().optional(),
});

export const OnboardingInputSchema = z.object({
  name: z.string().min(2, "Name required"),
  email: z.string().email("Invalid email"),
  industry: z.string().min(1, "Industry required"),
  experience: z.number().int().min(0, "Years of experience required"),
  skills: z.array(z.string()).min(1, "At least one skill required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  phone: z.string().optional(),
});

/**
 * Validation helper functions
 */

export function validateInput(schema, data) {
  try {
    return {
      valid: true,
      data: schema.parse(data),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors,
        message: error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; "),
      };
    }
    return {
      valid: false,
      message: "Validation error",
    };
  }
}

export function validateCoverLetterInput(data) {
  return validateInput(CoverLetterInputSchema, data);
}

export function validateResumeEntry(data) {
  return validateInput(ResumeEntryInputSchema, data);
}

export function validateInterviewAnswer(data) {
  return validateInput(QuizAnswerInputSchema, data);
}

export function validateOnboarding(data) {
  return validateInput(OnboardingInputSchema, data);
}

export function validateUser(data) {
  return validateInput(UserSchema, data);
}

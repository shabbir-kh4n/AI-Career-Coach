"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateAIJSON, generateAIContent } from "@/lib/ai-service";
import { getLogger } from "@/lib/logger";
import { AuthError, NotFoundError, handleError } from "@/lib/errors";

const logger = getLogger("interview-actions");

export async function generateQuiz() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError("User must be authenticated to generate quiz");
    }

    logger.logServerAction("generateQuiz", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        industry: true,
        skills: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const prompt = `
Generate 10 technical interview questions for a ${user.industry} professional${
      user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
    }.

Each question should be multiple choice with 4 options.

Return the response in this JSON format only, no additional text:
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}
    `;

    const result = await generateAIJSON(prompt, { userId });

    logger.logUserAction(userId, "quiz_generated", {
      count: result.data.questions.length,
    });

    return {
      success: true,
      data: result.data.questions,
      message: "Quiz generated successfully",
    };
  } catch (error) {
    logger.error("Failed to generate quiz", error);
    return handleError(error, { action: "generateQuiz" });
  }
}

export async function saveQuizResult(questions, answers, score) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError();
    }

    logger.logServerAction("saveQuizResult", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const questionResults = questions.map((q, index) => ({
      question: q.question,
      answer: q.correctAnswer,
      userAnswer: answers[index],
      isCorrect: q.correctAnswer === answers[index],
      explanation: q.explanation,
    }));

    // Get wrong answers
    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);

    // Generate improvement tips if there are wrong answers
    let improvementTip = null;
    if (wrongAnswers.length > 0) {
      const wrongQuestionsText = wrongAnswers
        .map(
          (q) =>
            `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
        )
        .join("\n\n");

      const improvementPrompt = `
The user got the following ${user.industry} technical interview questions wrong:

${wrongQuestionsText}

Based on these mistakes, provide a concise, specific improvement tip.
Focus on the knowledge gaps revealed by these wrong answers.
Keep the response under 2 sentences and make it encouraging.
Don't explicitly mention the mistakes, instead focus on what to learn/practice.
      `;

      try {
        const tipResult = await generateAIContent(improvementPrompt, { userId });
        improvementTip = tipResult.content;
      } catch (error) {
        logger.warn("Could not generate improvement tip", error);
        // Continue without improvement tip if generation fails
      }
    }

    const assessment = await db.assessment.create({
      data: {
        userId: user.id,
        quizScore: score,
        questions: questionResults,
        category: "Technical",
        improvementTip,
      },
    });

    logger.logUserAction(userId, "quiz_result_saved", {
      score,
      totalQuestions: questions.length,
      correctAnswers: questionResults.filter((q) => q.isCorrect).length,
    });

    return {
      success: true,
      data: assessment,
      message: "Quiz result saved successfully",
    };
  } catch (error) {
    logger.error("Failed to save quiz result", error);
    return handleError(error, { action: "saveQuizResult" });
  }
}

export async function getAssessments() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError();
    }

    logger.logServerAction("getAssessments", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const assessments = await db.assessment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    logger.info("Assessments retrieved", { userId, count: assessments.length });

    return {
      success: true,
      data: assessments,
      message: "Assessments retrieved successfully",
    };
  } catch (error) {
    logger.error("Failed to get assessments", error);
    return handleError(error, { action: "getAssessments" });
  }
}

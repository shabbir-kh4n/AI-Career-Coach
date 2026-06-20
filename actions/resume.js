"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIContent } from "@/lib/ai-service";
import { getLogger } from "@/lib/logger";
import { AuthError, NotFoundError, handleError } from "@/lib/errors";
import { validateResumeEntry } from "@/lib/validation";

const logger = getLogger("resume-actions");

export async function saveResume(content) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError("User must be authenticated to save resume");
    }

    logger.logServerAction("saveResume", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const resume = await db.resume.upsert({
      where: {
        userId: user.id,
      },
      update: {
        content,
      },
      create: {
        userId: user.id,
        content,
      },
    });

    logger.logUserAction(userId, "resume_saved", { resumeId: resume.id });
    revalidatePath("/resume");

    return {
      success: true,
      data: resume,
      message: "Resume saved successfully",
    };
  } catch (error) {
    logger.error("Failed to save resume", error);
    return handleError(error, { action: "saveResume" });
  }
}

export async function getResume() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError();
    }

    logger.logServerAction("getResume", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const resume = await db.resume.findUnique({
      where: {
        userId: user.id,
      },
    });

    logger.info("Resume retrieved", { userId });

    return {
      success: true,
      data: resume,
    };
  } catch (error) {
    logger.error("Failed to get resume", error);
    return handleError(error, { action: "getResume" });
  }
}

export async function improveWithAI({ current, type }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError();
    }

    logger.logServerAction("improveWithAI", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        industryInsight: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const prompt = `
As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
Make it more impactful, quantifiable, and aligned with industry standards.
Current content: "${current}"

Requirements:
1. Use action verbs
2. Include metrics and results where possible
3. Highlight relevant technical skills
4. Keep it concise but detailed
5. Focus on achievements over responsibilities
6. Use industry-specific keywords

Format the response as a single paragraph without any additional text or explanations.
    `;

    const result = await generateAIContent(prompt, { userId });

    logger.logUserAction(userId, "resume_improved", { type });

    return {
      success: true,
      data: {
        improvedContent: result.content,
        duration: result.duration,
      },
      message: "Content improved successfully",
    };
  } catch (error) {
    logger.error("Failed to improve resume content", error);
    return handleError(error, { action: "improveWithAI" });
  }
}

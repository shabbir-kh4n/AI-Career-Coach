"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { generateCoverLetter as generateCoverLetterAI } from "@/lib/ai-service";
import { getLogger } from "@/lib/logger";
import {
  AuthError,
  NotFoundError,
  DatabaseError,
  handleError,
} from "@/lib/errors";
import { validateCoverLetterInput } from "@/lib/validation";

const logger = getLogger("cover-letter-actions");

export async function generateCoverLetter(data) {
  try {
    // Authenticate
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError("User must be authenticated to generate cover letter");
    }

    logger.logServerAction("generateCoverLetter", userId, "start");

    // Validate input
    const validation = validateCoverLetterInput(data);
    if (!validation.valid) {
      logger.warn("Cover letter validation failed", { errors: validation.message });
      throw new Error(`Invalid input: ${validation.message}`);
    }

    // Get user
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    // Generate cover letter using AI service
    const aiResult = await generateCoverLetterAI(
      {
        jobTitle: data.jobTitle,
        companyName: data.companyName,
        jobDescription: data.jobDescription,
        industry: user.industry,
        experience: user.experience,
        skills: user.skills || [],
        bio: user.bio || "",
      },
      userId
    );

    // Save to database
    const coverLetter = await db.coverLetter.create({
      data: {
        content: aiResult.content,
        jobDescription: data.jobDescription,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        status: "completed",
        userId: user.id,
      },
    });

    logger.logUserAction(userId, "cover_letter_generated", {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      duration: aiResult.duration,
    });

    return {
      success: true,
      data: coverLetter,
    };
  } catch (error) {
    logger.error("Cover letter generation failed", error);
    return handleError(error, { action: "generateCoverLetter" });
  }
}

export async function getCoverLetters() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError();
    }

    logger.logServerAction("getCoverLetters", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const letters = await db.coverLetter.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info("Cover letters retrieved", { userId, count: letters.length });

    return {
      success: true,
      data: letters,
    };
  } catch (error) {
    logger.error("Failed to get cover letters", error);
    return handleError(error, { action: "getCoverLetters" });
  }
}

export async function getCoverLetter(id) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError();
    }

    logger.logServerAction("getCoverLetter", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const letter = await db.coverLetter.findUnique({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!letter) {
      throw new NotFoundError("Cover Letter");
    }

    logger.info("Cover letter retrieved", { userId, letterId: id });

    return {
      success: true,
      data: letter,
    };
  } catch (error) {
    logger.error("Failed to get cover letter", error);
    return handleError(error, { action: "getCoverLetter", letterId: id });
  }
}

export async function deleteCoverLetter(id) {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new AuthError();
    }

    logger.logServerAction("deleteCoverLetter", userId, "start");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new NotFoundError("User");
    }

    const letter = await db.coverLetter.delete({
      where: {
        id,
        userId: user.id,
      },
    });

    logger.logUserAction(userId, "cover_letter_deleted", { letterId: id });

    return {
      success: true,
      data: letter,
      message: "Cover letter deleted successfully",
    };
  } catch (error) {
    logger.error("Failed to delete cover letter", error);
    return handleError(error, { action: "deleteCoverLetter", letterId: id });
  }
}

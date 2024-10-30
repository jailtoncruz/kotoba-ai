import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infraestructure/database/prisma/prisma.service';
import { TextToSpeechService } from '../../../core/abstract/cloud/text-to-speech.service';

@Injectable()
export class PracticeSessionService {
  constructor(
    private readonly prisma: PrismaService,
    private tts: TextToSpeechService,
  ) {}

  // Function to get the next card based on SRS principles
  async getNextCard(userId: string) {
    // Fetch up to 10 cards due for review
    const reviewCards = await this.prisma.userProgress.findMany({
      where: {
        userId,
        nextReviewDate: {
          lte: new Date(),
        },
      },
      include: { flashcard: true },
      orderBy: [{ nextReviewDate: 'asc' }, { proficiency: 'asc' }],
      take: 10,
    });

    // Fetch up to 10 unseen cards ordered by complexity
    const unseenCards = await this.prisma.flashcard.findMany({
      where: { progress: { none: { userId } } },
      orderBy: { complexity: 'asc' },
      take: 10,
    });

    // Decide based on probability (30% for review card, 70% for unseen card)
    const selectForReview = Math.random() < 0.3;

    if (selectForReview && reviewCards.length > 0) {
      // Randomly select one of the due-for-review cards
      return reviewCards[Math.floor(Math.random() * reviewCards.length)]
        .flashcard;
    } else if (unseenCards.length > 0) {
      // Randomly select one of the unseen cards
      const card = unseenCards[Math.floor(Math.random() * unseenCards.length)];
      return card;
    }

    // If no cards available in either list, throw an exception
    throw new NotFoundException('No more cards available for review');
  }

  // Function to handle review and update proficiency based on rating
  async reviewCard(userId: string, cardId: string, rating: number) {
    let userProgress = await this.prisma.userProgress.findUnique({
      where: {
        userId_flashcardId: { userId, flashcardId: cardId },
      },
    });

    // If no progress exists, create a new UserProgress entry
    if (!userProgress) {
      userProgress = await this.prisma.userProgress.create({
        data: {
          userId,
          flashcardId: cardId,
          proficiency: 0,
          lastReviewed: new Date(),
          nextReviewDate: new Date(),
        },
      });
    }

    // Update proficiency based on rating
    const newProficiency = Math.min(
      100,
      Math.max(0, userProgress.proficiency + (rating - 1) * 20),
    );

    // Calculate the next review date based on rating
    const reviewIntervals = [1, 3, 7, 14];
    const nextReviewDays = reviewIntervals[rating] || 1;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + nextReviewDays);

    await this.prisma.userProgress.update({
      where: {
        userId_flashcardId: { userId, flashcardId: cardId },
      },
      data: {
        proficiency: newProficiency,
        lastReviewed: new Date(),
        nextReviewDate,
      },
    });

    return { message: 'Review submitted successfully' };
  }
}

import { Controller, Get, Post, Param, Body, Request } from '@nestjs/common';
import { PracticeSessionService } from './practice-session.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReviewCardDto } from './dto/review.dto';
import { AuthRequest } from '../../../core/domain/auth-request';

@ApiTags('Practice Session')
@ApiBearerAuth()
@Controller('practice')
export class PracticeSessionController {
  constructor(
    private readonly practiceSessionService: PracticeSessionService,
  ) {}

  // Endpoint to get a card for the user to practice
  @Get()
  async getNextCard(@Request() req) {
    const userId = req.userId;
    return this.practiceSessionService.getNextCard(userId);
  }

  // Endpoint to submit a review of a card
  @Post('review/:card_id')
  async reviewCard(
    @Request() req: AuthRequest,
    @Param('card_id') cardId: string,
    @Body() { rating }: ReviewCardDto, // rating from 0 to 3
  ) {
    const userId = req.user.userId;
    return this.practiceSessionService.reviewCard(userId, cardId, rating);
  }
}

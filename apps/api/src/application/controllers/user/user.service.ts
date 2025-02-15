import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../infraestructure/database/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(email: string, password: string) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = this.generateJwt(user.id);

    return { user, token };
  }

  async validateUser(email: string, password: string) {
    // Find the user by email
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      // If passwords match, generate and return a token
      return this.generateJwt(user.id);
    }

    return null; // Return null if user validation fails
  }

  private generateJwt(userId: string) {
    return this.jwtService.sign({ userId });
  }
}

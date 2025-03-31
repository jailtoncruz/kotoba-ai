import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignInDto } from './dto/sign-in.dto';
import { Public } from '../../../infraestructure/config/decorators/public';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @Public()
  async register(@Body() data: SignInDto) {
    return this.userService.createUser(data);
  }

  @Post('login')
  @Public()
  async login(@Body() { email, password }: SignInDto) {
    const token = await this.userService.validateUser(email, password);
    if (!token) {
      throw new Error('Invalid username or password');
    }
    return { token };
  }
}

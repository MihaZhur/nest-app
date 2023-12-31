import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UseGuards,
  Get,
  Param,
} from '@nestjs/common';
import { AuthService } from '@entities/auth/auth.service';
import { AuthUserGuard } from './auth.guard';
import { UserService } from '@entities/user/user.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() userData: Record<string, any>) {
    return this.authService.signIn(userData.email, userData.password);
  }
  @UseGuards(AuthUserGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return this.userService.getUserDataById(req.user.sub);
  }
  @Post('signup')
  signUp(@Body() userData: Record<string, any>) {
    return this.authService.signUp(userData);
  }
  @Get('activate/:code')
  activateUser(@Param() params: any) {
    return this.authService.activate(params.code);
  }
  @Post('reset-password')
  resetPassword(@Body() body: Record<string, any>) {
    return this.authService.resetPassword(body);
  }
  @Post('change-password')
  changePassword(@Body() body: any) {
    return this.authService.changePassword(body);
  }
}

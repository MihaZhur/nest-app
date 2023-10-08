import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  Body,
} from '@nestjs/common';
import { Response, Request } from 'express';

import { UserService } from './user.service';
import { ValidateUserDto } from './dto/validateUserDto';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.getAllUsers();

    return res.send({
      status: 'ok',
      data: users,
    });
  }
  @Post('/')
  async createUser(
    @Req() req: Request,
    @Body() body: ValidateUserDto,
    @Res() res: Response,
  ) {
    try {
      const userData = await this.userService.createUser(body);
      return res.send({ userData });
    } catch (error) {
      return res.send(error);
    }
  }

  @Put('/:id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ValidateUserDto,
    @Res() res: Response,
  ) {
    this.userService.updateUserData(id, body);
    return res.send({ status: 'ok' });
  }

  @Delete('/:id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    this.userService.deleteUser(id);
    return res.send({ status: 'ok' });
  }
}

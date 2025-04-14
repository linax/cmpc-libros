import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { UserRole } from './models/user.model';

import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { LogOperation } from 'src/common/decorators/log-operation.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @LogOperation('get-all-users')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @LogOperation('get-user')
  async findOne(@Request() req, @Param('id') id: string) {
    if (req.user.id !== id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only access your own profile');
    }

    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @LogOperation('update-user')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (req.user.id !== id && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You can only update your own profile');
    }
    if (updateUserDto.role && req.user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can change roles');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @LogOperation('delete-user')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

import { Controller, Get, Param, Body, Delete, UseGuards, Request, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { UsersService } from './user.service';
import { Roles } from '../roles/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { UpdateUserActionDTO } from './user.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('v1/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Get your own user details' })
  @Get('me')
  @ApiBearerAuth('access-token')
  async getOwnDetais(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    return {
      data: {
        type: 'users',
        id: user.id,
        attributes: {
          ...user,
        },
        links: {
          self: `/v1/users/${user.id}`,
        },
      },
    };
  }

  @ApiOperation({ summary: 'Update your own user details' })
  @Patch('me')
  @ApiBearerAuth('access-token')
  async updateMyDetails(@Request() req, @Body() updateUserDto: UpdateUserActionDTO) {
    const updatedUser = await this.usersService.update(req.user.id, updateUserDto);
    return {
      data: {
        type: 'users',
        id: updatedUser.id,
        attributes: {
          ...updatedUser,
        },
        links: {
          self: `/v1/users/${updatedUser.id}`,
        },
      },
    };
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  async getUsers() {
    const users = await this.usersService.findAll();
    return {
      data: users.map(user => ({
        type: 'users',
        id: user.id,
        attributes: {
          ...user,
        },
        links: {
          self: `/users/${user.id}`,
        },
      })),
    };
  }

  @ApiOperation({ summary: 'Update a user details' })
  @ApiParam({ type: 'string', name: 'id' })
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserActionDTO) {
    const updatedUser = await this.usersService.update(id, updateUserDto);
    return {
      data: {
        type: 'users',
        id: updatedUser.id,
        attributes: {
          ...updatedUser,
        },
        links: {
          self: `/v1/users/${updatedUser.id}`,
        },
      },
    };
  }

  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ type: 'string', name: 'id' })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string, @Request() req) {
    if (id === req.user.id) throw new HttpException('Deleting your own account is not permited.', HttpStatus.CONFLICT);
    const removedUser = await this.usersService.remove(id);
    return {
      data: {
        type: 'users',
        id: removedUser.id,
        attributes: {
          ...removedUser,
        },
        links: {
          self: `/v1/users/${removedUser.id}`,
        },
      },
    };
  }

  @ApiOperation({ summary: 'Change a user Role' })
  @ApiParam({ type: 'string', name: 'id' })
  @Patch(':id/role')
  @ApiBearerAuth('access-token')
  @Roles(UserRole.ADMIN)
  async assignRole(@Param('id') id: string, @Body() body: {role: UserRole}) {
    const updatedUser = await this.usersService.assingnRole(id, body.role);
    return {
      data: {
        type: 'users',
        id: updatedUser.id,
        attributes: {
          ...updatedUser,
        },
        links: {
          self: `/v1/users/${updatedUser.id}`,
        },
      },
    };
  }  
}

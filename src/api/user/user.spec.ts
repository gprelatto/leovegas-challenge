import { Test, TestingModule } from '@nestjs/testing';
import * as typeorm from 'typeorm';
import { UsersService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { UpdateUserActionDTO } from './user.dto';
import { DataSourceMock, UPDATED_USER, USER_USER, USER_USER_DELETED } from '../mocks/user.mock';
import { USER_LIST } from '../mocks/auth.mock';

describe('User Tests', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        AuthService,
        {
          provide: typeorm.DataSource,
          useClass: DataSourceMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
    userController = module.get<UsersController>(UsersController);
  });

  describe('Service Startups:', () => {
    it('Services should be defined', () => {
      expect(usersService).toBeDefined();
      expect(jwtService).toBeDefined();
      expect(authService).toBeDefined();
    });
  });

  describe('User - Admin Tests:', () => {
    it('should return all user data correctly', async () => {
      const result = await userController.getUsers();

      expect(result).toEqual({
        data: USER_LIST.map(user => ({
          type: 'users',
          id: user.id,
          attributes: {
            ...user,
          },
          links: {
            self: `/users/${user.id}`,
          },
        })),
      });
    });

    it('should update a user data correctly', async () => {
      const userData: UpdateUserActionDTO = {
        name: 'UPDATED USER USER',
      };
      const result = await userController.updateUser('d153d367-1976-43f7-9add-40800c0d2871', userData);

      expect(result).toEqual({
        data: {
          type: 'users',
          id: 'd153d367-1976-43f7-9add-40800c0d2871',
          attributes: { ...UPDATED_USER },
          links: { self: '/v1/users/d153d367-1976-43f7-9add-40800c0d2871' },
        },
      });
    });

    it('should delete a user', async () => {
      const req = { user: { id: '39a24ad7-d822-40fd-a151-a70b360a2f09' } };
      const result = await userController.deleteUser('d153d367-1976-43f7-9add-40800c0d2871', req);

      expect(result).toEqual({
        data: {
          type: 'users',
          id: 'd153d367-1976-43f7-9add-40800c0d2871',
          attributes: { ...USER_USER_DELETED },
          links: { self: '/v1/users/d153d367-1976-43f7-9add-40800c0d2871' },
        },
      });
    });

    it('should not be able to operate on non existent users', async () => {
      const req = { user: { id: 'd153d367-1976-43f7-9add-40800c0d2871' } };
      await expect(userController.deleteUser('d153d367-1976-43f7-9add-40800c0d9999', req)).rejects.toThrowError(new HttpException('User not found.', HttpStatus.NOT_FOUND));
    });

    it('should not be able to delete your user', async () => {
      const req = { user: { id: 'd153d367-1976-43f7-9add-40800c0d2871' } };
      await expect(userController.deleteUser('d153d367-1976-43f7-9add-40800c0d2871', req)).rejects.toThrowError(new HttpException('Deleting your own account is not permited.', HttpStatus.CONFLICT));
    });
  });

  describe('User - Own Tests:', () => {
    it('should return your user data correctly', async () => {
      const req = { user: { id: 'd153d367-1976-43f7-9add-40800c0d2871' } };
      const result = await userController.getOwnDetais(req);

      expect(result).toEqual({
        data: {
          type: 'users',
          id: 'd153d367-1976-43f7-9add-40800c0d2871',
          attributes: { ...USER_USER },
          links: { self: '/v1/users/d153d367-1976-43f7-9add-40800c0d2871' },
        },
      });
    });

    it('should update your user data correctly', async () => {
      const req = { user: { id: 'd153d367-1976-43f7-9add-40800c0d2871' } };
      const userData: UpdateUserActionDTO = {
        name: 'UPDATED USER USER',
      };
      const result = await userController.updateMyDetails(req, userData);

      expect(result).toEqual({
        data: {
          type: 'users',
          id: 'd153d367-1976-43f7-9add-40800c0d2871',
          attributes: { ...UPDATED_USER },
          links: { self: '/v1/users/d153d367-1976-43f7-9add-40800c0d2871' },
        },
      });
    });
  });
});

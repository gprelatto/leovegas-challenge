import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as typeorm from 'typeorm';
import { UsersService } from '../user/user.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserRole } from '../../entities/user.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DataSourceMock, NEW_SAVED_USER } from '../mocks/auth.mock';

describe('Auth Tests', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'test',
          signOptions: { expiresIn: '1h' },
        }),
      ],
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
  });

  describe('Service Startups:', () => {
    it('Services should be defined', () => {
      expect(usersService).toBeDefined();
      expect(jwtService).toBeDefined();
      expect(authService).toBeDefined();
    });
  });

  describe('Login Tests:', () => {
    it('should fail if email or password are wrong', async () => {
      const wrongEmail = { email: 'test@leo.com', password: 'password' };
      const foundUser1 = await authService.validateUser(wrongEmail.email, wrongEmail.password);
      expect(foundUser1).toBeNull();

      const wrongPassword = { email: 'user@leo.com', password: 'password' };
      const foundUser2 = await authService.validateUser(wrongPassword.email, wrongPassword.password);
      expect(foundUser2).toBeNull();
    });
    it('should be able to login', async () => {
      const user = { email: 'user@leo.com', password: '123asd123' };
      const foundUser = await authService.validateUser(user.email, user.password);
      expect(foundUser).toBeDefined();

      const loginResponse = await authService.login(foundUser);
      expect(loginResponse).toHaveProperty('access_token');

      const decoded = jwtService.verify(loginResponse.access_token, { secret: 'test' });
      expect(decoded).toHaveProperty('sub', foundUser.id);
      expect(decoded).toHaveProperty('role', foundUser.role);
      expect(decoded).toHaveProperty('email', foundUser.email);
    });
  });

  describe('Register tests:', () => {
    it('should throw an error if the email already exists', async () => {
      const newUser = {
        name: 'A user name',
        email: 'user@leo.com',
        password: 'somepassword',
        role: UserRole.USER,
      };
      await expect(authService.register(newUser)).rejects.toThrowError(new HttpException('User with this email already exists.', HttpStatus.CONFLICT));
    });
    it('should create a new user', async () => {
      const newUser = {
        name: 'NEW USER',
        email: 'newuser@leo.com',
        password: '123asd123',
      };
      const registerResponse = await authService.register(newUser);
      expect(registerResponse).toEqual(NEW_SAVED_USER);
    });
  });
});

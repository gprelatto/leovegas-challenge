import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import * as typeorm from 'typeorm';
import { DataSourceMock } from '../mocks/user.mock';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JWT_SECRET } from 'config';
import { UserRole } from '../../entities/user.entity';

describe('UsersController - Role Access', () => {
  let app: INestApplication;
  let authService: AuthService;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        PassportModule,
        JwtModule.register({
          secret: JWT_SECRET,
          signOptions: { expiresIn: '1h' },
        }),
      ],
      controllers: [UsersController],
      providers: [
        {
          provide: typeorm.DataSource,
          useClass: DataSourceMock,
        },
        AuthService,
        UsersService,
        JwtStrategy,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    authService = module.get<AuthService>(AuthService);

    const admin = await authService.validateUser('admin@leo.com', '123asd123');
    const adminResponse = await authService.login(admin);
    adminToken = adminResponse.access_token;

    const user = await authService.validateUser('user@leo.com', '123asd123');
    const userResponse = await authService.login(user);
    userToken = userResponse.access_token;
  });

  it('should allow USER to access GET /v1/users/me', async () => {
    const response = await request(app.getHttpServer()).get('/v1/users/me').set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(200);
  });

  it('should allow ADMIN to access GET /v1/users/me', async () => {
    const response = await request(app.getHttpServer()).get('/v1/users/me').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  it('should allow USER to access PATCH /v1/users/me', async () => {
    const response = await request(app.getHttpServer()).patch('/v1/users/me').set('Authorization', `Bearer ${userToken}`).send({ name: 'Updated User' });
    expect(response.status).toBe(200);
  });

  it('should allow ADMIN to access PATCH /v1/users/me', async () => {
    const response = await request(app.getHttpServer()).patch('/v1/users/me').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated User' });
    expect(response.status).toBe(200);
  });

  it('should allow ADMIN to access GET /v1/users', async () => {
    const response = await request(app.getHttpServer()).get('/v1/users').set('Authorization', `Bearer ${adminToken}`);
    expect(response.status).toBe(200);
  });

  it('should deny non-ADMIN to access GET /v1/users', async () => {
    const response = await request(app.getHttpServer()).get('/v1/users').set('Authorization', `Bearer ${userToken}`);
    expect(response.status).toBe(403);
  });

  it('should allow ADMIN to PATCH /v1/users/:id', async () => {
    const response = await request(app.getHttpServer()).patch('/v1/users/39a24ad7-d822-40fd-a151-a70b360a2f09').set('Authorization', `Bearer ${adminToken}`).send({ name: 'Updated User' });
    expect(response.status).toBe(200);
  });

  it('should deny non-ADMIN users access to PATCH /v1/users/:id', async () => {
    const response = await request(app.getHttpServer()).patch('/v1/users/39a24ad7-d822-40fd-a151-a70b360a2f09').set('Authorization', `Bearer ${userToken}`).send({ name: 'Updated User' });
    expect(response.status).toBe(403);
  });

  it('should allow ADMIN to DELETE /v1/users/:id', async () => {
    const response = await request(app.getHttpServer()).delete('/v1/users/d153d367-1976-43f7-9add-40800c0d2871').set('Authorization', `Bearer ${adminToken}`).send();
    expect(response.status).toBe(200);
  });

  it('should deny non-ADMIN to DELETE /v1/users/:id', async () => {
    const response = await request(app.getHttpServer()).delete('/v1/users/d153d367-1976-43f7-9add-40800c0d2871').set('Authorization', `Bearer ${userToken}`).send();
    expect(response.status).toBe(403);
  });

  it('should allow ADMIN to RUN /v1/users/:id/role', async () => {
    const response = await request(app.getHttpServer()).patch('/v1/users/d153d367-1976-43f7-9add-40800c0d2871/role').set('Authorization', `Bearer ${adminToken}`).send({ role: UserRole.ADMIN });
    expect(response.status).toBe(200);
  });

  it('should deny non-ADMIN to RUN /v1/users/:id/role', async () => {
    const response = await request(app.getHttpServer())
      .patch('/v1/users/d153d367-1976-43f7-9add-40800c0d2871/role')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ body: { role: UserRole.ADMIN } });
    expect(response.status).toBe(403);
  });
});

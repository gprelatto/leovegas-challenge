import { User, UserRole } from '../../entities/user.entity';

export const USER_USER: User = new User();
USER_USER.id = 'd153d367-1976-43f7-9add-40800c0d2871';
USER_USER.name = 'USER USER';
USER_USER.email = 'user@leo.com';
USER_USER.password = '$2b$10$Rl1cChlMDtiGG0hBrVqBIO3MKALOKNxp1uYscVW0VWk4UqEfXdYma';
USER_USER.role = UserRole.USER;

export const USER_ADMIN: User = new User();
USER_ADMIN.id = '39a24ad7-d822-40fd-a151-a70b360a2f09';
USER_ADMIN.name = 'ADMIN USER';
USER_ADMIN.email = 'admin@leo.com';
USER_ADMIN.password = '$2b$10$Rl1cChlMDtiGG0hBrVqBIO3MKALOKNxp1uYscVW0VWk4UqEfXdYma';
USER_ADMIN.role = UserRole.ADMIN;

export const USER_USER_DELETED: User = new User();
USER_USER_DELETED.id = 'd153d367-1976-43f7-9add-40800c0d2871';
USER_USER_DELETED.name = 'USER USER';
USER_USER_DELETED.email = 'user@leo.com';
USER_USER_DELETED.password = '$2b$10$Rl1cChlMDtiGG0hBrVqBIO3MKALOKNxp1uYscVW0VWk4UqEfXdYma';
USER_USER_DELETED.role = UserRole.USER;
USER_USER_DELETED.isActive = false;

export const USER_LIST: User[] = [USER_USER, USER_ADMIN];

export const UPDATED_USER: User = new User();
UPDATED_USER.id = 'd153d367-1976-43f7-9add-40800c0d2871';
UPDATED_USER.name = 'UPDATED USER USER';
UPDATED_USER.email = 'user@leo.com';
UPDATED_USER.role = UserRole.USER;

class DataSourceManagerMock {
  save = jest.fn().mockReturnValue(Promise.resolve(USER_USER));
}

class UserRepoMock {
  find = jest.fn().mockImplementation(options => {
    if (options && options.where && options.where.role) {
      return USER_LIST.filter(user => user.role === options.where.role);
    }
    return USER_LIST;
  });

  findOne = jest.fn().mockImplementation(options => {
    if (options && options.where) {
      const { id, email } = options.where;
      return USER_LIST.find(user => user.id === id || user.email === email);
    }
    return null;
  });

  save = jest.fn().mockReturnValue(Promise.resolve(UPDATED_USER));
  create = jest.fn().mockReturnValue(USER_ADMIN);
  softRemove = jest.fn().mockReturnValue(USER_USER_DELETED);
}

export class DataSourceMock {
  manager = new DataSourceManagerMock();

  getRepository(type: any) {
    return new UserRepoMock();
  }
}

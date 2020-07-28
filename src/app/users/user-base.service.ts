import {User} from './user.model';

export abstract class UserBaseService {

  abstract getUser(id: string);

  abstract getUsers();

  abstract updateUser(user: User);

  abstract saveUser(user: User);

}

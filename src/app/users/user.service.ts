import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {User} from "./user.model";
import {UserBaseService} from './user-base.service';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({providedIn: 'root'})
export class UserService implements UserBaseService {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  /*
    ********************** Get request service by ID **********************
   */
  getUser(id: string) {
    return this.http.get<{
      _id: string,
      email: string,
      phone: string,
      name: string,
      lastName: string,
      postNumber: string,
      imagePath: string
    }>(
      BACKEND_URL  + "user/" + id
    );
  }

  /*
 ********************** Put request service **********************
*/
  updateUser(user: User) {
    // save in formData because of the image format
    const userData = new FormData();
    userData.append('email', user.email);
    userData.append('phone', user.phone);
    userData.append('name', user.name);
    userData.append('lastName', user.lastName);
    userData.append('postNumber', user.postNumber);
    userData.append('image', user.imagePath);
    return this.http
      .put<{ message: string, user: User }>(BACKEND_URL + "user/" + user.id, userData);
  }

  getUsers() {
  }

  saveUser(user: User) {
  }
}

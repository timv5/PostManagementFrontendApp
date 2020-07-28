import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Post} from './post.model';
import {Subject} from 'rxjs';
import {Router} from '@angular/router';
import {SaveEditedPostModel} from './save-edited-post.model';
import {PostBaseService} from './post-base.service';

const BACKEND_URL = environment.apiUrl + '/post/';

@Injectable({providedIn: 'root'})
export class PostsService implements PostBaseService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post [], postCount: number }>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  /*
    ********************** Get all request service **********************
   */
  getPosts() {
    this.http
      .get<{ message: string, posts: any, maxPosts: number }>(
        BACKEND_URL
      )
      .subscribe((transformedPostsData) => {
        if (transformedPostsData.posts.id === null) {
          this.posts = [];
          this.postsUpdated.next({posts: [], postCount: 0});
        }
        else {
          this.posts = transformedPostsData.posts;
          this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostsData.maxPosts});
        }
      });
  }

  /*
  ********************** Get request service by ID **********************
 */
  getPostAllData(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      phone: string,
      address: string,
      valid: boolean,
      creator: string,
      postNumber: string,
      category: string,
      price: string,
      dateControlId: {
        id: string,
        dateTimeFrom: Date,
        dateTimeTo: Date,
        dateTimeCreated: Date,
        dateTimeEdited: Date
      }
    }>(
      BACKEND_URL + 'alldata/' + id
    );
  }

  /*
    ********************** Get request service by ID **********************
   */
  getPost(id: string) {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      phone: string,
      address: string,
      valid: boolean,
      creator: string,
      postNumber: string,
      category: string,
      price: string,
      dateControlId: string
    }>(
      BACKEND_URL + id
    );
  }

  /*
    ********************** Delete request service **********************
    * args: id - post id
   */
  deletePost(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }

  /*
  ********************** Put request service **********************
 */
  updatePost(post: SaveEditedPostModel) {
    this.http
      .put(BACKEND_URL + "saveeditpost/" + post.id, post)
      .subscribe(response => {
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 250);

      });
  }

  /*
   ********************** Post request service **********************
  */
  savePostForm(post: SaveEditedPostModel) {
    return this.http
      .post<{ message: string, post: Post }>(
        BACKEND_URL + "savepost",
        post
      ).subscribe(response => {
        this.router.navigate(['/']);
      });
  }

  /*
    ********************** Get all request service **********************
    * args: id - user id
   */
  getUserPosts(id: string) {
    this.http
      .get<{ message: string, posts: any, maxPosts: number }>(
        BACKEND_URL + "/userposts/" + id
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({posts: [...this.posts], postCount: transformedPostsData.posts.length});
      });
  }


}

import {Injectable} from '@angular/core';
import {PostNumber} from './post-number.model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {PostNumberBaseService} from './post-number-base.service';

const BACKEND_URL = environment.apiUrl + '/postnumber/postnumber';

@Injectable({ providedIn: 'root' })
export class PostNumberService implements PostNumberBaseService {
  private postNumbers: PostNumber[] = [];
  private postNumberUpdated = new Subject<{ posts: PostNumber [], postCount: number }>();

  constructor(
    private http: HttpClient
  ) {}

  getPostNumbersListener() {
    return this.postNumberUpdated.asObservable();
  }

  /*
  * Get post numbers from backend
   */
  getPostNumbers() {
    return this.http.get<{ message: string, posts: any, maxPosts: number }>(
      BACKEND_URL
    ).pipe(map((result) => {
      return { posts: result.posts.map(post => {
          return {
            id: post._id,
            city: post.city,
            number: post.number
          };
        }), maxPosts: result.maxPosts};
    }))
      .subscribe((data => {
        this.postNumbers = data.posts;
        this.postNumberUpdated.next({
          posts: [...this.postNumbers],
          postCount: data.maxPosts
        });
      }));
  }

}

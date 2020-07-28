import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {JobCategoryModel} from './job-category.model';
import {Subject} from 'rxjs';
import {Injectable} from "@angular/core";
import {JobCategoryBaseService} from './job-category-base.service';

const BACKEND_URL = environment.apiUrl + '/jobcategory/jobcategory';

@Injectable({ providedIn: 'root' })
export class JobCategoryService implements JobCategoryBaseService{

  private jobCategories: JobCategoryModel[] = [];
  private jobCategoryUpdated = new Subject<{ jobcategories: JobCategoryModel [], jobcatcount: number }>();

  constructor(
    private http: HttpClient
  ) {}

  getJobCategoryListener() {
    return this.jobCategoryUpdated.asObservable();
  }

  getJobCategories() {
    return this.http.get<{ message: string, jobcategories: any, maxJobCategory: number }>(
      BACKEND_URL
    ).pipe(map((result) => {
      return { jobcategories: result.jobcategories.map(jobcategory => {
          return {
            id: jobcategory._id,
            name: jobcategory.name,
            numberOfUsage: jobcategory.numberOfUsage
          };
        }), maxJobCategory: result.maxJobCategory};
    }))
      .subscribe((data => {
        this.jobCategories = data.jobcategories;
        this.jobCategoryUpdated.next({
          jobcategories: [...this.jobCategories],
          jobcatcount: data.maxJobCategory
        });
      }));
  }

}

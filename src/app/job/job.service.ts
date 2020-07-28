import {JobBaseService} from './job-base.service';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {JobModel} from './job.model';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';

const BACKEND_URL = environment.apiUrl + "/job";

@Injectable({providedIn: 'root'})
export class JobService implements JobBaseService {

  constructor(
    private http: HttpClient,
    private router: Router
  ){}

  createJob(job: JobModel) {
    return this.http
      .post<{message: string, job: JobModel}>(
        BACKEND_URL + "/create",
        job
      ).subscribe(response => {
        this.router.navigate(['/']);
      });
  }
}

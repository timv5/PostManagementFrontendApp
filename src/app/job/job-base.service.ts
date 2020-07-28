import {JobModel} from './job.model';

export abstract class JobBaseService {

  abstract createJob(job: JobModel);

}

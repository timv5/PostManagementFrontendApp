import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DateControlModel} from "./date-control.model";
import {Subject} from "rxjs";
import {DateControlBaseService} from './date-control-base.service';

const BACKEND_URL = environment.apiUrl + '/datecontrol/datecontrol/';

@Injectable({ providedIn: 'root' })

export class DateControlService implements DateControlBaseService {

  private dateControlUpdated = new Subject<{dateControl: DateControlModel}>();

  constructor(
    private http: HttpClient
  ) {}

  getDateControlUpdateListener() {
    return this.dateControlUpdated.asObservable();
  }

  /*
  ********************** Delete request service **********************
 */
  deleteDateControl(id: string) {
    return this.http.delete(BACKEND_URL + id);
  }

  /*
    ********************** Get request service by ID **********************
   */
  getDateControl(postId: string) {
    return this.http.get<{
      _id: string,
      dateTimeFrom: Date,
      dateTimeTo: Date,
      dateTimeCreated: Date,
      dateTimeEdited: Date
    }>(
      BACKEND_URL + postId
    );
  }


}

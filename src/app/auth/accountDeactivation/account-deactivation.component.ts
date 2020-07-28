import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-account-deactivation',
  templateUrl: './account-deactivation.component.html',
  styleUrls: ['./account-deactivation.component.css']
})
export class AccountDeactivationComponent implements OnInit {
  public isLoading = true;
  public deactivationToken: string;

  constructor(
    public route: ActivatedRoute,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('token')) {
        this.deactivationToken = paramMap.get('token');
        this.authService.deactivateUserAccount(this.deactivationToken);
      }
    });
  }
}

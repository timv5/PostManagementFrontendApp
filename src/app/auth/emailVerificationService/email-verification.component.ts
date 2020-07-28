import {Component, OnInit} from '@angular/core';
import {EmailVerificationService} from './email-verification.service';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  public isLoading = true;
  public confirmationToken: string;

  constructor(
    public emailVerificationService: EmailVerificationService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('confirmationToken')) {
        this.confirmationToken = paramMap.get('confirmationToken');
        this.emailVerificationService.sendEmailVerification(this.confirmationToken);
      }
    });
  }
}

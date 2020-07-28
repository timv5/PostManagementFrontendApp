import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PostsService} from '../post.service';
import {AuthService} from '../../auth/auth.service';
import {Post} from '../post.model';
import {Subscription} from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatPaginator,
  MatTableDataSource
} from '@angular/material';
import {FormControl, Validators} from "@angular/forms";
import {PostNumberService} from "../../commons/postNumberService/post-number.service";
import {JobCategoryService} from "../../commons/jobCategoryService/job-category.service";
import {PostNumber} from "../../commons/postNumberService/post-number.model";
import {JobCategoryModel} from "../../commons/jobCategoryService/job-category.model";
import {NavigationStart, Router, RouterEvent} from "@angular/router";
import {filter, take, tap} from "rxjs/operators";
import {UserService} from '../../users/user.service';
import {User} from '../../users/user.model';
import {buttonProperties, messagesProperties, validationMessages, viewLabelProperties} from '../../app.constants';
import {JobService} from '../../job/job.service';
import {JobModel} from '../../job/job.model';
import {JobStatus} from '../../job/job.status.enum';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  private postSub: Subscription;
  totalPosts = 0;
  private authStatusSub: Subscription;
  userIsAuthenticated = false;
  userId: string;
  postNumbers: PostNumber[] = [];
  private postNumberSub: Subscription;
  categories: JobCategoryModel[] = [];
  private jobCategorySub: Subscription;
  newJob: JobModel;

  dataSource = new MatTableDataSource(this.posts);
  displayedColumns: string[] = ['title', 'creator', 'price', 'category', 'postNumber', 'address', 'dateFrom', 'dateTo'];

  // view properties - app.constants
  validationMessages = validationMessages;
  viewLabelProperties = viewLabelProperties;
  buttonProperties = buttonProperties;
  messagesProperties = messagesProperties;

  priceFilter = new FormControl('', [
    Validators.pattern("[+-]?((\\d+\\.?\\d*)|(\\.\\d+))"),
  ]);
  categoryFilter = new FormControl('');
  addressFilter = new FormControl('');
  postNumberFilter = new FormControl('');
  dateFromFilter = new FormControl('');
  dateToFilter = new FormControl('');

  filteredValues = {price: '', category: '', address: '', postNumber: '', dateFrom: '', dateTo: ''};

  constructor(
    public postService: PostsService,
    public authService: AuthService,
    public postNumberService: PostNumberService,
    public jobCategoryService: JobCategoryService,
    public dialog: MatDialog,
    public jobService: JobService
  ) {
    this.dataSource.filterPredicate = this.tableFilter();
  }

  tableFilter(): (data: Post, filter: string) => boolean {
    /*
    * Function for setting Date's time to 0
    * */
    let setDateTime = function (dateStr: string): Date {
      let date = new Date(dateStr);
      date.setMilliseconds(0);
      date.setSeconds(0);
      date.setMinutes(0);
      date.setHours(0);
      return date;
    };
    let filterFunction = function (data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      /*
      * Preparing date date for comparison -> parsing string to Date
      * Setting date comparison variables -> if true date is inside parameters
      * Default value is true and stays true if date fields are not defined
      * */
      let dateFrom = setDateTime(data.dateControl.dateTimeFrom);
      let dateTo = setDateTime(data.dateControl.dateTimeTo);
      let isDateFrom = true;
      let isDateTo = true;
      if (searchTerms.dateFrom != null && searchTerms.dateFrom !== '') {
        isDateFrom = dateFrom >= (setDateTime(searchTerms.dateFrom));
      }
      if (searchTerms.dateTo != null && searchTerms.dateTo !== '') {
        isDateTo = dateTo <= (setDateTime(searchTerms.dateTo));
      }
      /*
      * If all expressions are true filter has found results
      * */

      return Number(data.price) >= Number(searchTerms.price)
        && data.jobCategory.name.toString().trim().toLowerCase().indexOf(searchTerms.category.toLowerCase()) !== -1
        && data.address.toString().trim().toLowerCase().indexOf(searchTerms.address.toLowerCase()) !== -1
        && data.post_number.number.toString().trim().toLowerCase().indexOf(searchTerms.postNumber.toLowerCase()) !== -1
        && isDateFrom
        && isDateTo
    };
    return filterFunction;
  }/*
  * Pagination
  * */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.isLoading = true;
    // Setting pagination to dataSource
    this.dataSource.paginator = this.paginator;
    this.postService.getPosts();
    this.userId = this.authService.getUserId();
    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.dataSource.data = this.posts;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    this.postNumberService.getPostNumbers();
    this.postNumberSub = this.postNumberService.getPostNumbersListener()
      .subscribe((data: { posts: PostNumber[], postCount: number }) => {
        this.postNumbers = data.posts;
      });

    this.jobCategoryService.getJobCategories();
    this.jobCategorySub = this.jobCategoryService.getJobCategoryListener()
      .subscribe((data: { jobcategories: JobCategoryModel[], jobcatcount: number }) => {
        this.categories = data.jobcategories;
      });
    /*
    * Subscription to filter values -> if values are changed, changes are recorded in subscriptions
    * */
    this.priceFilter.valueChanges
      .subscribe((price) => {
        this.filteredValues.price = price;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

    this.categoryFilter.valueChanges
      .subscribe((category) => {
        if (category == undefined) {
          category = '';
        }
        this.filteredValues.category = category;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

    this.addressFilter.valueChanges
      .subscribe((address) => {
        this.filteredValues.address = address;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

    this.postNumberFilter.valueChanges
      .subscribe((postNumber) => {
        if (postNumber == undefined) {
          postNumber = '';
        }

        this.filteredValues.postNumber = postNumber;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

    this.dateFromFilter.valueChanges
      .subscribe((dateFrom) => {
        this.filteredValues.dateFrom = dateFrom;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });

    this.dateToFilter.valueChanges
      .subscribe((dateTo) => {
        this.filteredValues.dateTo = dateTo;
        this.dataSource.filter = JSON.stringify(this.filteredValues);
      });
  }

  /**
   * Accept job
   */
  acceptJob(newJob: JobModel) {
    this.jobService.createJob(newJob);
  }

  /*
  * Function for resetting filter values
  * +
  * */
  onReset() {
    this.priceFilter.setValue('');
    this.categoryFilter.setValue('');
    this.postNumberFilter.setValue('');
    this.addressFilter.setValue('');
    this.dateFromFilter.setValue('');
    this.dateToFilter.setValue('');
  }

  openDialog(event, data) {
    let colClasses = event.target.className.toLowerCase();
    if (!colClasses.includes("creator")) {
      const dialogRef = this.dialog.open(PostDetailsDialog, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: '100%',
        height: '100%',
        panelClass: 'full-screen-modal',
        data : {
          data: data,
          userIsAuthenticated: this.userIsAuthenticated
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // prepare job data
        this.newJob = {
          workerId: this.userId,
          employerId: data.creator_data.id,
          status: JobStatus.PENDING,
          created: new Date(),
          postId: data._id
        };
        this.acceptJob(this.newJob);
      });
    }
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}

@Component({
  selector: 'post-details-modal',
  templateUrl: '../post-details-modal/post-details-modal.html'
})

export class PostDetailsDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PostDetailsDialog>,
    router: Router
  ) {
    router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
      tap(() => {
        let url = router.url;

        if (this.dialogRef.id.length > 0 && router.getCurrentNavigation() != null && router.getCurrentNavigation().trigger != "imperative") {
          router.navigateByUrl(url);
        }
        this.dialogRef.close();
      }),
      take(1),
    ).subscribe();
  }

}

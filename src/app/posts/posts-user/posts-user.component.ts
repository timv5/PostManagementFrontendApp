import {Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Post} from "../post.model";
import {Subscription} from "rxjs";
import {PostsService} from "../post.service";
import {AuthService} from "../../auth/auth.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, PageEvent} from '@angular/material';
import {FormControl} from "@angular/forms";
import {JobCategoryModel} from "../../commons/jobCategoryService/job-category.model";
import {JobCategoryService} from "../../commons/jobCategoryService/job-category.service";
import {PostNumber} from "../../commons/postNumberService/post-number.model";
import {PostNumberService} from "../../commons/postNumberService/post-number.service";
import {NavigationStart, Router, RouterEvent} from '@angular/router';
import {filter, take, tap} from 'rxjs/operators';
import {User} from '../../users/user.model';
import {UserService} from '../../users/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './posts-user.component.html',
  styleUrls: ['./posts-user.component.css']
})
export class PostUserComponent implements OnInit, OnDestroy {

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
  user: User;

  dataSource = new MatTableDataSource(this.posts);
  displayedColumns: string[] = ['title', 'category', 'postNumber', 'address', 'dateFrom', 'dateTo', 'edit', 'delete'];

  titleFilter = new FormControl('');
  categoryFilter = new FormControl('');
  addressFilter = new FormControl('');
  postNumberFilter = new FormControl('');
  dateFromFilter = new FormControl('');
  dateToFilter = new FormControl('');

  filteredValues = {title: '', category: '', address: '', postNumber: '', dateFrom: '', dateTo: ''};

  constructor(
    public postService: PostsService,
    public authService: AuthService,
    public postNumberService: PostNumberService,
    public jobCategoryService: JobCategoryService,
    public dialog: MatDialog,
    public userService: UserService
  ) {
    this.dataSource.filterPredicate = this.tableFilter();
  }

  ngOnInit(): void {
    this.isLoading = true;
    // Setting pagination to dataSource
    this.dataSource.paginator = this.paginator;

    this.postSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.dataSource.data = this.posts;
      });

    // auth
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

    // user data
    // fetch user data
    this.userService.getUser(this.userId)
      .subscribe((userData) => {
        this.user = {
          id: userData._id,
          name: userData.name,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          postNumber: userData.postNumber,
          imagePath: userData.imagePath
        };
      });

    this.postService.getUserPosts(this.userId);

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
    this.titleFilter.valueChanges
      .subscribe((title) => {
        this.filteredValues.title = title;
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
      return data.title.toString().trim().toLowerCase().indexOf(searchTerms.title.toLowerCase()) !== -1
        && data.jobCategory.name.toString().trim().toLowerCase().indexOf(searchTerms.category.toLowerCase()) !== -1
        && data.address.toString().trim().toLowerCase().indexOf(searchTerms.address.toLowerCase()) !== -1
        && data.post_number.number.toString().trim().toLowerCase().indexOf(searchTerms.postNumber.toLowerCase()) !== -1
        && isDateFrom
        && isDateTo
    };
    return filterFunction;
  }
  /*
  * Pagination
  * */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  openDialog(event, data) {
    let colClasses = event.target.className.toLowerCase();
    if (!colClasses.includes("creator")) {
      const dialogRef = this.dialog.open(UserPostDetailsDialog, {
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: '100%',
        height: '100%',
        panelClass: 'full-screen-modal',
        data: {
          data: data,
          user: this.user
        }
      });
    }
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getUserPosts(this.userId);
    }, () => {
      this.isLoading = false;
    });
  }
  /*
  * Function for resetting filter values
  * +
  * */
  onReset() {
    this.titleFilter.setValue('');
    this.categoryFilter.setValue('');
    this.postNumberFilter.setValue('');
    this.addressFilter.setValue('');
    this.dateFromFilter.setValue('');
    this.dateToFilter.setValue('');
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
    this.postNumberSub.unsubscribe();
    this.jobCategorySub.unsubscribe();
  }
}

@Component({
  selector: 'user-post-details',
  templateUrl: '../user-post-details-modal/user-post-details-modal.html'
})

export class UserPostDetailsDialog {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UserPostDetailsDialog>,
    router: Router
  ) {
    // Close dialog ref on route changes
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

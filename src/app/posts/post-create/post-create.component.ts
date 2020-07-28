import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from '../post.service';
import {PostNumber} from '../../commons/postNumberService/post-number.model';
import {PostNumberService} from '../../commons/postNumberService/post-number.service';
import {JobCategoryModel} from '../../commons/jobCategoryService/job-category.model';
import {JobCategoryService} from '../../commons/jobCategoryService/job-category.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {Post} from '../post.model';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DateControlModel} from "../../commons/dateControlService/date-control.model";
import {buttonProperties, messagesProperties, validationMessages, viewLabelProperties} from '../../app.constants';
import {SaveEditedPostModel} from '../save-edited-post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {

  private mode = 'create';
  private postId: string;
  post: Post;
  dateContr: DateControlModel;
  isLoading = false;
  private authStatusSub: Subscription;
  userId: string;
  postNumbers: PostNumber[] = [];
  private postNumberSub: Subscription;
  categories: JobCategoryModel[] = [];
  private jobCategorySub: Subscription;
  dateControl: DateControlModel;
  private dateControlSub: Subscription;

  form: FormGroup;

  // view properties - app.constants
  validationMessages = validationMessages;
  viewLabelProperties = viewLabelProperties;
  buttonProperties = buttonProperties;
  messagesProperties = messagesProperties;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    public authService: AuthService,
    public postNumberService: PostNumberService,
    public jobCategoryService: JobCategoryService
  ) {
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
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

    this.userId = this.authService.getUserId();
    // form properties
    this.form = new FormGroup({
      title: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      phone: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      address: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      postNumber: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      category: new FormControl(
        null,
        {validators: [Validators.required]}
      ),
      dateTimeFrom: new FormControl(
        null,
        {validators: [Validators.required]}
      ),
      dateTimeTo: new FormControl(
        null,
        {validators: [Validators.required]}
      ),
      price: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(1)]}
      ),
      content: new FormControl(
        null,
        {validators: [Validators.required, Validators.maxLength(255)]}
      )
    });

    // get params from url
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;

        // call service
        this.postsService.getPostAllData(this.postId)
          .subscribe(postData => {

            this.isLoading = false;
            this.dateContr = {
              id: postData.dateControlId.id,
              dateTimeFrom: postData.dateControlId.dateTimeFrom,
              dateTimeTo: postData.dateControlId.dateTimeTo,
              dateTimeCreated: postData.dateControlId.dateTimeCreated,
              dateTimeEdited: postData.dateControlId.dateTimeEdited
            };

            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              phone: postData.phone,
              address: postData.address,
              valid: postData.valid,
              creator: postData.creator,
              postNumber: {
                id: postData.postNumber,
                city: "",
                number: ""
              },
              category: {
                id: postData.category,
                name: ""
              },
              price: postData.price,
              dateControlId: {
                id: postData.dateControlId.id,
                dateTimeFrom: postData.dateControlId.dateTimeFrom,
                dateTimeTo: postData.dateControlId.dateTimeTo,
                dateTimeCreated: postData.dateControlId.dateTimeCreated,
                dateTimeEdited: postData.dateControlId.dateTimeEdited
              }
            };

            // initialize form with initial values
            this.form.setValue({
              title: postData.title,
              phone: postData.phone,
              address: postData.address,
              postNumber: postData.postNumber,
              dateTimeFrom: this.dateContr.dateTimeFrom,
              dateTimeTo: this.dateContr.dateTimeTo,
              category: postData.category,
              price: postData.price,
              content: postData.content,
            });
          });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    console.log("test test 1111111111111111");
    console.log(this.form.value.category);
    if (this.form.invalid) {
      return;
    }
    console.log("test test");
    this.isLoading = true;
    let editPost: SaveEditedPostModel;

    if (this.mode === 'create') {
      // prepare data
      editPost = {
        id: this.form.value.id,
        title: this.form.value.title,
        content: this.form.value.content,
        phone: this.form.value.phone,
        address: this.form.value.address,
        valid: true,
        creator: this.userId,
        postNumber: this.form.value.postNumber,
        category: this.form.value.category,
        price: this.form.value.price,
        dateTimeFrom: this.form.value.dateTimeFrom,
        dateTimeTo: new Date(),
        dateTimeEdited: new Date()
      };

      // call service
      this.postsService.savePostForm(editPost);

    } else {
      // prepare data
      editPost = {
        id: this.form.value.id,
        title: this.form.value.title,
        content: this.form.value.content,
        phone: this.form.value.phone,
        address: this.form.value.address,
        valid: true,
        creator: this.userId,
        postNumber: this.form.value.postNumber,
        category: this.form.value.category,
        price: this.form.value.price,
        dateTimeFrom: this.form.value.dateTimeFrom,
        dateTimeTo: this.form.value.dateTimeTo,
        dateTimeEdited: new Date()
      };
      // call service
      this.postsService.updatePost(editPost);
    }

    // clean form
    this.form.reset();
  }


  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
    this.postNumberSub.unsubscribe();
    this.jobCategorySub.unsubscribe();
  }
}

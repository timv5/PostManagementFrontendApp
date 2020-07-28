import {SaveEditedPostModel} from './save-edited-post.model';


export abstract class PostBaseService {

  abstract getPosts();

  abstract getPostAllData(id: string);

  abstract getPost(id: string);

  abstract deletePost(id: string);

  abstract updatePost(post: SaveEditedPostModel);

  abstract savePostForm(post: SaveEditedPostModel);

  abstract getUserPosts(id: string);

}

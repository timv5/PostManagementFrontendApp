export interface SaveEditedPostModel {
  id: string;
  title: string;
  content: string;
  phone: string;
  address: string;
  valid: boolean;
  creator: string;
  postNumber: string;
  category: string;
  price: string;
  dateTimeFrom: Date;
  dateTimeTo: Date;
  dateTimeEdited: Date;
}

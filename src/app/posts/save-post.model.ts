export interface SavePostModel {
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
  dateTimeCreated: Date;
  dateTimeEdited: Date;
}

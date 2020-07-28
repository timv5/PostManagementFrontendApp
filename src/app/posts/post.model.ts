export interface Post {
  id: string;
  title: string;
  content: string;
  phone: string;
  address: string;
  valid: boolean;
  creator: string;
  postNumber: {
    id: string,
    city: string,
    number: string
  };
  category: {
    id: string,
    name: string
  };
  price: string;
  dateControlId: {
    id: string,
    dateTimeFrom: Date,
    dateTimeTo: Date,
    dateTimeCreated: Date,
    dateTimeEdited: Date
  };
}

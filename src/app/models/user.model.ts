export interface User {
  id: string;
  name: {
    first: string;
    last: string;
    mi: string;
  };
  dob: string;
  address: string;
  role: string;
  image: string;
  date: {
    created: string;
    modified: string;
  };
}

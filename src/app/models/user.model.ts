export interface User {
  id: string;
  student_number: string;
  name: {
    first: string;
    last: string;
    mi: string;
  };
  dob: string;
  address: string;
  role: string;
}

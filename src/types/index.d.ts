interface Input {
  name: string;
  value: string;
  id: string;
  type: string;
  label: string | null | undefined;
}
interface InputsHtml {
  id: string;
  name: string;
  type: string;
  value: string;
}

interface User {
  username: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  facebook: string;
  twitter: string;
  github: string;
  linkedin: string;
  plan: Plan;
}
interface Plan {
  name: string;
  id: number;
}

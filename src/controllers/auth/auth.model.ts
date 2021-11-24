export interface ISignup {
  firstName: string;
  lastName: string;
  birthdate: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IVerify {
  email: string;
  token: string;
}

export interface IRecover {
  email: string;
}

export interface IResetPassword {
  email: string;
  token: string;
  newPassword: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

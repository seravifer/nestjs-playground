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

export interface IVerifyEmail {
  email: string;
  token: string;
}

export interface IResetPassword {
  email: string;
}

export interface IConfirmResetPassword {
  email: string;
  token: string;
  newPassword: string;
}

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

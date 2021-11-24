import { JSONSchemaType } from "ajv";
import { IChangePassword, IResetPassword, ILogin, IRecover, ISignup, IVerify } from "./auth.model";

export const signupSchema: JSONSchemaType<ISignup> = {
  $id: "signup",
  type: "object",
  properties: {
    firstName: {
      type: "string",
    },
    lastName: {
      type: "string",
    },
    birthdate: {
      type: "string",
      format: "date",
    },
    email: {
      type: "string",
      format: "email",
    },
    password: {
      type: "string",
    },
  },
  required: ['firstName', 'lastName', 'birthdate', 'email', 'password'],
  additionalProperties: false
};

export const loginSchema: JSONSchemaType<ILogin> = {
  $id: "login",
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
  },
  required: ['email', 'password'],
  additionalProperties: false
};

export const verifySchema: JSONSchemaType<IVerify> = {
  $id: "login",
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    token: {
      type: "string",
    },
  },
  required: ['email', 'token'],
  additionalProperties: false
};

export const recoverSchema: JSONSchemaType<IRecover> = {
  $id: "resetPassword",
  type: "object",
  properties: {
    email: {
      type: "string",
    },
  },
  required: ['email'],
  additionalProperties: false
};

export const resetPasswordSchema: JSONSchemaType<IResetPassword> = {
  $id: "confirmResetPassword",
  type: "object",
  properties: {
    email: {
      type: "string",
    },
    token: {
      type: "string",
    },
    newPassword: {
      type: "string",
    },
  },
  required: ['email', 'token', 'newPassword'],
  additionalProperties: false
};

export const changePasswordSchema: JSONSchemaType<IChangePassword> = {
  $id: "changePassword",
  type: "object",
  properties: {
    oldPassword: {
      type: "string",
    },
    newPassword: {
      type: "string",
    },
  },
  required: ['oldPassword', 'newPassword'],
  additionalProperties: false
};

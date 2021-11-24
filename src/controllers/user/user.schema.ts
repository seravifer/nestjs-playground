import { IUser } from "./user.model";
import { JSONSchemaType } from "ajv";

export const userSchema: JSONSchemaType<IUser> = {
  $id: "user",
  type: "object",
  properties: {
    id: {
      type: "string",
    },
    firstName: {
      type: "string",
      nullable: true
    },
    lastName: {
      type: "string",
      nullable: true
    },
    birthdate: {
      type: "string",
      nullable: true,
      format: "date"
    },
    prefixPhone: {
      type: "integer",
      nullable: true
    },
    phone: {
      type: "integer",
      nullable: true
    },
    email: {
      type: "string",
      nullable: true,
      format: "email"
    },
  },
  required: ['id'],
  additionalProperties: false
};

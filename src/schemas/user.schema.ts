import { IUser } from "./../entities/user";
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
      nullable: true
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
      nullable: true
    },
  },
  required: ['id'],
  additionalProperties: false
};

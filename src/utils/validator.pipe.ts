import {
  PipeTransform,
  Injectable,
  UsePipes,
  BadRequestException,
} from "@nestjs/common";
import Ajv from "ajv";

const ajv = new Ajv();

@Injectable()
export class ValidatorPipe implements PipeTransform {
  constructor(private schema: any) {}

  transform(body: any) {
    const validate = ajv.getSchema(this.schema.$id) || ajv.compile(this.schema);
    if (validate(body)) {
      return body;
    } else {
      throw new BadRequestException(validate.errors);
    }
  }
}

export const Validate = (schema: any) => UsePipes(new ValidatorPipe(schema));

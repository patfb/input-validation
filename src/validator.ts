import { AnyValidateFunction } from "ajv/dist/core";
import Ajv, { JTDSchemaType } from "ajv/dist/jtd";

const ajv = new Ajv({ allErrors: true });

enum SchemaKey {
  person = "person",
}

interface Person {
  firstName: string;
  lastName?: string;
  age: number;
}

const schemaPerson: JTDSchemaType<Person> = {
  properties: {
    firstName: { type: "string" },
    age: { type: "int32" },
  },
  optionalProperties: {
    lastName: { type: "string" },
  },
};

ajv.addSchema(schemaPerson, SchemaKey.person);

const isSchemaKey = (key: SchemaKey) =>
  Object.values(SchemaKey).includes(key as SchemaKey);

interface validate {
  input: any;
  key: SchemaKey;
}

const validate = ({ input, key }: validate) => {
  if (!isSchemaKey(key)) throw Error("invalid schema key");

  const validator = ajv.getSchema(key) as AnyValidateFunction;
  const result = validator(input);

  return result === true
    ? { valid: true, errors: null }
    : { valid: false, errors: validator.errors };
};

export { SchemaKey, validate };

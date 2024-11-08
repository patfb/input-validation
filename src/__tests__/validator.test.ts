import { describe, expect, it } from "@jest/globals";
import { validate, SchemaKey } from "../validator";

describe("validator", () => {
  it("should throw an error if an invalid key is passed in", () => {
    expect(() => {
      validate({ input: "apples", key: "invalidKey" as SchemaKey });
    }).toThrowError("invalid schema key");
  });

  describe("person schema", () => {
    it("should allow a valid data shape", () => {
      const { valid, errors } = validate({
        input: {
          firstName: "Paul",
          lastName: "Bunyan",
          age: 35,
        },
        key: SchemaKey.person,
      });

      expect(valid).toBe(true);
      expect(errors).toBe(null);
    });

    it("should not allow a bad data shape", () => {
      const { valid, errors } = validate({
        input: {
          age: "35",
        },
        key: SchemaKey.person,
      });

      expect(valid).toBe(false);
      expect(errors).toStrictEqual([
        {
          instancePath: "",
          keyword: "properties",
          message: "must have property 'firstName'",
          params: { error: "missing", missingProperty: "firstName" },
          schemaPath: "/properties/firstName",
        },
        {
          instancePath: "/age",
          keyword: "type",
          message: "must be int32",
          params: { nullable: false, type: "int32" },
          schemaPath: "/properties/age/type",
        },
      ]);
    });
  });
});

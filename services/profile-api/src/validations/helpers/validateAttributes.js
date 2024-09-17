import { snakeCase } from "change-case";
import { checkUniqueValidity } from "./checkValidity.js";

export const validateAttributes = async ({
  details,
  attributes,
  context,
  allowEmpty = false,
}) => {
  const errors = [];

  try {
    const validityChecks = attributes.map((attr) =>
      checkUniqueValidity({
        detailList: details,
        key: attr.key,
        uniqueErrorText: `${attr.label} must be unique`,
        emptyErrorText: `${attr.label} is required`,
        existsErrorText: `${attr.label} already exists`,
        filterKey: attr.filterKey || `${snakeCase(attr.key)}__value`,
        context,
        type: "mms:Company",
        allowEmpty,
      }).catch((error) => errors.push(error.message))
    );

    await Promise.all(validityChecks);

    if (errors.length) {
      throw new Error(errors.join(" | "));
    }
  } catch (error) {
    console.error("Error during validation:", error);
    throw error;
  }
};

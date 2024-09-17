export const getResolverCallback = () => {
  return [{
    id: "vcb:Company",
    type: ["met:CreationValidationCallbackFunction"],
    subject: ["mms:Company"],
    resolverPath: "src/validations/validateCompanyCreation.js"
  }, {
    id: "vcb:Company",
    type: ["met:UpdateValidationCallbackFunction"],
    subject: ["mms:Company"],
    resolverPath: "src/validations/validateCompanyUpdate.js"
  }];
};

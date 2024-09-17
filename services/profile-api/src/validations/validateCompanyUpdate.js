import { validateAttributes } from "./helpers/validateAttributes.js";

const validateCompanyUpdate = async (source, args, context, info) => {
  try {
    const details = args.input.data ? [args.input.data] : args.input.bulk || [];

    const attributes = [
      { key: "companyName", label: "Company name" },
      { key: "companyUrl", label: "Company URL" },
      { key: "companyCode", label: "Company code" },
      { key: "companyHubspotId", label: "Company Hubspot ID" },
    ];

    await validateAttributes({
      details,
      attributes,
      context,
      allowEmpty: true,
    });
  } catch (error) {
    console.error("Error in validateCompanyCreation:", error);
    throw error;
  }
};
export default validateCompanyUpdate;

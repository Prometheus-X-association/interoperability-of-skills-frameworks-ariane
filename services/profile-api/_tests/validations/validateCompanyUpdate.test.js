import { jest } from "@jest/globals";
import { snakeCase } from "change-case";

const mockCheckUniqueValidity = jest.fn();
jest.unstable_mockModule(
  "../../src/validations/helpers/checkValidity.js",
  () => ({
    checkUniqueValidity: mockCheckUniqueValidity.mockImplementation(() =>
      Promise.resolve()
    ),
  })
);

const validateCompanyUpdate = (
  await import("../../src/validations/validateCompanyUpdate.js")
).default;

describe("test validateCompanyUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckUniqueValidity.mockImplementation(() => Promise.resolve());
  });

  it("should validate attributes correctly when updating a single company", async () => {
    const mockDetail = {
      companyName: [{ value: "test" }],
      companyUrl: [{ value: "test-url" }],
      companyCode: [{ value: "test-code" }],
      companyHubspotId: [{ value: "test-hubspot-id" }],
    };
    const mockArgs = {
      input: {
        data: mockDetail,
      },
    };

    await validateCompanyUpdate(null, mockArgs, { dataLoader: {} }, {});

    const expectedAttributes = [
      { key: "companyName", label: "Company name", filterKey: undefined },
      { key: "companyUrl", label: "Company URL", filterKey: undefined },
      { key: "companyCode", label: "Company code", filterKey: undefined },
      {
        key: "companyHubspotId",
        label: "Company Hubspot ID",
        filterKey: undefined,
      },
    ];

    expect(mockCheckUniqueValidity).toHaveBeenCalledTimes(
      expectedAttributes.length
    );

    expectedAttributes.forEach((attr) => {
      expect(mockCheckUniqueValidity).toHaveBeenCalledWith(
        expect.objectContaining({
          detailList: [mockDetail],
          key: attr.key,
          uniqueErrorText: `${attr.label} must be unique`,
          emptyErrorText: `${attr.label} is required`,
          existsErrorText: `${attr.label} already exists`,
          filterKey: `${snakeCase(attr.key)}__value`,
          context: expect.anything(),
          type: "mms:Company",
          allowEmpty: true,
        })
      );
    });
  });

  it("should validate attributes correctly when creating multiple companies", async () => {
    const mockDetails = [
      {
        companyName: [{ value: "test" }],
        companyUrl: [{ value: "test-url" }],
        companyCode: [{ value: "test-code" }],
        companyHubspotId: [{ value: "test-hubspot-id" }],
      },
      {
        companyName: [{ value: "test2" }],
        companyUrl: [{ value: "test-url2" }],
        companyCode: [{ value: "test-code2" }],
        companyHubspotId: [{ value: "test-hubspot-id2" }],
      },
    ];

    const mockArgs = {
      input: {
        bulk: mockDetails,
      },
    };

    await validateCompanyUpdate(null, mockArgs, { dataLoader: {} }, {});

    expect(mockCheckUniqueValidity.mock.calls.length).toBe(4);

    mockDetails.forEach((detail, index) => {
      expect(mockCheckUniqueValidity).toHaveBeenCalledWith(
        expect.objectContaining({
          detailList: expect.arrayContaining([expect.objectContaining(detail)]),
          context: expect.anything(),
          type: "mms:Company",
          allowEmpty: true,
        })
      );
    });
  });
});

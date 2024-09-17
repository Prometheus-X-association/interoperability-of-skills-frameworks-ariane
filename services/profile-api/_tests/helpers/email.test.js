import { jest } from "@jest/globals";

const mockMjml2Html = jest.fn();
jest.unstable_mockModule("mjml", () => ({
  default: mockMjml2Html
}))

const mockHandlebarsCompile = jest.fn();
const mockHandlebarsCompileResult = jest.fn();
jest.unstable_mockModule("handlebars", () => ({
  default: {
    compile: mockHandlebarsCompile
  }
}))

const mockMailjetPost = jest.fn();
const mockMailjetRequest = jest.fn();
jest.unstable_mockModule("node-mailjet", () => ({
  default: function() {
    return ({
      post: mockMailjetPost
    })
  }
}))
jest.unstable_mockModule("../../_confs/config.js", () => ({
  default: {
    mailjet: {
      apiKey: 'key',
      apiSecret: 'secret'
    }
  }
}))

describe("email helpers", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it("should compile html content", async () => {
    mockHandlebarsCompileResult.mockReturnValueOnce("compiled")
    mockHandlebarsCompile.mockReturnValueOnce(mockHandlebarsCompileResult)
    mockMjml2Html.mockReturnValueOnce({ html: "html" })
    const { compileHtmlContent } = await import("../../src/helpers/email.js");
    const result = compileHtmlContent({
      template: "template",
      data: "data"
    })
    expect(mockHandlebarsCompile).toHaveBeenCalledWith("template")
    expect(mockHandlebarsCompileResult).toHaveBeenCalledWith("data")
    expect(mockMjml2Html).toHaveBeenCalledWith("compiled")
    expect(result).toBe("html")
  })
  it("should send email by mailjet properly", async () => {
    const { sendEmail } = await import("../../src/helpers/email.js");
    mockMailjetPost.mockReturnValueOnce({ request: mockMailjetRequest })
    await sendEmail({
      from: "from",
      to: "to",
      subject: "subject",
      html: "html"
    })
    expect(mockMailjetPost).toHaveBeenCalledWith('send', { version: 'v3.1' })
    expect(mockMailjetRequest).toHaveBeenCalledWith({
      Messages: [{
        From: {
          Email: "from"
        },
        To: [{
          Email: "to"
        }],
        Subject: "subject",
        HTMLPart: "html"
      }]
    })
  })
})
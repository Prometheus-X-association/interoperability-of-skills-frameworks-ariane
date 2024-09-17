import Mailjet from 'node-mailjet';
import config from "../../_confs/config.js";
import mjml2html from 'mjml'
import handlebars from 'handlebars';

const mailjet = new Mailjet({
  apiKey: config.mailjet.apiKey,
  apiSecret: config.mailjet.apiSecret
})

export const compileHtmlContent = ({
  template,
  data
}) => {
  const mjml = handlebars.compile(template)(data)
  const {
    html
  } = mjml2html(mjml)
  return html
}

export const sendEmail = async ({
  from,
  to,
  subject,
  html
}) => {
  await mailjet.post('send', {
    version: 'v3.1'
  }).request({
    Messages: [{
      From: {
        Email: from
      },
      To: [{
        Email: to
      }],
      Subject: subject,
      HTMLPart: html
    }]
  })

}
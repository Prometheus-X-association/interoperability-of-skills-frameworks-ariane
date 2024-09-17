import { nanoid } from 'nanoid';
import { readFileSync } from 'node:fs';
import { generateOneTimeToken } from '../keycloak/oneTimeToken.js';
import { compileHtmlContent, sendEmail } from '../helpers/email.js';
import { randomString } from '../utils/randomString.js';
import { createUser, searchUser, updateUser } from '../helpers/keycloak.js';
import kcAdminClient from '../keycloak/adminClient.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import config from "../../_confs/config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const signupEmailTemplate = readFileSync(
  join(__dirname, '../emailTemplates/signup.mjml'), 'utf-8'
)
export default async (_, args, context, info) => {
  try {
    const {
      username,
      // password,
      firstName,
      lastName,
      email,
      company,
      directManager
    } = args // validated by GraphQL

    const dataLoader = context.dataLoader;
    /** Check company existence */
    const companyDetail = (await dataLoader.getByArgs({
      size: 1,
      filters: {
        type: "mms:Company",
        id: company,
        status__value: "Active"
      },
    }, null))?.[0]

    if (!company || !companyDetail || companyDetail.id !== company) {
      throw new Error("Company not found")
    }

    /** Check Direct Manager existence */
    if (directManager) {
      const directManagerDetail = (await dataLoader.getByArgs({
        size: 1,
        filters: {
          type: "mms:User",
          id: directManager,
          status__value: "Active"
        },
      }, null))?.[0]

      if (!directManagerDetail || directManagerDetail.id !== directManager) {
        throw new Error("Direct manager not found")
      }
    }

    /** Check keycloak user */
    let initialPassword
    let keycloakUser = await searchUser({ kcAdminClient, email });
    let personalDataWalletId
    if (keycloakUser) {
      const userDetail = (await dataLoader.getByArgs({
        size: 1,
        filters: {
          type: "mms:User",
          id: keycloakUser.id,
          company,
          // status__value: "Active"
        },
      }, null))?.[0]

      if (userDetail) {
        const statusObject = userDetail.status[0]
        const status = statusObject['@value'] ?? statusObject.value
        if (status === 'Active') {
          throw new Error("User already exists")
        }
        // Just in rare case that user changed company
        personalDataWalletId = userDetail.personalData[0]
        await updateUser({
          kcAdminClient,
          args: {
            id: keycloakUser.id,
            ...args
          }
        })
      }
    } else {
      initialPassword = randomString()
      keycloakUser = await createUser({
        kcAdminClient,
        args: {
          password: initialPassword,
          ...args
        }
      })
    }

    const mutations = info.schema.getMutationType().getFields();
    const id = keycloakUser.id
    /** Recreate user data */
    const userDetail = {
      id,
      searchedUser: [`mirrored/${id}`],
      company: [company],
      keycloakId: [{ value: id }],
      status: [{ value: 'Pending' }],
      ...(directManager ? { directManager: [directManager] } : {}),
    }
    const personalData = {
      id: personalDataWalletId ??`personalDataWallet/${nanoid(15)}`,
      personalDataOf: [id],
      searchedUser: [`mirrored/${id}`],
      family: [{ value: firstName }],
      given: [{ value: lastName }],
      email: [{ value: email }],
    }

    await mutations.createUser?.resolve?.(
      undefined,
      {
        input: {
          data: userDetail,
          where: {
            id: [id],
          },
        },
      },
      context,
      info,
    );
    // console.log('createRes', createRes)
    await mutations.createPersonalDataWallet?.resolve?.(
      undefined,
      {
        input: {
          data: personalData,
          where: {
            id: [personalData.id],
          },
        },
      },
      context,
      info,
    );

    const oneTimeToken = generateOneTimeToken(keycloakUser.id)
    /** Send email */
    const html = compileHtmlContent({
      template: signupEmailTemplate,
      data: {
        customerName: `${firstName} ${lastName}`,
        url: `${config.signupCallbackLink}?token=${oneTimeToken}`
      }
    })
    try {
      await sendEmail({
        from: config.mailjet.sender,
        to: email,
        subject: 'Activate your Jobsong account',
        html
      })
    } catch (e) {
      console.error('Error when trying to send activation email after signing up', e)
    }
    return {
      userId: keycloakUser.id
    }
  } catch (e) {
    throw new Error(e.responseData?.errorMessage ?? e)
  }
}
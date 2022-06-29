import { readFileSync } from 'fs';
import { resolve } from 'path';
import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';

import { configuration } from '../configs/config';
import Handlebars from 'handlebars';

const { awsAccessKeyId, awsSecretAccessKey, awsRegion, sesApiVersion, sesEmailId } = configuration();

// Load the AWS SDK for Node.js
// import AWS from 'aws-sdk';
// Set the region
// AWS.config.update({
//   accessKeyId: awsAccessKeyId,
//   secretAccessKey: awsSecretAccessKey,
//   region: awsRegion,
// });

// const ses = new AWS.SES({ apiVersion: sesApiVersion });
const client = new SESClient({
  region: awsRegion,
  apiVersion: sesApiVersion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

let templateHtml: string;
let subject: string;

export class Emailer {
  public async sendEmail(destinationEmailAddess: string, templateName: string, templateData: object) {
    switch (templateName) {
      case 'ApiKeyTemplate':
        templateHtml = readFileSync(resolve(__dirname, '../email-templates/api-key-template.hbs'), 'utf8');
        subject = 'Your Shyft API Key';
        break;
      /**
       * More templates can be added here
       */
    }

    const compiledTemplate = Handlebars.compile(templateHtml);
    const rawHtml = compiledTemplate(templateData);

    // Create sendEmail params
    const params = {
      Destination: {
        /* required */
        // CcAddresses: [
        //   'EMAIL_ADDRESS',
        // ],
        ToAddresses: [destinationEmailAddess],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: 'UTF-8',
            Data: rawHtml,
          },
          // Text: {
          //  Charset: "UTF-8",
          //  Data: "TEXT_FORMAT_BODY"
          // }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: sesEmailId /* required */,
      // ReplyToAddresses: [
      //   "Email Address",
      // ],
    };

    // Create the promise and SES service object
    const sendPromise = await client.send(new SendEmailCommand(params));
    return sendPromise;
  }
}

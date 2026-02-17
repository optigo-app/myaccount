import axios from "axios";

const WHATSAPP_URL =
  "https://apilx.optigoapps.com/api/whatsapp/templates/send";

export async function sendOtpOnWhatsapp({
  phoneNo,
  otp,
  appuserid,
  customerId,
}) {
  const body = {
    phoneNo,
    type: "template",
    appuserid,
    customerId,
    template: {
      name: "otp",
      language: {
        code: "en",
      },
      components: [
        {
          type: "body",
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
        {
          type: "button",
          sub_type: "url",
          index: 0,
          parameters: [
            {
              type: "text",
              text: otp,
            },
          ],
        },
      ],
    },
  };

  const response = await axios.post(WHATSAPP_URL, body, {
    headers: {
      YearCode: "e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIwfX17e2RlbW99fXt7YmFkYW19fQ==",
      sv: "1",
    },
  });

  return response.data;
}

const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();
const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const myToken = process.env.MYTOKEN;

app.listen(process.env.PORT || 3000, () => {
    console.log("webhook is working");
});


// function to send msg
// async function sendMessage(templateName, to) {
//     try {
//         await axios.post(
//             `https://graph.facebook.com/v16.0/${process.env.PHONE_NUMBER_ID}/messages`,
//             {
//                 messaging_product: "whatsapp",
//                 to: to,
//                 type: "template",
//                 template: {
//                     name: templateName,
//                     language: {
//                         code: "en_US",
//                     },
//                 },
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );
//     } catch (error) {
//         console.error("Error sending message:", error);
//     }
// }





// get request
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token2 = req.query["hub.verify_token"];

    if (mode && token2) {
        if (mode === "subscribe" && token2 === myToken) {
            res.status(200).send(challenge);
        }
        else {
            res.status(403);
        }
    }
});


// post request to send msg
app.post("/webhook", (req, res) => {
    console.log("POST request received at /webhook");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    let body_param = req.body;

    if (body_param.object) {
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]) {
            let ph_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            axios({
                method: "post",
                url: `https://graph.facebook.com/v20.0/${ph_no_id}/messages?access_token=${token}`,
                data: {
                    // messaging_product: "whatsapp",
                    // to: from,
                    // type: "template",
                    // template: {
                    //     name: "hello_world",
                    //     language: {
                    //         code: "en_US" // Make sure to use the appropriate language code
                    //     }
                    // }

                    // messaging_product: "whatsapp",
                    // to: from,
                    // type: "template",
                    // template: {
                    //     name: "welcome_msg",
                    //     language: {
                    //         code: "en"
                    //     }
                    // }

                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: "Greetings Dear Voter 😊\nWelcome to Voter सहायक, A WhatsApp Chatbot launched by District Election Officer, South West for making voter experience absolutely hassle- free.\nPlease choose your language of preference.\nप्रिय मतदाता, नमस्ते 😊\nवोटर सहायक में आपका स्वागत है, जिसे दक्षिण पश्चिम के जिला चुनाव अधिकारी द्वारा शुरू किया गया है ताकि आपके मतदाता अनुभव को बिल्कुल परेशानी मुक्त बनाया जा सके।\nकृपया अपनी पसंद की भाषा चुनें।"
                    }
                },
                headers: {
                    "Content-Type": "application/json"
                }

            })
                .then(response => {
                    console.log("Template message sent successfully:", response.data);
                })
                .catch(error => {
                    console.error("Error sending template message:", error.response ? error.response.data : error.message);
                });
            console.log(ph_no_id, " ", from, " ", msg_body);
            res.sendStatus(200);
        }
        else {
            res.sendStatus(404);
        }
    }
    else {
        console.log("Object not found in request");
        res.sendStatus(404);
    }
});


// get request at root
app.get("/", (req, res) => {
    res.status(200).send("Hello guys, get at root");
});

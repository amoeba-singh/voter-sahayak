const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
require('dotenv').config();
const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const myToken = process.env.MYTOKEN;

app.listen(process.env.PORT, () => {
    console.log("webhook is working");
});

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

app.post("/webhook", (req, res) => {
    console.log("POST request received at /webhook");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    let body_param = req.body;

    if (body_param.object) {
        if (body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0])
        {
            let ph_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            axios({
                method: "post",
                url: `https://graph.facebook.com/v20.0/${ph_no_id}/messages?access_token=${token}`,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    type: "template",
                    template: {
                        name: "hello_world",
                        language: {
                            code: "en_US" // Make sure to use the appropriate language code
                        }
                        // Add 'components' if your template requires variables
                        // components: [
                        //     {
                        //         type: "body",
                        //         parameters: [
                        //             {
                        //                 type: "text",
                        //                 text: "Your text here"
                        //             }
                        //         ]
                        //     }
                        // ]
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
        else{
            res.sendStatus(404);
        }
    }
    else {
        console.log("Object not found in request");
        res.sendStatus(404);
    }
});

app.get("/", (req, res)=>{
    res.status(200).send("Hello guys, get at root");
});

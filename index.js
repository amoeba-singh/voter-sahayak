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

let ph_no_id = 427623857081465;
const userState = {};

async function sendText(txt, to) {
    try {
        await axios({
            method: "post",
            url: `https://graph.facebook.com/v20.0/${ph_no_id}/messages?access_token=${token}`,
            data: {
                messaging_product: "whatsapp",
                to: to,
                text: {
                    body: txt
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
        res.sendStatus(200);
    }
    catch (error) {
        res.sendStatus(404);
        console.error("Error sending message:", error);
    }

}





// function to send template
async function sendMessage(templateName, to) {
    try {
        await axios({
            method: "post",
            url: `https://graph.facebook.com/v20.0/${ph_no_id}/messages?access_token=${token}`,
            data: {
                messaging_product: "whatsapp",
                to: to,
                type: "template",
                template: {
                    name: templateName,
                    language: {
                        code: "en"
                    }
                }
            },
            headers: {
                "Content-Type": "application/json"
            }
        })
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(404);
        console.error("Error sending message:", error);
    }
};



// post request to recieve msg and send msg
app.post("/webhook", async (req, res) => {
    console.log("POST request received at /webhook");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

    let body_param = req.body;

    if (body_param.object) {
        if (body_param.entry && body_param.entry[0].changes && body_param.entry[0].changes[0].value.messages && body_param.entry[0].changes[0].value.messages[0]) {
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let receivedMessage;
            let buttonPayload;
            let responseMessage;

            if (body_param.entry[0].changes[0].value.messages[0]?.text?.body) {
                receivedMessage = body_param.entry[0].changes[0].value.messages[0].text.body;
                receivedMessage = receivedMessage.toLowerCase();
            }
            else if (body_param.entry[0].changes[0].value.messages[0]?.button?.text) {
                buttonPayload = body_param.entry[0].changes[0].value.messages[0].button.text;
            }

            if (!userState[from]) {
                userState[from] = { stage: "initial" };
            }

            try {
                switch (userState[from].stage) {
                    case "initial":
                        if (receivedMessage == "hi") {
                            await sendMessage("welcome_msg", from);
                        }

                        switch (buttonPayload) {
                            case "English":
                                await sendMessage("english_menu", from); // Menu
                                break;

                            case "Hindi":
                                await sendMessage("hindi_menu", from); // Hindi Menu
                                break;

                            case "remenu_eng":
                                await sendMessage("english_menu", from); // Menu
                                break;

                            case "remenu_hin":
                                await sendMessage("hindi_menu", from); // Hindi Menu
                                break;



                            case "ps":
                                responseMessage = "Enter your EPIC No";
                                userState[from].stage = "awaitingEpic";
                                break;

                            case "ecd":
                                responseMessage = "Enter your EPIC No";
                                userState[from].stage = "detailEpic";
                                break;

                            case "rv":
                                responseMessage = `Click the below link to register:\n\nhttps://voters.eci.gov.in/form6`;
                                setTimeout(async () => {
                                    await sendMessage("english_remenu", from); // Remenu with 500ms delay
                                }, 500);
                                break;

                            case "epd":
                                responseMessage = `Click the below link for deletion of name:\n\nhttps://voters.eci.gov.in/form7`;
                                setTimeout(async () => {
                                    await sendMessage("english_remenu", from); // Remenu with 500ms delay
                                }, 500);
                                break;

                            case "epc":
                                responseMessage = `Click the below link for correction:\n\nhttps://voters.eci.gov.in/form8`;
                                setTimeout(async () => {
                                    await sendMessage("english_remenu", from); // Remenu with 500ms delay
                                }, 500);
                                break;

                            case "apps":
                                responseMessage = `Click the below link to track application:\n\nhttps://voters.eci.gov.in/home/track`;
                                setTimeout(async () => {
                                    await sendMessage("english_remenu", from); // Remenu with 500ms delay
                                }, 500);
                                break;

                            case "kyo":
                                responseMessage = `Click the below link to know your officer:\n\nhttps://electoralsearch.eci.gov.in/pollingstation`;
                                setTimeout(async () => {
                                    await sendMessage("english_remenu", from); // Remenu with 500ms delay
                                }, 500);
                                break;

                            case "svl":
                                responseMessage = `Click the below link to search voter list:\n\nhttps://electoralsearch.eci.gov.in/`;
                                setTimeout(async () => {
                                    await sendMessage("english_remenu", from); // Remenu with 500ms delay
                                }, 500);
                                break;

                            case "vh":
                                responseMessage = `1950 (Toll-free Number)\ncomplaints@eci.gov.in\nElection Commission Of India,\nNirvachan Sadan, Ashoka Road,\nNew Delhi 110001`;
                                setTimeout(async () => {
                                    await sendMessage("english_remenu", from); // Remenu with 500ms delay
                                }, 500);
                                break;




                            case "hps":
                                responseMessage = "कृपया अपना EPIC नंबर दर्ज करें।";
                                userState[from].stage = "awaitingEpic";
                                break;

                            case "hecd":
                                responseMessage = "कृपया अपना EPIC नंबर दर्ज करें।";
                                userState[from].stage = "detailEpic";
                                break;

                            case "hrv":
                                responseMessage = `Click the below link to register:\n\nhttps://voters.eci.gov.in/form6`;
                                setTimeout(async () => {
                                    await sendMessage("hindi_remenu", from); // Remenu with 500ms delay
                                }, 500);
                                break;

                            case "hepd":
                                responseMessage = `नाम हटाने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n\nhttps://voters.eci.gov.in/form7`;
                                setTimeout(async () => {
                                    await sendMessage("hindi_remenu", from); //hindi Remenu with 500ms delay
                                }, 500);
                                break;

                            case "hepc":
                                responseMessage = `सुधार के लिए नीचे दिए गए लिंक पर क्लिक करें\n\nhttps://voters.eci.gov.in/form8`;
                                setTimeout(async () => {
                                    await sendMessage("hindi_remenu", from); //hindi Remenu with 500ms delay
                                }, 500);
                                break;

                            case "happs":
                                responseMessage = `एप्लिकेशन को ट्रैक करने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n\nhttps://voters.eci.gov.in/home/track`;
                                setTimeout(async () => {
                                    await sendMessage("hindi_remenu", from); //hindi Remenu with 500ms delay
                                }, 500);
                                break;

                            case "hkyo":
                                responseMessage = `अपने अधिकारी को जानने के लिए नीचे दिए गए लिंक पर क्लिक करें:\n\nhttps://electoralsearch.eci.gov.in/pollingstation`;
                                setTimeout(async () => {
                                    await sendMessage("hindi_remenu", from); //hindi Remenu with 500ms delay
                                }, 500);
                                break;

                            case "hsvl":
                                responseMessage = `मतदाता सूची के लिए नीचे दिए गए लिंक को दबाएं:\n\nhttps://electoralsearch.eci.gov.in/`;
                                setTimeout(async () => {
                                    await sendMessage("hindi_remenu", from); //hindi Remenu with 500ms delay
                                }, 500);
                                break;

                            case "hvh":
                                responseMessage = `1950 (Toll-free Number)\ncomplaints@eci.gov.in\nElection Commission Of India,\nनिर्वाचन सदन, अशोक रोड,\n नई दिल्ली 110001`;
                                setTimeout(async () => {
                                    await sendMessage("hindi_remenu", from); //hindi Remenu with 500ms delay
                                }, 500);
                                break;
                        }
                        break;


                    case "awaitingEpic":
                        userState[from].epicNumber = receivedMessage;

                        responseMessage = "Processing your request, please wait...";
                        // try {
                        //     responseMessage = "Processing your request, please wait...";

                        //     const backendResponse = await axios.post(
                        //         `http://localhost:${PORT}/epic/data`,
                        //         {
                        //             epicNumber: userState[from].epicNumber,
                        //         }
                        //     );
                        //     responseMessage = `You will vote here:\n ${backendResponse.data.pollingLocation}\n ${backendResponse.data.googleMapsLink}`;
                        // }
                        // catch (error) {
                        //     responseMessage = "There was an error processing your request. Please try again.";
                        // }

                        setTimeout(async () => {
                            await sendMessage("language_preference", from); // Remenu
                        }, 2000);

                        userState[from].stage = "initial";
                        break;


                    case "detailEpic":
                        userState[from].epicNumber = receivedMessage;
                        
                        responseMessage = "Processing your request, please wait...";
                        // try {
                        //     responseMessage = "Processing your request, please wait...";

                        //     const backendResponse = await axios.post(
                        //         `http://localhost:${PORT}/epic/data`,
                        //         {
                        //             epicNumber: userState[from].epicNumber,
                        //         }
                        //     );
                        //     responseMessage = `Fullname:\n ${backendResponse.data.Fname}/${backendResponse.data.FnameH}\n Age :  ${backendResponse.data.age}\n Relation: ${backendResponse.data.relation}\n State:${backendResponse.data.state}\n Assembly: ${backendResponse.data.assemblyC} \nPart:${backendResponse.data.Part}\n Part NO: ${backendResponse.data.partNo}`;
                        // }
                        // catch (error) {
                        //     responseMessage = "There was an error processing your request. Please try again.";
                        // }

                        setTimeout(async () => {
                            await sendMessage("language_preference", from); // Remenu
                        }, 2000);

                        userState[from].stage = "initial";
                        break;


                    default:
                        responseMessage = 'Something went wrong. Please send "Hi" to start the conversation again.';
                        userState[from].stage = "initial";
                        break;
                }
                res.set("Content-Type", "text/xml");

                if (responseMessage) {
                    await sendText(responseMessage, from);
                    res.status(200).send("");
                }
                else {
                    res.status(200).send("");
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).send("");
            }
        }
        else {
            console.log("JSON did't matched for text")
            res.sendStatus(404);
        }
    }
    else {
        console.log("Object not found in request");
        res.sendStatus(404);
    }
});























// get request for verification
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


// get request at root
app.get("/", (req, res) => {
    res.status(200).send("Hello guys, get at root");
});

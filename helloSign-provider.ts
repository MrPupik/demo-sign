
import express from "express"
const app = express();
const port = 3333; // default port to listen
import hellosign from 'hellosign-sdk'
const signSdk = new hellosign(({ key: process.env.HS_API_KEY || '' }))
const HS_CLIENT_ID = process.env.HS_CLIENT_ID || ''

const dateFeild = {
    "api_id": "field1", "placeholder": "First Name",
    "auto_fill_type": "firstName", "name": "la la la",
    "type": "text", "x": 40, "y": 60, "page": 1, "width": 120, "height": 30,
    "required": true, "signer": 0
}

// define a route handler for the default home page
app.get("/", (req, res) => {

    res.send("Hello world!");
});


app.get("/sign", (req, res) => {
    const options = {
        test_mode: 1,
        clientId: HS_CLIENT_ID,
        // subject: 'NDA with Acme Co.',
        message: 'Please sign this NDA and then we can discuss more.?',
        signers: [
            {
                email_address: 'jack@example.com',
                name: 'Jack'
            }
        ],
        files: ['doc1.pdf'],

    };
    signSdk.signatureRequest.createEmbedded(options).then((result) => {
        let sign_url = undefined
        console.log(JSON.stringify(result))
        const sigId = result.signature_request.signatures[0].signature_id
        signSdk.embedded.getSignUrl(sigId).then((res) => {
            sign_url = res.embedded.sign_url
        }).catch((err) => {
            // handle error
        });


        res.send(JSON.stringify({ 'fitst signuture id':  }))

    }).catch((err) => {
        console.log(err.message + '\n');

        console.log(JSON.stringify(err));

        res.send('shit');
    });
})

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});



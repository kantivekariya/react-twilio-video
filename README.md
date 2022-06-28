# React Twilio Video

this is an example video chat application built with [Twilio Video](https://www.twilio.com/docs/video), Reactjs + Nodejs.
# Overview 

To run the application you will need a [Twilio account](https://www.twilio.com/try-twilio) and Node.js and npm installed.

# clone Repo & Install dependencies:

```bash
git clone git@github.com:kantivekariya/react-twilio-video.git
```

Install the dependencies and run client side:

```bash
npm install
```

```bash
npm start
```
### Add Credential inside twilio-server .env file.
Create a .env file by copying the .env.example and add twilio accountSID , available in your [Twilio console](https://www.twilio.com/console). Add it to the `.env` file.

```bash
TWILIO_ACCOUNT_SID=XXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXX
TWILIO_API_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXX
```

## Running the server

Once you have completed the above you can run the application with:

```bash
npm run start
```






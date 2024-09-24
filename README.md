# ColdMailer 

## Setup

Clone the repository (or download the code directly):

bash
```
git clone <repository-url>

cd <repository-directory>
```
### Create a file with comma-separated emails:

Create a file named emails.txt in the project's root directory and enter your emails separated by commas. Example:

``
testmailgmail.com, hello@gmail.com, hi@gmail.com, ...
``

### Update the configuration:

Open the main.js (or equivalent script file) and update the following lines with your email credentials:

javascript
```
const smtpConfig = {
    host: 'smtp.gmail.com', // Use the SMTP server for Gmail
    port: 587, // Use port 587 for TLS
    secure: false, // Set to true if using port 465 for SSL
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-password-or-app-password' // Replace with your email password or app-specific password
    }
};
```
You must use an App Password if you're using Gmail with two-factor authentication (2FA).

### Customize your email content:

Modify the subject and body of the email by editing these lines in the script:

javascript
```
const subject = 'Subject of your email';
const body = 'This is the body of the email.';
```

### Usage
To run the script and send emails:

Run the script using Node.js:

bash
```
node main.js
The script will:
```

Read the emails.txt file and extract the email addresses.
Send an email to each recipient.
Log the status of each email (success or failure) in the console.
Batch Sending and Throttling
The script is optimized to send emails in batches with a delay between each batch to avoid overwhelming the SMTP server or hitting rate limits. You can customize the batch size and delay like this:

javascript
```
const batchSize = 10; // Number of emails per batch
const delayBetweenBatches = 5000; // Delay between batches in milliseconds (e.g., 5000 = 5 seconds)
```

### Notes
Gmail limits: Gmail has a daily email sending limits. For standard Gmail accounts, it's about 500 emails per day, and for G Suite accounts, it's around 2,000 emails. Adjust the batch size and delay accordingly to avoid issues.
App Passwords: If you're using Gmail with two-factor authentication (2FA), you must generate an app password from your Google Account settings.

### License
This project is licensed under the MIT License.

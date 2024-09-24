const nodemailer = require('nodemailer');
const fs = require('fs');

// Load email addresses from a text file
function loadEmailsFromTextFile(textFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(textFile, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }
            // Split the file content by commas to get an array of emails
            const emailList = data.split(',').map(email => email.trim());

            // Filter valid email addresses
            const validEmails = emailList.filter(email => email && email.includes('@'));

            if (validEmails.length === 0) {
                console.error('No valid email addresses found.');
            }

            resolve(validEmails);
        });
    });
}

// Send email function using nodemailer
async function sendEmail(smtpConfig, recipientEmail, subject, body) {
    const transporter = nodemailer.createTransport(smtpConfig);

    const mailOptions = {
        from: smtpConfig.auth.user,
        to: recipientEmail, // Ensure recipientEmail is passed here
        subject: subject,
        text: body
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${recipientEmail}`);
    } catch (error) {
        console.error(`Failed to send email to ${recipientEmail}:`, error);
    }
}

// Function to handle sending emails in batches
async function sendEmailsInBatches(emailList, smtpConfig, subject, body, batchSize, delayBetweenBatches) {
    for (let i = 0; i < emailList.length; i += batchSize) {
        const batch = emailList.slice(i, i + batchSize);
        console.log(`Sending batch of ${batch.length} emails...`);

        // Send emails in parallel (but control concurrency with batch size)
        await Promise.all(
            batch.map(recipientEmail => sendEmail(smtpConfig, recipientEmail, subject, body))
        );

        // Throttle - delay between batches
        if (i + batchSize < emailList.length) {
            console.log(`Waiting for ${delayBetweenBatches / 1000} seconds before sending the next batch...`);
            await new Promise(resolve => setTimeout(resolve, delayBetweenBatches));
        }
    }
}

// Main function to load emails from text file and send them
async function main() {
    const smtpConfig = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'your@email.com', // Your email address
            pass: 'password' // Your email password or app password
        }
    };

    const textFile = 'emails.txt'; // Path to your text file
    const subject = 'Web Design Services from Infinity Linkage';
    const body = `body of the email here`;

    const batchSize = 10; // Number of emails per batch
    const delayBetweenBatches = 5000; // Delay between batches in milliseconds (5 seconds)

    try {
        const emailList = await loadEmailsFromTextFile(textFile);

        if (emailList.length === 0) {
            console.error('No valid email addresses found.');
            return;
        }

        console.log(`Total emails to send: ${emailList.length}`);
        await sendEmailsInBatches(emailList, smtpConfig, subject, body, batchSize, delayBetweenBatches);
        console.log('All emails have been sent successfully.');
    } catch (error) {
        console.error('Error processing emails:', error);
    }
}

// Start the email sending process
main();

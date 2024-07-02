var jwt = require('jsonwebtoken');

// Function to generate a JWT verification token with an expiration time of one hour

export function generateClientAccessToken(phoneNumber: string,expiryTime="1h") {
    // Generate a JWT token with the email as payload and expiration time of 1 hour
    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
}

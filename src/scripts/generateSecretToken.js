const crypto = require('crypto');

function generateJWTSecret(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

const secret = generateJWTSecret();
console.log(`JWT Secret: ${secret}`);

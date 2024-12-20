const crypto = require("crypto");
require("dotenv").config();

const algorithm = "aes-256-cbc";
const secretKey = process.env.ENCRYPTION_SECRET_KEY || '12c64ab616476558cd1c101176c1cb8988d7fcdf2689f8511a2f69d3d822473e';
const ivLength = 16;

const decrypt = (hash) => {
  const parts = hash.split(":");
  if (parts.length !== 2) {
    console.error("Invalid encrypted data format:", hash);
    throw new Error("Invalid encrypted data format");
  }
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = Buffer.from(parts[1], "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, "hex"), iv);
  const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString("utf8");
};

module.exports = decrypt;

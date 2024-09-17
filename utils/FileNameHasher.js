const crypto = require("crypto");

async function fileNameHasher(input) {
    // Normalize the string by removing diacritics and converting to lower case
    const normalized = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    // Replace spaces and special characters with underscores
    const safeString = normalized.replace(/[^a-z0-9]/g, "_");

    // Use the SubtleCrypto API to generate a SHA-256 hash of the string
    const msgUint8 = new TextEncoder().encode(safeString); // encode as (utf-8) Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8); // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string

    // Use the first 15 characters of the hash for the filename
    const truncatedHash = hashHex.substring(0, 15);

    // Construct the final filename
    const filename = `${truncatedHash}.wav`;

    return filename;
}
module.exports = fileNameHasher;
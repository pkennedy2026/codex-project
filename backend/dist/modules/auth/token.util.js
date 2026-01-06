"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
exports.verifyToken = verifyToken;
const crypto_1 = require("crypto");
const secret = process.env.JWT_SECRET || 'dev-secret';
function base64url(input) {
    return Buffer.from(input).toString('base64url');
}
function signToken(payload) {
    const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = base64url(JSON.stringify(payload));
    const data = `${header}.${body}`;
    const signature = crypto_1.default.createHmac('sha256', secret).update(data).digest('base64url');
    return `${data}.${signature}`;
}
function verifyToken(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid token structure');
    }
    const [header, body, signature] = parts;
    const data = `${header}.${body}`;
    const expected = crypto_1.default.createHmac('sha256', secret).update(data).digest('base64url');
    if (expected !== signature) {
        throw new Error('Invalid signature');
    }
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    return payload;
}
//# sourceMappingURL=token.util.js.map
// This is for Vercel's serverless functions
import app from '../server.js';

export default async function handler(req, res) {
    return app(req, res);
}
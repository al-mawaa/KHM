import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, message: 'Missing resume URL' });
  }

  let resumeUrl: URL;
  try {
    resumeUrl = new URL(url);
  } catch (error) {
    return res.status(400).json({ success: false, message: 'Invalid resume URL' });
  }

  if (!['http:', 'https:'].includes(resumeUrl.protocol)) {
    return res.status(400).json({ success: false, message: 'Invalid URL protocol' });
  }

  try {
    const remoteRes = await fetch(resumeUrl.toString());
    if (!remoteRes.ok) {
      return res.status(remoteRes.status).json({ success: false, message: `Failed to fetch resume: ${remoteRes.statusText}` });
    }

    const contentType = remoteRes.headers.get('content-type') || 'application/octet-stream';
    const contentLength = remoteRes.headers.get('content-length');
    const disposition = remoteRes.headers.get('content-disposition');

    const body = await remoteRes.arrayBuffer();
    const fileName = resumeUrl.pathname.split('/').pop() || 'resume';

    res.setHeader('Content-Type', contentType);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    if (disposition) {
      res.setHeader('X-Original-Content-Disposition', disposition);
    }

    return res.send(Buffer.from(body));
  } catch (error: any) {
    console.error('Resume download proxy error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to download resume' });
  }
}

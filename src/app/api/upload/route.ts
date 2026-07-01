import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

// Helper to convert buffer to stream for Google Drive API
const bufferToStream = (buffer: Buffer) => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Authenticate with Google Drive using OAuth 2.0
    const clientId = process.env.GOOGLE_DRIVE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_DRIVE_OAUTH_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_DRIVE_OAUTH_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return NextResponse.json(
        { success: false, error: "Google Drive OAuth keys are missing from .env.local" },
        { status: 500 }
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    // Prepare file for upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const media = {
      mimeType: file.type,
      body: bufferToStream(buffer),
    };

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // Upload to Drive
    const driveRes = await drive.files.create({
      requestBody: {
        name: file.name,
        parents: folderId ? [folderId] : undefined,
      },
      media: media,
      fields: "id, webViewLink, webContentLink, thumbnailLink",
    });

    const fileId = driveRes.data.id;

    if (fileId) {
      // Make file publicly accessible
      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
    }

    // Determine the best URL based on file type
    let finalUrl = driveRes.data.webViewLink || "";

    if (file.type.startsWith("image/")) {
      if (driveRes.data.thumbnailLink) {
        // Drive API returns a small thumbnail by default (e.g. =s220). We replace it with =s2000 for high quality.
        finalUrl = driveRes.data.thumbnailLink.replace(/=s\d+.*$/, "=s2000");
      } else {
        finalUrl = `https://drive.google.com/uc?id=${fileId}`;
      }
    }

    // Return the generated link
    return NextResponse.json({
      success: true,
      url: finalUrl,
      fileId: fileId,
    });
  } catch (error: any) {
    console.error("Google Drive Upload Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import type { NextApiRequest, NextApiResponse } from "next";
import GoogleService from "../GoogleService";
import formidable, { IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { Readable } from "stream";

function createResponse(res: NextApiResponse, success: boolean, message?: string) {
    res.status(200).json({ success, message });
}

function reverseString(s: string) {
    return [...s].reverse().join("");
}

async function uploadFile(googleService: GoogleService, file: formidable.File, filename: string) {
    try {
        const fileData = await fs.readFile(file.filepath);
        const ext = reverseString(reverseString(file.originalFilename ?? "").split(".", 2)[0]);
        return await googleService.uploadFile(Readable.from(fileData), `${filename}.${ext}`, file.mimetype ?? "", [
            process.env.DRIVE_FOLDER as string,
        ]);
    } catch (e) {
        console.error(e);
    }
}

function getDriveShareLink(fileID: string) {
    return `https://drive.google.com/file/d/${fileID}`;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = new IncomingForm();
    const googleService = new GoogleService();
    await googleService.authorize([
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]);

    const existingUsers = await googleService.getSheetsData("Users!A:C");

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }
        if (!files.kyc || !files.doc) {
            return createResponse(res, false, "Files missing");
        }

        const { address, name, rfc } = fields;

        for (const row of existingUsers ?? []) {
            if (row[0].toUpperCase() === `${address}`.toUpperCase()) {
                return createResponse(res, false, "Ya se encuentra registrada la wallet");
            }
            if (row[2].toUpperCase() === `${rfc}`.toUpperCase()) {
                return createResponse(res, false, "Ya se encuentra registrado el RFC");
            }
        }
        const kycFileId = await uploadFile(googleService, files.kyc as any, `${address}_kyc`);
        const docFileId = await uploadFile(googleService, files.doc as any, `${address}_doc`);
        if (!kycFileId || !docFileId) {
            return createResponse(res, false, "Error al guardar archivos");
        }

        const row = (existingUsers?.length ?? 0) + 1;
        const success = await googleService.updateCells(`Users!A${row}:E${row}`, [
            [address, name, rfc, getDriveShareLink(kycFileId), getDriveShareLink(docFileId)],
        ]);

        createResponse(res, success, success ? undefined : "Error desconocido. Reintente más tarde");
    });
}

import type { NextApiRequest, NextApiResponse } from "next";
import GoogleService from "../GoogleService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { address } = req.body;
    console.log(req.body, typeof req.body)
    const googleService = new GoogleService();
    await googleService.authorize(["https://www.googleapis.com/auth/spreadsheets.readonly"]);
    const data = await googleService.getSheetsData("Users!A:B");
    const existing = data?.find((t) => t[0].includes(address));
    const name = existing ? existing[1] : undefined;
    res.status(200).json({ is_new: existing === undefined, name: name });
}

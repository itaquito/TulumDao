import type { NextApiRequest, NextApiResponse } from "next";
import GoogleService from "../GoogleService";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { address } = req.query;
    const googleService = new GoogleService()
    await googleService.authorize(["https://www.googleapis.com/auth/spreadsheets.readonly"]);
    const data = await googleService.getSheetsData("Dashboard!A:D");
    res.status(200).json(data?.filter((t) => t[0].trim().length <= 0 || t[0].includes(address)));
}

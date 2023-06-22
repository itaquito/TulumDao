import type { NextApiRequest, NextApiResponse } from "next";
import GoogleService from "../GoogleService";
import moment from "moment";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { address } = req.body;
    console.log(req.body, typeof req.body);
    const googleService = new GoogleService();
    await googleService.authorize(["https://www.googleapis.com/auth/spreadsheets.readonly"]);
    const [users, dates] = await googleService.getSheetsBatch("Users!A:B", "Users!F:F");
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user[0].includes(address)) {
            const date = new Date(dates[i][0])
            return res.status(200).json({ is_new: false, name: user[1], user_id: i, created_at: moment(date).format("DD/MM/YYYY") });
        }
    }
    return res.status(200).json({ is_new: true });
}

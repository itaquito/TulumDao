import type { NextApiRequest, NextApiResponse } from 'next'
import GoogleService from './GoogleService'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const googleService = new GoogleService()
    await googleService.authorize(["https://www.googleapis.com/auth/spreadsheets.readonly"]);
    const data = await googleService.getSheetsData("Params!B1");
    if(!data){
        res.status(500).json({ error: "Internal server error" });
        return;
    }
    let value = data[0][0]
    if(typeof value === 'string'){
      value = value.replace(/[^0-9.%]/g, "")
      const isPercentage = value.endsWith("%")
      value = parseFloat(value)
      if(isPercentage){
        value /= 100
      }
    }
    res.status(200).json({value});
}
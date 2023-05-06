import { google } from "googleapis";

export default class GoogleService{
    auth: any;
    async authorize(scopes: string[]){
        this.auth = await google.auth.getClient({
            credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS as any),
            scopes: scopes,
        });
    }
    async getSheetsData(range: string) {
        const sheets = google.sheets({ version: "v4", auth: this.auth });
        const res = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range,
        });
        return res.data.values;
    }

    async updateCells(range:string, values: any[][]) {
        const sheets = google.sheets({ version: "v4", auth: this.auth });
        const res = await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SHEET_ID,
            range: range,
            valueInputOption: "RAW",
            requestBody: {
                values: values
            }
        });
        return res.status == 200
    }

    async uploadFile(file: any, name: string, mimeType: string, parents: string[] | undefined = undefined){
        const service = google.drive({version: 'v3', auth: this.auth});
        const requestBody: {name: string, fields: string, parents?: string[]}= {
            name: name,
            fields: 'id',
        };
        if(parents){
            requestBody['parents'] = parents
        }
        const res = await service.files.create({
            requestBody,
            media: {
                mimeType: mimeType,
                body: file
            },
        });
        return res.data.id
    }
}
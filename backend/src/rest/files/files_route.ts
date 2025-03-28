import express from "express";
import { upload } from "../../utils/filesUtils";
export const filesRouter = express.Router();

filesRouter.post('/', upload.single("file"), (req, res) => {
    const base = "http://" + process.env.DOMAIN_BASE + ":" + process.env.PORT + "/";
    console.log("filesRouter.post(/file: " + base + (req as any ).file?.path)
    res.status(200).send({ url: base + (req as any ).file?.path })
});

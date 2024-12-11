import DataURiParser from "datauri/parser.js";
import path from "path";

const getDataUrl = (file) => {
    const parser = new DataURiParser();
    const extName = path.extname(file.originalname).toString(); // Get file extension
    return parser.format(extName, file.buffer); // Convert to Data URI
};

export default getDataUrl;

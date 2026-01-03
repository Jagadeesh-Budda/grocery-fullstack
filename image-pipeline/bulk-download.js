const fs = require("fs");
const https = require("https");
const { execSync } = require("child_process");

const keywords = [
    "onion","apple","banana","tomato","potato","carrot",
    "cabbage","cauliflower","spinach","capsicum",
    "milk","bread","rice","egg","cheese","butter",
    "curd","orange","grapes","mango","watermelon",
    "chicken","fish"
];

const RAW_DIR = "./raw";
const WEBP_DIR = "./webp";

if (!fs.existsSync(RAW_DIR)) fs.mkdirSync(RAW_DIR);
if (!fs.existsSync(WEBP_DIR)) fs.mkdirSync(WEBP_DIR);

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function downloadImage(name, url, redirects = 0) {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            // Handle redirects
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                if (redirects > 5) return resolve(false);
                return resolve(downloadImage(name, res.headers.location, redirects + 1));
            }

            const type = res.headers["content-type"] || "";
            if (!type.startsWith("image/")) {
                console.log(`⚠️ Skipped ${name} (not an image: ${type})`);
                res.resume();
                return resolve(false);
            }

            const file = fs.createWriteStream(`${RAW_DIR}/${name}.jpg`);
            res.pipe(file);
            file.on("finish", () => {
                file.close();
                console.log(`✅ Downloaded ${name}`);
                resolve(true);
            });
        }).on("error", () => resolve(false));
    });
}

(async () => {
    console.log("⬇️ Downloading images...");
    for (const k of keywords) {
        await downloadImage(
            k,
            `https://source.unsplash.com/800x800/?${k},food`
        );
        await sleep(1200); // critical
    }

    console.log("🔄 Converting to WebP...");
    execSync(
        `magick mogrify -path ${WEBP_DIR} -format webp -resize 600x600 -quality 75 ${RAW_DIR}/*.jpg`
    );

    console.log("✅ DONE! Images available in /webp");
})();

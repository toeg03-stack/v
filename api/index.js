const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    try {
        // تحديد مسار ملف الكوكيز
        const cookiesPath = path.join(process.cwd(), 'cookies.json');
        const cookiesData = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));

        // إنشاء العميل باستخدام الكوكيز من الملف
        const agent = ytdl.createAgent(cookiesData); 
        
        const info = await ytdl.getInfo(url, { agent });
        
        const formats = info.formats
            .filter(f => f.hasVideo || f.hasAudio)
            .map(f => ({
                quality: f.qualityLabel || (f.hasAudio && !f.hasVideo ? 'Audio MP3' : 'N/A'),
                extension: f.container,
                url: f.url,
                size: f.contentLength ? (f.contentLength / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown'
            }));

        res.status(200).json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails.pop().url,
            formats: formats
        });
    } catch (error) {
        console.error("Error details:", error);
        res.status(500).json({ error: "فشل الجلب: " + error.message });
    }
};

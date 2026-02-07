const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    try {
        // قراءة الملف
        const cookiesPath = path.join(process.cwd(), 'cookies.json');
        const cookiesData = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));

        // إعداد العميل
        const agent = ytdl.createAgent(cookiesData); 
        
        // جلب البيانات مع استخدام الـ agent
        const info = await ytdl.getInfo(url, { agent });
        
        const formats = info.formats
            .filter(f => f.hasVideo || f.hasAudio)
            .map(f => ({
                quality: f.qualityLabel || 'MP3',
                extension: f.container,
                url: f.url
            }));

        res.status(200).json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails.pop().url,
            formats: formats
        });

    } catch (error) {
        res.status(500).json({ error: "خطأ: " + error.message });
    }
};

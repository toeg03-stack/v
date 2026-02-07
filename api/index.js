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
        try {
        const cookiesPath = path.join(process.cwd(), 'cookies.json');
        const cookiesData = JSON.parse(fs.readFileSync(cookiesPath, 'utf8'));

        // إجبار الوكيل على استخدام الكوكيز بشكل صارم
        const agent = ytdl.createAgent(cookiesData); 
        
        // جلب البيانات مع تعطيل طلبات التحقق الإضافية التي قد تسبب حظراً
        const info = await ytdl.getInfo(url, { 
            agent,
            requestOptions: {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
            }
        });
        
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

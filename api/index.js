const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const { url } = req.query;

    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    try {
        // إضافة إعدادات الطلب لتبدو وكأنها من متصفح حقيقي
        const agent = ytdl.createAgent(); 
        
        const info = await ytdl.getInfo(url, { agent });
        
        const formats = info.formats
            .filter(f => f.hasVideo || f.hasAudio)
            .map(f => ({
                quality: f.qualityLabel || (f.hasAudio ? 'Audio MP3' : 'N/A'),
                extension: f.container,
                url: f.url
            }));

        res.status(200).json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails.pop().url,
            formats: formats
        });
    } catch (error) {
        console.error(error);
        // إرسال تفاصيل الخطأ الحقيقية للمساعدة في التشخيص
        res.status(500).json({ error: "فشل الجلب: " + error.message });
    }
};

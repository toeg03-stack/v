const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
    // إعدادات CORS للسماح بالطلبات من واجهة الموقع
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "يرجى إضافة رابط الفيديو" });
    }

    try {
        const info = await ytdl.getInfo(url);
        
        // استخراج الجودات المتاحة (فيديو وصوت)
        const formats = info.formats
            .filter(f => f.hasVideo || f.hasAudio)
            .map(f => ({
                quality: f.qualityLabel || (f.hasAudio && !f.hasVideo ? 'Audio MP3' : 'Unknown'),
                extension: f.container,
                size: f.contentLength ? (f.contentLength / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown',
                url: f.url
            }));

        res.status(200).json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails.pop().url,
            duration: info.videoDetails.lengthSeconds,
            formats: formats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "تعذر جلب البيانات. تأكد من الرابط." });
    }
};

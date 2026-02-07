const ytdl = require('ytdl-core');

export default async function handler(req, res) {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'رابط غير صالح' });

    try {
        const info = await ytdl.getInfo(url);
        // تصفية الجودات (فيديو وصوت)
        const formats = info.formats.filter(f => f.hasVideo || f.hasAudio);
        
        res.status(200).json({
            title: info.videoDetails.title,
            thumbnail: info.videoDetails.thumbnails[0].url,
            formats: formats.map(f => ({
                quality: f.qualityLabel || 'Audio MP3',
                extension: f.container,
                url: f.url
            }))
        });
    } catch (e) {
        res.status(500).json({ error: 'حدث خطأ في جلب البيانات' });
    }
}

const fetch = require('node-fetch');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    // استخراج الـ ID فقط من الرابط
    const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^& \n]+)/)?.[1];

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'efa1de6729mshb28119d60dbc522p124ef9jsn1621c61e3fbd',
            'x-rapidapi-host': 'youtube-video-download-info.p.rapidapi.com'
        }
    };

    try {
        // نستخدم هذا الـ API لأنه يعطي روابط مباشرة بجودات مختلفة
        const response = await fetch(`https://youtube-video-download-info.p.rapidapi.com/dl?id=${videoId}`, options);
        const data = await response.json();

        if (data.status === "ok") {
            res.status(200).json(data);
        } else {
            res.status(400).json({ error: "الـ API لم يجد روابط لهذا الفيديو" });
        }
    } catch (error) {
        res.status(500).json({ error: "خطأ في الاتصال بالسيرفر" });
    }
};

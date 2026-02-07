module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    // استخراج ID الفيديو من الرابط
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'YOUR_FREE_API_KEY', // سجل في RapidAPI واحصل عليه مجاناً
            'x-rapidapi-host': 'youtube-video-download-info.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(`https://youtube-video-download-info.p.rapidapi.com/dl?id=${videoId}`, options);
        const data = await response.json();
        
        // إعادة إرسال البيانات لواجهتك بنفس التنسيق القديم
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "فشل الجلب عبر API خارجي" });
    }
};

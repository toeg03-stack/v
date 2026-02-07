module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { url } = req.query;

    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    // استخراج الـ ID من الرابط
    const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'ضع_هنا_مفتاحك_الخاص', // سأخبرك كيف تحصل عليه بالأسفل
            'x-rapidapi-host': 'youtube-video-download-info.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(`https://youtube-video-download-info.p.rapidapi.com/dl?id=${videoId}`, options);
        const data = await response.json();

        // هنا نقوم بتوحيد شكل البيانات ليتناسب مع موقعك
        if (data.status === "ok") {
            res.status(200).json({
                title: data.title,
                thumbnail: data.thumb,
                formats: Object.entries(data.link).map(([quality, info]) => ({
                    quality: info[3] || quality, // الجودة (مثل 720p)
                    extension: info[1],           // الصيغة (مثل mp4)
                    url: info[0]                  // رابط التحميل المباشر
                }))
            });
        } else {
            throw new Error("فشل الـ API في جلب الروابط");
        }
    } catch (error) {
        res.status(500).json({ error: "حدث خطأ: " + error.message });
    }
};

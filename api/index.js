const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // إعدادات الوصول (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "الرجاء إدخال رابط فيديو يوتيوب" });
    }

    // الرابط الذي حصلت عليه من RapidAPI
    const apiUrl = `https://youtube-info-download-api.p.rapidapi.com/ajax/api.php?function=i&u=${encodeURIComponent(url)}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'efa1de6729mshb28119d60dbc522p124ef9jsn1621c61e3fbd',
            'x-rapidapi-host': 'youtube-info-download-api.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(apiUrl, options);
        const data = await response.json();

        // إرسال البيانات النهائية لموقعك
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "فشل في جلب البيانات من السيرفر" });
    }
};

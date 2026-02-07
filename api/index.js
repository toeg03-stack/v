const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // إعدادات السماح بالاتصال (CORS) ليعمل مع واجهة موقعك
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "الرجاء إدخال رابط فيديو يوتيوب" });
    }

    // بناء رابط الطلب لـ RapidAPI
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
        
        // التحقق من حالة الاستجابة
        if (!response.ok) {
            throw new Error(`RapidAPI Error: ${response.statusText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "حدث خطأ أثناء جلب البيانات من السيرفر" });
    }
};

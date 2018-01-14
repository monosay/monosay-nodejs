exports.config = {
    apiUrl: process.env.MONOSAY_API_URL || 'https://api.monosay.com/v1/',
    token: null,
    headers: {
        "Content-Type": "application/json",
        "Authorization": null
    }
};
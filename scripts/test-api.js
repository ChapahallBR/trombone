const axios = require('axios');

const API_URL = 'https://onspace-api.onrender.com';

async function main() {
    console.log('🚀 Testing API at:', API_URL);

    try {
        // 1. Health Check
        console.log('\nChecking health...');
        const health = await axios.get(API_URL);
        console.log('✅ Health OK:', health.data);

        // 2. Create Report
        console.log('\nCreating test report...');
        const payload = {
            title: 'API Test Report',
            description: 'Created via test script to verify backend fix.',
            category: 'buraco',
            latitude: -23.5505,
            longitude: -46.6333,
            userId: 'test-user-id-123', // New user ID
            userEmail: 'test@api.com',
            userName: 'API Tester'
        };

        const response = await axios.post(`${API_URL}/api/reports`, payload);
        console.log('✅ Report Created:', response.status, response.data);

    } catch (error) {
        console.error('❌ API Error:', error.response ? error.response.data : error.message);
    }
}

main();

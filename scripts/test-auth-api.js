const axios = require('axios');

const API_URL = 'https://onspace-api.onrender.com';

async function testSignup() {
    console.log('Testing signup endpoint...');

    try {
        const response = await axios.post(`${API_URL}/api/auth/signup`, {
            email: 'debug@test.com',
            password: 'password123',
            fullName: 'Debug User',
            cpf: '12345678909'
        });

        console.log('✅ Signup successful!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('❌ Signup failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

async function testLogin() {
    console.log('\nTesting login endpoint...');

    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email: 'debug@test.com',
            password: 'password123'
        });

        console.log('✅ Login successful!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('❌ Login failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

async function testHealth() {
    console.log('Testing health endpoint...');

    try {
        const response = await axios.get(`${API_URL}/`);
        console.log('✅ API is running!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('❌ API is down!');
        console.error('Error:', error.message);
    }
}

async function runTests() {
    await testHealth();
    await testSignup();
    await testLogin();
}

runTests();

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Testing Supabase Connection...');
console.log('URL:', supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'UNDEFINED');
console.log('Key:', supabaseKey ? 'DEFINED' : 'UNDEFINED');

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase environment variables!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAuth() {
    const email = 'test_login_user@example.com';
    const password = 'password123';

    console.log(`\n👤 Attempting to sign up test user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('❌ Sign Up Error:', error.message);
        if (error.message.includes('already registered')) {
            console.log('ℹ️ User already exists. Trying to sign in...');
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                console.error('❌ Sign In Error:', signInError.message);
            } else {
                console.log('✅ Sign In Successful!');
                console.log('User ID:', signInData.user.id);
            }
        }
    } else {
        console.log('✅ Sign Up Successful!');
        console.log('User ID:', data.user?.id);
        console.log('Check your email for confirmation if enabled.');
    }
}

testAuth();

// Simple API test script
const testAPI = async () => {
    const baseURL = 'http://localhost:3001';
    
    console.log('🧪 Testing Authentication API...\n');
    
    try {
        // Test health endpoint
        console.log('1. Testing health endpoint...');
        const healthResponse = await fetch(`${baseURL}/api/health`);
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData.message);
        
        // Test registration
        console.log('\n2. Testing registration...');
        const registerResponse = await fetch(`${baseURL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'testuser' + Date.now(),
                email: `test${Date.now()}@example.com`,
                password: 'TestPass123!'
            })
        });
        
        if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            console.log('✅ Registration successful:', registerData.message);
            
            // Test login
            console.log('\n3. Testing login...');
            const loginResponse = await fetch(`${baseURL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: registerData.data.user.email,
                    password: 'TestPass123!'
                })
            });
            
            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                console.log('✅ Login successful:', loginData.message);
                
                // Test protected route
                console.log('\n4. Testing protected route...');
                const dashboardResponse = await fetch(`${baseURL}/api/protected/dashboard`, {
                    headers: { 'Authorization': `Bearer ${loginData.data.token}` }
                });
                
                if (dashboardResponse.ok) {
                    const dashboardData = await dashboardResponse.json();
                    console.log('✅ Protected route access:', dashboardData.message);
                } else {
                    console.log('❌ Protected route failed');
                }
            } else {
                console.log('❌ Login failed');
            }
        } else {
            const errorData = await registerResponse.json();
            console.log('❌ Registration failed:', errorData.message);
        }
        
        console.log('\n🎉 API test completed!');
        console.log('\n📱 Frontend URL: http://localhost:3001');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n💡 Make sure the server is running: npm start');
    }
};

testAPI();
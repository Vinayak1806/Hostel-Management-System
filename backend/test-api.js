const testSignup = async () => {
  try {
    console.log('Testing signup...');
    const response = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'testuser123@example.com',
        phone: '9876543210',
        password: 'test123',
        role: 'student',
        rollNumber: '20CS999',
        semester: '1'
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✓ Signup successful:', data);
    } else {
      console.error('✗ Signup failed:', data);
    }
  } catch (error) {
    console.error('✗ Signup error:', error.message);
  }
};

const testLogin = async () => {
  try {
    console.log('\nTesting login with seeded account...');
    
    // First, fetch the user to debug
    const userCheckResponse = await fetch('http://localhost:5000/api/auth/me', {
      headers: { 'Authorization': 'Bearer dummy' }
    });
    
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@hostel.com',
        password: 'student123'
      })
    });
    const data = await loginResponse.json();
    if (loginResponse.ok) {
      console.log('✓ Login successful:', data);
    } else {
      console.error('✗ Login failed:', data);
    }
  } catch (error) {
    console.error('✗ Login error:', error.message);
  }
};

testSignup();
setTimeout(testLogin, 1000);

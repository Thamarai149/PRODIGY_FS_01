class AuthSystem {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.user = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Tab switching
        document.getElementById('login-tab').addEventListener('click', () => this.showLoginForm());
        document.getElementById('register-tab').addEventListener('click', () => this.showRegisterForm());

        // Form submissions
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form').addEventListener('submit', (e) => this.handleRegister(e));

        // Logout
        document.getElementById('logout-btn').addEventListener('click', () => this.handleLogout());

        // Protected actions
        document.getElementById('get-profile-btn').addEventListener('click', () => this.getProfile());
        document.getElementById('get-dashboard-btn').addEventListener('click', () => this.getDashboard());
        document.getElementById('get-user-data-btn').addEventListener('click', () => this.getUserData());
        document.getElementById('get-admin-panel-btn').addEventListener('click', () => this.getAdminPanel());
    }

    showLoginForm() {
        document.getElementById('login-tab').classList.add('active');
        document.getElementById('register-tab').classList.remove('active');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('register-form').classList.add('hidden');
    }

    showRegisterForm() {
        document.getElementById('register-tab').classList.add('active');
        document.getElementById('login-tab').classList.remove('active');
        document.getElementById('register-form').classList.remove('hidden');
        document.getElementById('login-form').classList.add('hidden');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await this.apiCall('/api/auth/login', 'POST', {
                email,
                password
            });

            if (response.success) {
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('authToken', this.token);
                this.showProtectedSection();
                this.showMessage('Login successful!', 'success');
            } else {
                this.showMessage(response.message, 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            if (error.message && error.message.includes('fetch')) {
                this.showMessage('Cannot connect to server. Please make sure the server is running on port 3001.', 'error');
            } else if (error.message) {
                this.showMessage(error.message, 'error');
            } else {
                this.showMessage('Login failed. Please try again.', 'error');
            }
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('register-username').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await this.apiCall('/api/auth/register', 'POST', {
                username,
                email,
                password
            });

            if (response.success) {
                this.token = response.data.token;
                this.user = response.data.user;
                localStorage.setItem('authToken', this.token);
                this.showProtectedSection();
                this.showMessage('Registration successful!', 'success');
            } else {
                if (response.errors) {
                    const errorMessages = response.errors.map(err => err.message).join(', ');
                    this.showMessage(errorMessages, 'error');
                } else {
                    this.showMessage(response.message, 'error');
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.message && error.message.includes('fetch')) {
                this.showMessage('Cannot connect to server. Please make sure the server is running on port 3001.', 'error');
            } else if (error.errors) {
                const errorMessages = error.errors.map(err => err.message).join(', ');
                this.showMessage(errorMessages, 'error');
            } else if (error.message) {
                this.showMessage(error.message, 'error');
            } else {
                this.showMessage('Registration failed. Please try again.', 'error');
            }
        }
    }

    async handleLogout() {
        try {
            await this.apiCall('/api/auth/logout', 'POST');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.token = null;
            this.user = null;
            localStorage.removeItem('authToken');
            this.showAuthSection();
            this.showMessage('Logged out successfully!', 'success');
        }
    }

    async checkAuthStatus() {
        if (!this.token) {
            this.showAuthSection();
            return;
        }

        try {
            const response = await this.apiCall('/api/auth/verify', 'GET');
            if (response.success) {
                this.user = response.data.user;
                this.showProtectedSection();
            } else {
                this.token = null;
                localStorage.removeItem('authToken');
                this.showAuthSection();
            }
        } catch (error) {
            this.token = null;
            localStorage.removeItem('authToken');
            this.showAuthSection();
        }
    }

    showAuthSection() {
        document.getElementById('auth-section').classList.remove('hidden');
        document.getElementById('protected-section').classList.add('hidden');
        document.getElementById('user-info').classList.add('hidden');
    }

    showProtectedSection() {
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('protected-section').classList.remove('hidden');
        document.getElementById('user-info').classList.remove('hidden');
        
        if (this.user) {
            document.getElementById('welcome-message').textContent = 
                `Welcome, ${this.user.username}! (${this.user.role})`;
        }
    }

    async getProfile() {
        try {
            const response = await this.apiCall('/api/auth/profile', 'GET');
            this.displayApiResponse(response);
        } catch (error) {
            this.showMessage('Failed to get profile', 'error');
        }
    }

    async getDashboard() {
        try {
            const response = await this.apiCall('/api/protected/dashboard', 'GET');
            this.displayApiResponse(response);
        } catch (error) {
            this.showMessage('Failed to load dashboard', 'error');
        }
    }

    async getUserData() {
        try {
            const response = await this.apiCall('/api/protected/user-data', 'GET');
            this.displayApiResponse(response);
        } catch (error) {
            this.showMessage('Failed to get user data', 'error');
        }
    }

    async getAdminPanel() {
        try {
            const response = await this.apiCall('/api/protected/admin-panel', 'GET');
            this.displayApiResponse(response);
        } catch (error) {
            if (error.status === 403) {
                this.showMessage('Access denied: Admin privileges required', 'error');
            } else {
                this.showMessage('Failed to access admin panel', 'error');
            }
        }
    }

    displayApiResponse(response) {
        const responseDiv = document.getElementById('api-response');
        responseDiv.innerHTML = `<pre>${JSON.stringify(response, null, 2)}</pre>`;
    }

    async apiCall(endpoint, method, data = null) {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (this.token) {
            config.headers['Authorization'] = `Bearer ${this.token}`;
        }

        if (data) {
            config.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(endpoint, config);
            const result = await response.json();

            if (!response.ok) {
                console.error('API Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    result: result
                });
                throw { ...result, status: response.status };
            }

            return result;
        } catch (error) {
            console.error('Network Error:', error);
            throw error;
        }
    }

    showMessage(message, type) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
        messageDiv.classList.add('show');

        setTimeout(() => {
            messageDiv.classList.remove('show');
        }, 5000);
    }
}

// Initialize the authentication system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AuthSystem();
});
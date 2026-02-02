// API Configuration
const API_CONFIG = {
    // Change this to your deployed backend URL after deployment
    BASE_URL: 'http://localhost:5000/api',

    // Production URL (update after deploying backend)
    // BASE_URL: 'https://your-backend.vercel.app/api',

    ENDPOINTS: {
        // Auth
        REGISTER: '/auth/register',
        LOGIN: '/auth/login',
        ADMIN_LOGIN: '/auth/admin-login',
        ME: '/auth/me',

        // Products
        PRODUCTS: '/products',
        PRODUCT_BY_ID: (id) => `/products/${id}`,

        // Orders
        ORDERS: '/orders',
        ORDER_BY_ID: (id) => `/orders/${id}`,

        // Subscribers
        SUBSCRIBERS: '/subscribers',
        UNSUBSCRIBE: (email) => `/subscribers/${email}`
    }
};

// Helper function to get full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function to make authenticated requests
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('bd-auth-token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(getApiUrl(endpoint), {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_CONFIG, getApiUrl, apiRequest };
}

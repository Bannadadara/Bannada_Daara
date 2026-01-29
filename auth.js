/**
 * AUTHENTICATION MODULE
 * Handles User Registration, Login, and Session via localStorage
 */

const USERS_KEY = 'bd_users';
const SESSION_KEY = 'bd_curr_user';

// Core Auth Functions
const Auth = {
    getUsers: () => JSON.parse(localStorage.getItem(USERS_KEY)) || [],

    saveUser: (user) => {
        const users = Auth.getUsers();
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    findUser: (email) => {
        const users = Auth.getUsers();
        return users.find(u => u.email === email);
    },

    login: (email, password) => {
        const user = Auth.findUser(email);
        if (user && user.password === password) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    register: (name, email, password) => {
        if (Auth.findUser(email)) {
            return { success: false, message: 'User already exists' };
        }
        const newUser = {
            name,
            email,
            password,
            orders: [],
            joined: new Date().toISOString()
        };
        Auth.saveUser(newUser);
        // Auto login after register
        localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
        return { success: true, user: newUser };
    },

    logout: () => {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'index.html';
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem(SESSION_KEY));
    },

    updateUserOrders: (order) => {
        const currentUser = Auth.getCurrentUser();
        if (!currentUser) return;

        // Update in session
        currentUser.orders.push(order);
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

        // Update in persistence
        const users = Auth.getUsers();
        const index = users.findIndex(u => u.email === currentUser.email);
        if (index !== -1) {
            users[index] = currentUser;
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
    }
};

// DOM Handlers
// DOM Handlers
const initAuth = () => {
    // 1. Handle Login Form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const pass = document.getElementById('login-pass').value;
            const btn = document.getElementById('login-submit');

            btn.innerText = 'Verifying...';

            setTimeout(() => {
                const res = Auth.login(email, pass);
                if (res.success) {
                    window.location.href = 'index.html';
                } else {
                    alert(res.message);
                    btn.innerText = 'Login';
                }
            }, 800);
        });
    }

    // 2. Handle Register Form
    const regForm = document.getElementById('register-form');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const pass = document.getElementById('reg-pass').value;
            const btn = document.getElementById('reg-submit');

            btn.innerText = 'Creating Account...';

            setTimeout(() => {
                const res = Auth.register(name, email, pass);
                if (res.success) {
                    alert('Profile created successfully! Welcome to Bannada Daara.');
                    window.location.href = 'account.html?new=true';
                } else {
                    alert(res.message);
                    btn.innerText = 'CREATE PROFILE & LOGIN';
                }
            }, 800);
        });
    }

    // 3. Update UI on Main Pages (Header)
    updateHeaderUI();
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
} else {
    initAuth();
}

function updateHeaderUI() {
    const user = Auth.getCurrentUser();
    const navRight = document.querySelector('.nav-right');

    // Check if we already added the profile button to avoid duplicates
    if (document.getElementById('profile-btn-container')) return;

    if (navRight) {
        const container = document.createElement('div');
        container.id = 'profile-btn-container';

        if (user) {
            // Logged In State
            container.innerHTML = `
                <a href="account.html" class="icon-btn" style="text-decoration:none; background:none; color:white; font-weight:600; font-size:0.9rem; display:flex; gap:5px; align-items:center;">
                    <i class="fas fa-user-circle"></i> Hi, ${user.name.split(' ')[0]}
                </a>
            `;
        } else {
            // Guest State
            container.innerHTML = `
                 <a href="login.html" class="auth-link" style="color:white; text-decoration:none; font-weight:600; margin-right:15px; font-size:0.9rem;">
                    Login
                </a>
            `;
        }

        // Insert before the Bag/Cart button
        const cartBtn = document.getElementById('cart-toggle');
        if (cartBtn) {
            navRight.insertBefore(container, cartBtn);
        } else {
            navRight.appendChild(container);
        }
    }
}

// Export for use in other scripts if module, but we are using vanilla script tags mostly.
// Attaching to window for global access
window.Auth = Auth;

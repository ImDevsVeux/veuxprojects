document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const discordBtn = document.getElementById('discord-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const usernameSpan = document.getElementById('username');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    // Discord OAuth URL (now points to auth.html)
    const discordAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1206450272428236810&redirect_uri=' + 
                          encodeURIComponent(window.location.origin + '/auth.html') + 
                          '&response_type=token&scope=identify';
    
    // Check for stored token
    function checkAuthStatus() {
        const token = sessionStorage.getItem('discord_token');
        if (token) {
            fetchDiscordUser(token);
        }
        
        // Check for auth errors
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('auth_error')) {
            alert('Authentication failed. Please try again.');
            // Clean the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    // Initial auth check
    checkAuthStatus();
    
    // Discord button click handler
    discordBtn.addEventListener('click', function() {
        window.location.href = discordAuthUrl;
    });
    
    // Start button click handler
    document.querySelector('.start-btn').addEventListener('click', function() {
        alert('Starting without signing in!');
    });
    
    // Dropdown functionality
    dropdownBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('active');
        dropdownBtn.textContent = dropdownContent.classList.contains('active') 
            ? 'Hide Updates' 
            : 'Check Updates';
    });
    
    // Function to fetch Discord user data
    async function fetchDiscordUser(token) {
        try {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch user data');
            
            const user = await response.json();
            updateUserUI(user);
            
        } catch (error) {
            console.error('Error fetching user data:', error);
            sessionStorage.removeItem('discord_token');
            alert('Failed to load user data. Please sign in again.');
        }
    }
    
    // Update UI with user data
    function updateUserUI(user) {
        if (user.avatar) {
            userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        } else {
            const defaultAvatarNumber = user.discriminator % 5;
            userAvatar.src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        }
        
        usernameSpan.textContent = user.username;
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const discordBtn = document.getElementById('discord-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const usernameSpan = document.getElementById('username');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    // Discord OAuth URL
    const discordAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1206450272428236810&redirect_uri=https%3A%2F%2Fcustommovesetmakerv20.netlify.app%2Fauth&response_type=token&scope=identify';
    
    // Check for access token in URL fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');
    
    if (accessToken) {
        // User is authenticated, fetch user data
        fetchDiscordUser(accessToken);
    }
    
    // Discord button click handler
    discordBtn.addEventListener('click', function() {
        window.location.href = discordAuthUrl;
    });
    
    // Start button click handler
    document.querySelector('.start-btn').addEventListener('click', function() {
        alert('Starting without signing in!');
        // Add your functionality here
    });
    
    // Dropdown functionality
    dropdownBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('active');
        
        // Change button text based on state
        if (dropdownContent.classList.contains('active')) {
            dropdownBtn.textContent = 'Hide Updates';
        } else {
            dropdownBtn.textContent = 'Check Updates';
        }
    });
    
    // Function to fetch Discord user data
    async function fetchDiscordUser(token) {
        try {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            
            const user = await response.json();
            
            // Update UI with user data
            userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
            usernameSpan.textContent = user.username;
            
            // Hide auth buttons and show profile
            authButtons.classList.add('hidden');
            userProfile.classList.remove('hidden');
            
            // Remove token from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to load user data. Please try again.');
        }
    }
    
    // Helper function to handle URL parameters
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
});

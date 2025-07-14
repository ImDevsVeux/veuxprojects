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
    const discordAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1206450272428236810&redirect_uri=' + 
                          encodeURIComponent(window.location.origin + window.location.pathname) + 
                          '&response_type=token&scope=identify';
    
    // Check for access token in URL fragment
    function handleAuthRedirect() {
        const hash = window.location.hash.substring(1);
        if (!hash) return;
        
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            // User is authenticated, fetch user data
            fetchDiscordUser(accessToken);
            
            // Clear the hash from URL without reload
            history.replaceState(null, null, ' ');
        }
    }
    
    // Initial check for auth token
    handleAuthRedirect();
    
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
            
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            
            const user = await response.json();
            updateUserUI(user);
            
        } catch (error) {
            console.error('Error fetching user data:', error);
            alert('Failed to load user data. Please try again.');
        }
    }
    
    // Update UI with user data
    function updateUserUI(user) {
        if (user.avatar) {
            userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
        } else {
            // Default avatar if user has none
            const defaultAvatarNumber = user.discriminator % 5;
            userAvatar.src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
        }
        
        usernameSpan.textContent = user.username;
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
    }
});

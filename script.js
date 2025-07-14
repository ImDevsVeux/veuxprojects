document.addEventListener('DOMContentLoaded', function() {
    // Your Discord OAuth2 URL
    const discordOAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1206450272428236810&redirect_uri=https%3A%2F%2Fcustommovesetmakerv20.netlify.app%2Fauth&response_type=token&scope=identify';
    
    // Dropdown functionality
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    dropdownBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('active');
        dropdownBtn.textContent = dropdownContent.classList.contains('active') 
            ? 'Hide Updates' 
            : 'Check Updates';
    });
    
    // Discord login button
    const discordBtn = document.querySelector('#discord-login');
    discordBtn.addEventListener('click', function() {
        window.location.href = discordOAuthUrl;
    });
    
    // Start button (placeholder)
    const startBtn = document.querySelector('.start-btn');
    startBtn.addEventListener('click', function() {
        alert('Starting without signing in!');
        // Add your functionality here
    });
    
    // Handle OAuth callback (implicit grant flow)
    if (window.location.hash) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');
        
        if (accessToken) {
            // Fetch user data
            fetch('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            })
            .then(response => response.json())
            .then(userData => {
                if (userData.error) {
                    console.error('Error:', userData.error);
                    return;
                }
                
                // Hide buttons
                document.getElementById('buttons-container').style.display = 'none';
                
                // Show user profile
                const userProfile = document.getElementById('user-profile');
                userProfile.style.display = 'block';
                
                // Set avatar URL
                const avatarUrl = userData.avatar 
                    ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
                    : 'https://discord.com/assets/1f0bfc0865d324c2587920a7d80c609b.png'; // Default Discord avatar
                
                document.getElementById('user-pfp').src = avatarUrl;
                document.getElementById('user-username').textContent = `${userData.username}#${userData.discriminator}`;
                
                // Clear URL hash
                window.history.replaceState({}, document.title, window.location.pathname);
            })
            .catch(error => console.error('Error:', error));
        }
    }
});

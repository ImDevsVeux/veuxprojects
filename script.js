document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const discordBtn = document.getElementById('discord-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const usernameSpan = document.getElementById('username');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    // Discord OAuth URL - MUST MATCH EXACTLY what's in Discord Dev Portal
    const discordAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1206450272428236810&redirect_uri=' + 
                         encodeURIComponent('https://custommovesetmakerv20.netlify.app/auth.html') + 
                         '&response_type=token&scope=identify';
    
    // Set dropdown content
    dropdownContent.innerHTML = `
        <h3>Q - Why U Need Our Discord Account to Sign up?</h3>
        <p>= To make sure I are keep connect With Us Always..</p>
        
        <ul class="security-list">
            <li>We DO NOT IP LOG OR ANYTHING</li>
            <li>We Just Get Your Username To Keep u Connect with us</li>
        </ul>
        
        <h3>= Why We need to do it?</h3>
        <p>- So u can Get In events and Updates!</p>
        
        <div class="signup-cta">
            <p>== SO Sign Up NOW..</p>
            <p>- If u are still worried about That it's some Ip log Website so Check Out this -</p>
            <a href="#" class="safety-link">Website Safety Information</a>
        </div>
    `;
    
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
        this.textContent = dropdownContent.classList.contains('active') 
            ? 'Hide Information' 
            : 'IMPORTANT: CLICK HERE';
    });
    
    // Safety link handler
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('safety-link')) {
            e.preventDefault();
            alert('Safety information will be shown here. Replace this with your actual safety documentation link.');
            // window.open('YOUR_SAFETY_LINK_HERE', '_blank');
        }
    });
    
    // Fetch Discord user data
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
            console.error('Error:', error);
            sessionStorage.removeItem('discord_token');
            alert('Session expired. Please sign in again.');
        }
    }
    
    // Update UI with user data
    function updateUserUI(user) {
        userAvatar.src = user.avatar 
            ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
            : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
        
        usernameSpan.textContent = user.username;
        authButtons.classList.add('hidden');
        userProfile.classList.remove('hidden');
    }
});

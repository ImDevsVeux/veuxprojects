document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const discordBtn = document.getElementById('discord-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const usernameSpan = document.getElementById('username');
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    const startBtn = document.querySelector('.start-btn');
    
    // Discord OAuth URL
    const discordAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1206450272428236810&redirect_uri=' + 
                         encodeURIComponent('https://custommovesetmakerv20.netlify.app/auth.html') + 
                         '&response_type=token&scope=identify';
    
    // Check authentication status
    function checkAuthStatus() {
        const token = sessionStorage.getItem('discord_token');
        if (token) {
            fetchDiscordUser(token);
            setupLoggedInUI();
        } else {
            setupLoggedOutUI();
        }
        
        // Check for auth errors
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('auth_error')) {
            alert('Authentication failed. Please try again.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    // Setup UI for logged-in users
    function setupLoggedInUI() {
        // Change buttons
        startBtn.innerHTML = "Let's Start!";
        discordBtn.style.display = 'none';
        
        // Change dropdown
        dropdownBtn.textContent = 'Updates';
        dropdownContent.innerHTML = `
            <p>Updates: Custom Moveset Maker New Ui And Fixed All Shits Bug</p>
        `;
    }
    
    // Setup UI for logged-out users
    function setupLoggedOutUI() {
        // Reset buttons
        startBtn.innerHTML = 'Start!!<br><span class="subtext">without Sign in</span>';
        discordBtn.style.display = 'flex';
        
        // Reset dropdown
        dropdownBtn.textContent = 'IMPORTANT: CLICK HERE';
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
    }
    
    // Initial auth check
    checkAuthStatus();
    
    // Discord button click handler
    discordBtn.addEventListener('click', function() {
        window.location.href = discordAuthUrl;
    });
    
    // Start button click handler
    startBtn.addEventListener('click', function() {
        alert(sessionStorage.getItem('discord_token') 
            ? "Let's get started!" 
            : "Starting without signing in!");
    });
    
    // Dropdown functionality
    dropdownBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('active');
        if (sessionStorage.getItem('discord_token')) {
            this.textContent = dropdownContent.classList.contains('active') 
                ? 'Hide Updates' 
                : 'Updates';
        } else {
            this.textContent = dropdownContent.classList.contains('active') 
                ? 'Hide Information' 
                : 'IMPORTANT: CLICK HERE';
        }
    });
    
    // Safety link handler
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('safety-link')) {
            e.preventDefault();
            alert('Safety information will be shown here. Replace this with your actual safety documentation link.');
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
            setupLoggedOutUI();
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

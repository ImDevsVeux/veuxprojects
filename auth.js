// Extract token from URL fragment
const hash = window.location.hash.substring(1);
const params = new URLSearchParams(hash);
const accessToken = params.get('access_token');

if (accessToken) {
    // Store token in sessionStorage
    sessionStorage.setItem('discord_token', accessToken);
    
    // Redirect back to main page
    window.location.href = window.location.origin;
} else {
    // No token found, redirect with error
    window.location.href = window.location.origin + '?auth_error=true';
}

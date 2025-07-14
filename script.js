document.addEventListener('DOMContentLoaded', function() {
    // Dropdown functionality
    const dropdownBtn = document.querySelector('.dropdown-btn');
    const dropdownContent = document.querySelector('.dropdown-content');
    
    dropdownBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('active');
        
        // Change button text based on state
        if (dropdownContent.classList.contains('active')) {
            dropdownBtn.textContent = 'Hide Features';
        } else {
            dropdownBtn.textContent = 'See All The Features.. Click here';
        }
    });
    
    // Button click handlers
    const startBtn = document.querySelector('.start-btn');
    const discordBtn = document.querySelector('.discord-btn');
    
    startBtn.addEventListener('click', function() {
        alert('Starting without signing in!');
        // Add your functionality here
    });
    
    discordBtn.addEventListener('click', function() {
        alert('Redirecting to Discord authentication...');
        // Add Discord OAuth functionality here
    });
});

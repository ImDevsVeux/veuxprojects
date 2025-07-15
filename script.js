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
    const mainMenu = document.getElementById('main-menu');
    const moveNames = document.getElementById('move-names');
    const animationEditor = document.getElementById('animation-editor');
    const scriptOutput = document.getElementById('script-output');
    const moveSkipBtn = document.getElementById('move-skip-btn');
    const animationSkipBtn = document.getElementById('animation-skip-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const generatedScript = document.getElementById('generated-script');
    const generatingMessage = document.getElementById('generating-message');

    // Discord OAuth URL
    const discordAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1206450272428236810&redirect_uri=' + 
                         encodeURIComponent('https://custommovesetmakerv20.netlify.app/auth.html') + 
                         '&response_type=token&scope=identify';

    // Interface Navigation
    function showInterface(interface) {
        [mainMenu, moveNames, animationEditor, scriptOutput].forEach(el => el.classList.add('hidden'));
        interface.classList.remove('hidden');
    }

    // Check authentication status
    function checkAuthStatus() {
        const token = sessionStorage.getItem('discord_token');
        if (token) {
            fetchDiscordUser(token);
            setupLoggedInUI();
        } else {
            setupLoggedOutUI();
        }
        
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('auth_error')) {
            alert('Authentication failed. Please try again.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    // Setup UI for logged-in users
    function setupLoggedInUI() {
        startBtn.innerHTML = "Let's Start!";
        discordBtn.style.display = 'none';
        dropdownBtn.textContent = 'Updates';
        dropdownContent.innerHTML = `
            <p>Updates: Custom Moveset Maker New UI and Fixed All Bugs</p>
        `;
    }

    // Setup UI for logged-out users
    function setupLoggedOutUI() {
        startBtn.innerHTML = 'Start!!<br><span class="subtext">without Sign in</span>';
        discordBtn.style.display = 'flex';
        dropdownBtn.textContent = 'IMPORTANT: CLICK HERE';
        dropdownContent.innerHTML = `
            <h3>Q - Why Do We Need Your Discord Account to Sign Up?</h3>
            <p>= To ensure you stay connected with us!</p>
            <ul class="security-list">
                <li>We DO NOT IP LOG OR COLLECT PERSONAL DATA</li>
                <li>We only use your username to keep you updated</li>
            </ul>
            <h3>= Why is this necessary?</h3>
            <p>- To keep you informed about events and updates!</p>
            <div class="signup-cta">
                <p>== Sign Up Now!</p>
                <p>- If you're worried about safety, check this out -</p>
                <a href="#" class="safety-link">Website Safety Information</a>
            </div>
        `;
    }

    // Fetch Discord user data
    async function fetchDiscordUser(token) {
        try {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: { 'Authorization': `Bearer ${token}` }
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

    // Dropdown functionality
    dropdownBtn.addEventListener('click', function() {
        dropdownContent.classList.toggle('active');
        this.textContent = dropdownContent.classList.contains('active') 
            ? (sessionStorage.getItem('discord_token') ? 'Hide Updates' : 'Hide Information')
            : (sessionStorage.getItem('discord_token') ? 'Updates' : 'IMPORTANT: CLICK HERE');
    });

    // More options dropdowns
    document.querySelectorAll('.more-options').forEach(btn => {
        btn.addEventListener('click', function() {
            const content = this.nextElementSibling;
            content.classList.toggle('active');
            this.textContent = content.classList.contains('active') ? 'Hide Options' : 'More things..';
        });
    });

    // Start button handler
    startBtn.addEventListener('click', function() {
        showInterface(moveNames);
        updateMoveSkipButton();
    });

    // Discord button handler
    discordBtn.addEventListener('click', function() {
        window.location.href = discordAuthUrl;
    });

    // Safety link handler
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('safety-link')) {
            e.preventDefault();
            alert('Safety information will be shown here. Replace with actual safety documentation link.');
        }
    });

    // Move Names Skip/Done Button
    function updateMoveSkipButton() {
        const inputs = [move1, move2, move3, move4, ultimate].map(id => document.getElementById(id));
        const allFilled = inputs.every(input => input.value.trim() !== '');
        moveSkipBtn.textContent = allFilled ? 'Done' : 'Skip It';
    }

    [move1, move2, move3, move4, ultimate].forEach(id => {
        document.getElementById(id).addEventListener('input', updateMoveSkipButton);
    });

    moveSkipBtn.addEventListener('click', function() {
        showInterface(animationEditor);
        updateAnimationSkipButton();
    });

    // Animation Skip/Done Button
    function updateAnimationSkipButton() {
        const originalIds = document.querySelectorAll('.original-id');
        const replacementIds = document.querySelectorAll('.replacement-id');
        let allFilled = true;
        originalIds.forEach((orig, i) => {
            const rep = replacementIds[i];
            if (orig.value.trim() || rep.value.trim()) {
                if (!orig.value.trim() || !rep.value.trim()) {
                    allFilled = false;
                }
            }
        });
        animationSkipBtn.textContent = allFilled ? 'Done' : 'Skip It';
    }

    document.querySelectorAll('.original-id, .replacement-id').forEach(input => {
        input.addEventListener('input', updateAnimationSkipButton);
    });

    animationSkipBtn.addEventListener('click', function() {
        const originalIds = document.querySelectorAll('.original-id');
        const replacementIds = document.querySelectorAll('.replacement-id');
        let error = '';
        originalIds.forEach((orig, i) => {
            const rep = replacementIds[i];
            if (orig.value.trim() && !rep.value.trim()) {
                error = `You can't skip because you did not fill up the replacement animation for Animation ${i + 1}. Please fill both original and replacement IDs or leave them empty.`;
            } else if (!orig.value.trim() && rep.value.trim()) {
                error = `You can't skip because you did not fill up the original animation for Animation ${i + 1}. Please fill both original and replacement IDs or leave them empty.`;
            }
        });

        if (error) {
            alert(error);
            return;
        }

        generateScript();
    });

    // Generate Script
    function generateScript() {
        showInterface(scriptOutput);
        generatingMessage.style.display = 'block';
        generatedScript.style.display = 'none';
        copyBtn.style.display = 'none';
        downloadBtn.style.display = 'none';

        setTimeout(() => {
            let script = '';

            // Move Names Script
            const moveInputs = ['move1', 'move2', 'move3', 'move4', 'ultimate'];
            const moveValues = moveInputs.map(id => document.getElementById(id).value.trim());
            const [move1, move2, move3, move4, ultimate] = moveValues;

            if (move1 || move2 || move3 || move4 || ultimate) {
                script += `
_G.v1 = game.Players
_G.v2 = _G.v1.LocalPlayer
_G.v3 = _G.v2.PlayerGui
_G.v4 = _G.v3:FindFirstChild("Hotbar")
_G.v5 = _G.v4:FindFirstChild("Backpack")
_G.v6 = _G.v5:FindFirstChild("Hotbar")
`;
                if (move1) script += `
-- Move 1
_G.v7 = _G.v6:FindFirstChild("1").Base
_G.v8 = _G.v7.ToolName
_G.v8.Text = "${move1}"
`;
                if (move2) script += `
-- Move 2
_G.v9 = _G.v6:FindFirstChild("2").Base
_G.v10 = _G.v9.ToolName
_G.v10.Text = "${move2}"
`;
                if (move3) script += `
-- Move 3
_G.v11 = _G.v6:FindFirstChild("3").Base
_G.v12 = _G.v11.ToolName
_G.v12.Text = "${move3}"
`;
                if (move4) script += `
-- Move 4
_G.v13 = _G.v6:FindFirstChild("4").Base
_G.v14 = _G.v13.ToolName
_G.v14.Text = "${move4}"
`;
                if (ultimate) script += `
_G.v15 = game:GetService("Players")
_G.v16 = _G.v15.LocalPlayer
_G.v17 = _G.v16:WaitForChild("PlayerGui")

_G.v18 = function()
    _G.v19 = _G.v17:FindFirstChild("ScreenGui")
    if _G.v19 then
        _G.v20 = _G.v19:FindFirstChild("MagicHealth")
        if _G.v20 then
            _G.v21 = _G.v20:FindFirstChild("TextLabel")
            if _G.v21 then
                _G.v21.Text = "${ultimate}"
            end
        end
    end
end

_G.v22 = _G.v17.DescendantAdded
_G.v22:Connect(_G.v18)

_G.v18()
`;
            }

            // Animation Script
            const originalIds = document.querySelectorAll('.original-id');
            const replacementIds = document.querySelectorAll('.replacement-id');
            const speeds = document.querySelectorAll('.animation-speed');
            const startTimes = document.querySelectorAll('.start-time');

            const animations = Array.from(originalIds).map((orig, i) => ({
                original: orig.value.trim(),
                replacement: replacementIds[i].value.trim(),
                speed: speeds[i].value.trim() || '0.9',
                startTime: startTimes[i].value.trim() || '0'
            })).filter(anim => anim.original && anim.replacement);

            if (animations.length > 0) {
                animations.forEach((anim, i) => {
                    script += `
local animationId${i + 1} = ${anim.original}
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local function onAnimationPlayed${i + 1}(animationTrack)
    if animationTrack.Animation.AnimationId == "rbxassetid://${anim.original}" then
        local p = game.Players.LocalPlayer
        local Humanoid = p.Character:WaitForChild("Humanoid")
        for _, animTrack in pairs(Humanoid:GetPlayingAnimationTracks()) do
            animTrack:Stop()
        end
        local AnimAnim = Instance.new("Animation")
        AnimAnim.AnimationId = "rbxassetid://${anim.replacement}"
        local Anim = Humanoid:LoadAnimation(AnimAnim)
        local startTime = ${anim.startTime}
        Anim:Play()
        Anim:AdjustSpeed(${anim.speed})
        Anim.TimePosition = startTime
    end
end

humanoid.AnimationPlayed:Connect(onAnimationPlayed${i + 1})
`;
                });
            }

            generatingMessage.style.display = 'none';
            generatedScript.style.display = 'block';
            generatedScript.value = script.trim() || '-- No script generated. All fields were empty.';
            copyBtn.style.display = 'block';
            downloadBtn.style.display = 'block';
        }, 1000); // Simulate generation delay
    }

    // Copy Script
    copyBtn.addEventListener('click', function() {
        generatedScript.select();
        document.execCommand('copy');
        alert('Script copied to clipboard!');
    });

    // Download Script
    downloadBtn.addEventListener('click', function() {
        const blob = new Blob([generatedScript.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated_script.lua';
        a.click();
        URL.revokeObjectURL(url);
    });

    // Initial auth check
    checkAuthStatus();
});

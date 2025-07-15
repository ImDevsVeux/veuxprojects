document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const initialInterface = document.getElementById('initial-interface');
    const moveNamesInterface = document.getElementById('move-names-interface');
    const animationEditorInterface = document.getElementById('animation-editor-interface');
    const scriptGeneratorInterface = document.getElementById('script-generator-interface');
    const scriptOutput = document.getElementById('script-output');
    const generatingMessage = document.getElementById('generating-message');
    const scriptOutputContainer = document.getElementById('script-output-container');
    
    const discordBtn = document.getElementById('discord-btn');
    const authButtons = document.getElementById('auth-buttons');
    const userProfile = document.getElementById('user-profile');
    const userAvatar = document.getElementById('user-avatar');
    const usernameSpan = document.getElementById('username');
    const startBtn = document.querySelector('.start-btn');
    
    const skipMovesBtn = document.getElementById('skip-moves-btn');
    const skipAnimBtn = document.getElementById('skip-anim-btn');
    
    const copyScriptBtn = document.getElementById('copy-script');
    const downloadScriptBtn = document.getElementById('download-script');

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
        startBtn.innerHTML = "Let's Start!";
        discordBtn.style.display = 'none';
        
        // Change dropdown
        const dropdownBtn = document.querySelector('.dropdown-btn');
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownBtn.textContent = 'Updates';
        dropdownContent.innerHTML = `
            <p>Updates: Custom Moveset Maker New Ui And Fixed All Shits Bug</p>
        `;
    }
    
    // Setup UI for logged-out users
    function setupLoggedOutUI() {
        startBtn.innerHTML = 'Start!!<br><span class="subtext">without Sign in</span>';
        discordBtn.style.display = 'flex';
        
        // Reset dropdown
        const dropdownBtn = document.querySelector('.dropdown-btn');
        const dropdownContent = document.querySelector('.dropdown-content');
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
    
    // Start button click handler
    startBtn.addEventListener('click', function() {
        if (sessionStorage.getItem('discord_token')) {
            alert("Coming soon for logged-in users!");
        } else {
            initialInterface.classList.add('hidden');
            moveNamesInterface.classList.remove('hidden');
            setupMoveNamesInterface();
        }
    });
    
    // Discord button click handler
    discordBtn.addEventListener('click', function() {
        window.location.href = discordAuthUrl;
    });
    
    // Setup move names interface
    function setupMoveNamesInterface() {
        const moveInputs = document.querySelectorAll('#move-names-interface input');
        
        moveInputs.forEach(input => {
            input.addEventListener('input', function() {
                const allFilled = Array.from(moveInputs).every(input => input.value.trim() !== '');
                if (allFilled) {
                    skipMovesBtn.textContent = 'Done';
                    skipMovesBtn.style.backgroundColor = '#2ecc71';
                } else {
                    skipMovesBtn.textContent = 'Skip It';
                    skipMovesBtn.style.backgroundColor = '#f39c12';
                }
            });
        });
        
        skipMovesBtn.addEventListener('click', function() {
            const move1 = document.getElementById('move1').value;
            const move2 = document.getElementById('move2').value;
            const move3 = document.getElementById('move3').value;
            const move4 = document.getElementById('move4').value;
            const ultimate = document.getElementById('ultimate').value;
            
            if (skipMovesBtn.textContent === 'Done') {
                // All fields filled - proceed to animation editor
                moveNamesInterface.classList.add('hidden');
                animationEditorInterface.classList.remove('hidden');
                setupAnimationEditorInterface();
            } else {
                // Some fields empty - proceed with default values
                moveNamesInterface.classList.add('hidden');
                animationEditorInterface.classList.remove('hidden');
                setupAnimationEditorInterface();
            }
        });
    }
    
    // Setup animation editor interface
    function setupAnimationEditorInterface() {
        // Create all 5 animation groups
        const animationContainer = document.querySelector('.animation-inputs');
        animationContainer.innerHTML = '';
        
        for (let i = 1; i <= 5; i++) {
            const animationGroup = document.createElement('div');
            animationGroup.className = 'animation-group';
            animationGroup.innerHTML = `
                <h3>Animation ${i}</h3>
                <div class="input-group">
                    <label>Original Animation ID</label>
                    <input type="text" class="original-anim" placeholder="Enter original animation ID">
                </div>
                <div class="input-group">
                    <label>Replacement Animation ID</label>
                    <input type="text" class="replacement-anim" placeholder="Enter replacement animation ID">
                </div>
                <div class="animation-dropdown">
                    <button class="dropdown-btn small">More things..</button>
                    <div class="dropdown-content small">
                        <div class="input-group">
                            <label>Animation Speed</label>
                            <input type="number" class="anim-speed" placeholder="1.0" step="0.1" min="0.1" value="1.0">
                        </div>
                    </div>
                </div>
            `;
            animationContainer.appendChild(animationGroup);
        }
        
        // Setup dropdowns
        setupAnimationDropdowns();
        
        // Setup input validation
        setupAnimationInputValidation();
        
        // Setup skip/done button
        skipAnimBtn.textContent = 'Skip It';
        skipAnimBtn.style.backgroundColor = '#f39c12';
        
        skipAnimBtn.addEventListener('click', function() {
            if (skipAnimBtn.textContent === 'Done') {
                // All required fields filled - generate script
                animationEditorInterface.classList.add('hidden');
                generateScript();
            } else {
                // Check for partial inputs
                if (checkPartialAnimationInputs()) {
                    alert("You can't skip because you have partially filled animation fields. Please fill both original and replacement IDs or leave them both empty.");
                    return;
                }
                
                // No partial inputs - generate script with empty animations
                animationEditorInterface.classList.add('hidden');
                generateScript();
            }
        });
    }
    
    // Setup animation dropdowns
    function setupAnimationDropdowns() {
        const dropdownBtns = document.querySelectorAll('.animation-dropdown .dropdown-btn');
        
        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const content = this.nextElementSibling;
                content.classList.toggle('active');
                
                this.textContent = content.classList.contains('active') 
                    ? 'Hide options' 
                    : 'More things..';
            });
        });
    }
    
    // Setup animation input validation
    function setupAnimationInputValidation() {
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('original-anim') || e.target.classList.contains('replacement-anim')) {
                const group = e.target.closest('.animation-group');
                const original = group.querySelector('.original-anim').value;
                const replacement = group.querySelector('.replacement-anim').value;
                
                // Update group border based on validation
                if ((original && !replacement) || (!original && replacement)) {
                    group.style.border = '1px solid #e74c3c';
                } else {
                    group.style.border = '1px solid rgba(76, 175, 80, 0.2)';
                }
                
                // Update skip/done button
                const allValid = validateAnimationInputs();
                if (allValid) {
                    skipAnimBtn.textContent = 'Done';
                    skipAnimBtn.style.backgroundColor = '#2ecc71';
                } else {
                    skipAnimBtn.textContent = 'Skip It';
                    skipAnimBtn.style.backgroundColor = '#f39c12';
                }
            }
        });
    }
    
    // Validate animation inputs
    function validateAnimationInputs() {
        const animGroups = document.querySelectorAll('.animation-group');
        
        for (let group of animGroups) {
            const original = group.querySelector('.original-anim').value;
            const replacement = group.querySelector('.replacement-anim').value;
            
            if ((original && !replacement) || (!original && replacement)) {
                return false;
            }
        }
        
        return true;
    }
    
    // Check for partially filled animation inputs
    function checkPartialAnimationInputs() {
        const animGroups = document.querySelectorAll('.animation-group');
        
        for (let group of animGroups) {
            const original = group.querySelector('.original-anim').value;
            const replacement = group.querySelector('.replacement-anim').value;
            
            if ((original && !replacement) || (!original && replacement)) {
                return true;
            }
        }
        
        return false;
    }
    
    // Generate the Lua script
    function generateScript() {
        scriptGeneratorInterface.classList.remove('hidden');
        generatingMessage.classList.remove('hidden');
        scriptOutputContainer.classList.add('hidden');
        
        // Get move names
        const move1 = document.getElementById('move1').value || "Move1";
        const move2 = document.getElementById('move2').value || "Move2";
        const move3 = document.getElementById('move3').value || "Move3";
        const move4 = document.getElementById('move4').value || "Move4";
        const ultimate = document.getElementById('ultimate').value || "UltimateName";
        
        // Get animation data
        const animations = [];
        const animGroups = document.querySelectorAll('.animation-group');
        
        animGroups.forEach((group, index) => {
            const original = group.querySelector('.original-anim').value;
            const replacement = group.querySelector('.replacement-anim').value;
            const speed = group.querySelector('.anim-speed').value || "1.0";
            
            if (original && replacement) {
                animations.push({
                    index: index + 1,
                    original,
                    replacement,
                    speed
                });
            }
        });
        
        // Simulate generation delay
        setTimeout(() => {
            // Generate the Lua script
            let luaScript = `-- Generated by Custom Moveset Maker V2
-- Move Names
_G.v1 = game.Players
_G.v2 = _G.v1.LocalPlayer
_G.v3 = _G.v2.PlayerGui
_G.v4 = _G.v3:FindFirstChild("Hotbar")
_G.v5 = _G.v4:FindFirstChild("Backpack")
_G.v6 = _G.v5:FindFirstChild("Hotbar")

-- Move 1
_G.v7 = _G.v6:FindFirstChild("1").Base
_G.v8 = _G.v7.ToolName
_G.v8.Text = "${move1}"

-- Move 2
_G.v9 = _G.v6:FindFirstChild("2").Base
_G.v10 = _G.v9.ToolName
_G.v10.Text = "${move2}"

-- Move 3
_G.v11 = _G.v6:FindFirstChild("3").Base
_G.v12 = _G.v11.ToolName
_G.v12.Text = "${move3}"

-- Move 4
_G.v13 = _G.v6:FindFirstChild("4").Base
_G.v14 = _G.v13.ToolName
_G.v14.Text = "${move4}"

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

_G.v18()`;

            // Add animation replacements if any
            if (animations.length > 0) {
                luaScript += `

-- Animation Replacements
local player = game.Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local function onAnimationPlayed(animationTrack)`;

                animations.forEach(anim => {
                    luaScript += `
    if animationTrack.Animation.AnimationId == "rbxassetid://${anim.original}" then
        local p = game.Players.LocalPlayer
        local Humanoid = p.Character:WaitForChild("Humanoid")
        
        for _, animTrack in pairs(Humanoid:GetPlayingAnimationTracks()) do
            animTrack:Stop()
        end
        
        local AnimAnim = Instance.new("Animation")
        AnimAnim.AnimationId = "rbxassetid://${anim.replacement}"
        local Anim = Humanoid:LoadAnimation(AnimAnim)
        
        local startTime = 0
        Anim:Play()
        Anim:AdjustSpeed(${anim.speed})
        Anim.TimePosition = startTime
    end`;
                });

                luaScript += `
end

humanoid.AnimationPlayed:Connect(onAnimationPlayed)`;
            }

            // Show the generated script
            scriptOutput.value = luaScript;
            generatingMessage.classList.add('hidden');
            scriptOutputContainer.classList.remove('hidden');
        }, 1500);
    }
    
    // Copy script button
    copyScriptBtn.addEventListener('click', function() {
        scriptOutput.select();
        document.execCommand('copy');
        
        // Show copied feedback
        const originalText = copyScriptBtn.innerHTML;
        copyScriptBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyScriptBtn.innerHTML = originalText;
        }, 2000);
    });
    
    // Download script button
    downloadScriptBtn.addEventListener('click', function() {
        const script = scriptOutput.value;
        const blob = new Blob([script], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom_moveset_script.lua';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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

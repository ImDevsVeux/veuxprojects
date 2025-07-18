document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const initialInterface = document.getElementById('initial-interface');
    const moveNamesInterface = document.getElementById('move-names-interface');
    const animationEditorInterface = document.getElementById('animation-editor-interface');
    const vfxEditorInterface = document.getElementById('vfx-editor-interface');
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
    const skipVfxBtn = document.getElementById('skip-vfx-btn');
    
    const copyScriptBtn = document.getElementById('copy-script');
    const downloadScriptBtn = document.getElementById('download-script');
    const addAnimationBtn = document.getElementById('add-animation-btn');
    const addVfxBtn = document.getElementById('add-vfx-btn');

    // Discord OAuth URL
    const discordAuthUrl = 'https://discord.com/oauth2/authorize?client_id=1206450272428236810&redirect_uri=' + 
                         encodeURIComponent('https://custommovesetmakerv20.netlify.app/auth.html') + 
                         '&response_type=token&scope=identify';
    
    // Setup main dropdown
    function setupMainDropdown() {
        const dropdownBtn = document.querySelector('.dropdown .dropdown-btn');
        const dropdownContent = document.querySelector('.dropdown .dropdown-content');

        if (dropdownBtn && dropdownContent) {
            dropdownBtn.addEventListener('click', function() {
                dropdownContent.classList.toggle('active');
                this.textContent = dropdownContent.classList.contains('active')
                    ? 'Hide'
                    : dropdownBtn.textContent === 'IMPORTANT: CLICK HERE' ? 'IMPORTANT: CLICK HERE' : 'Updates';
            });
        }
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
        
        // Check for auth errors
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('auth_error')) {
            alert('Authentication failed. Please try again.');
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }
    
    // Setup UI for logged-in users
    function setupLoggedInUI() {
        if (startBtn) {
            startBtn.innerHTML = "Let's Start!";
            startBtn.style.display = 'flex';
        }
        if (discordBtn) {
            discordBtn.style.display = 'none';
        }
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
        
        // Change dropdown
        const dropdownBtn = document.querySelector('.dropdown-btn');
        const dropdownContent = document.querySelector('.dropdown-content');
        if (dropdownBtn && dropdownContent) {
            dropdownBtn.textContent = 'Updates';
            dropdownContent.innerHTML = `
                <p>Updates: Custom Moveset Maker New Ui And Fixed All Shits Bug</p>
            `;
        }
    }
    
    // Setup UI for logged-out users
    function setupLoggedOutUI() {
        if (startBtn) {
            startBtn.innerHTML = 'Start!!<br><span class="subtext">without Sign in</span>';
            startBtn.style.display = 'flex';
        }
        if (discordBtn) {
            discordBtn.style.display = 'flex';
        }
        if (authButtons) {
            authButtons.style.display = 'flex';
        }
        
        // Reset dropdown
        const dropdownBtn = document.querySelector('.dropdown-btn');
        const dropdownContent = document.querySelector('.dropdown-content');
        if (dropdownBtn && dropdownContent) {
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
    }
    
    // Start button click handler
    startBtn.addEventListener('click', function() {
        initialInterface.classList.add('hidden');
        moveNamesInterface.classList.remove('hidden');
        setupMoveNamesInterface();
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
            moveNamesInterface.classList.add('hidden');
            animationEditorInterface.classList.remove('hidden');
            setupAnimationEditorInterface();
        });
    }
    
    // Setup animation editor interface
    function setupAnimationEditorInterface() {
        const animationContainer = document.querySelector('.animation-inputs');
        animationContainer.innerHTML = '';
        
        // Create initial 5 animation groups
        for (let i = 1; i <= 5; i++) {
            addAnimationGroup(i);
        }
        
        // Setup dropdowns
        setupAnimationDropdowns();
        setupAnimationInputValidation();
        
        skipAnimBtn.textContent = 'Skip It';
        skipAnimBtn.style.backgroundColor = '#f39c12';
        
        addAnimationBtn.addEventListener('click', function() {
            const nextIndex = animationContainer.children.length + 1;
            addAnimationGroup(nextIndex);
            setupAnimationDropdowns();
            setupAnimationInputValidation();
        });
        
        skipAnimBtn.addEventListener('click', function() {
            if (skipAnimBtn.textContent === 'Done') {
                if (sessionStorage.getItem('discord_token')) {
                    animationEditorInterface.classList.add('hidden');
                    vfxEditorInterface.classList.remove('hidden');
                    setupVFXEditorInterface();
                } else {
                    animationEditorInterface.classList.add('hidden');
                    generateScript();
                }
            } else {
                if (checkPartialAnimationInputs()) {
                    alert("You can't skip because you have partially filled animation fields. Please fill both original and replacement IDs or leave them both empty.");
                    return;
                }
                
                if (sessionStorage.getItem('discord_token')) {
                    animationEditorInterface.classList.add('hidden');
                    vfxEditorInterface.classList.remove('hidden');
                    setupVFXEditorInterface();
                } else {
                    animationEditorInterface.classList.add('hidden');
                    generateScript();
                }
            }
        });
    }
    
    // Add animation group function
    function addAnimationGroup(index) {
        const animationContainer = document.querySelector('.animation-inputs');
        const animationGroup = document.createElement('div');
        animationGroup.className = 'animation-group';
        animationGroup.innerHTML = `
            <h3>Animation ${index}</h3>
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
    
    // Setup animation dropdowns
    function setupAnimationDropdowns() {
        const dropdownBtns = document.querySelectorAll('.animation-dropdown .dropdown-btn');
        
        dropdownBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const content = this.nextElementSibling;
                content.classList.toggle('active');
                this.textContent = content.classList.contains('active') ? 'Hide options' : 'More things..';
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
                
                if ((original && !replacement) || (!original && replacement)) {
                    group.style.border = '1px solid #e74c3c';
                } else {
                    group.style.border = '1px solid rgba(76, 175, 80, 0.2)';
                }
                
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
            if ((original && !replacement) || (!original && replacement)) return false;
        }
        return true;
    }
    
    // Check for partially filled animation inputs
    function checkPartialAnimationInputs() {
        const animGroups = document.querySelectorAll('.animation-group');
        for (let group of animGroups) {
            const original = group.querySelector('.original-anim').value;
            const replacement = group.querySelector('.replacement-anim').value;
            if ((original && !replacement) || (!original && replacement)) return true;
        }
        return false;
    }
    
    // VFX Editor Setup
    function setupVFXEditorInterface() {
        const vfxInputsContainer = document.querySelector('.vfx-inputs');
        vfxInputsContainer.innerHTML = '';
        
        // Create initial 4 VFX groups
        for (let i = 1; i <= 4; i++) {
            addVFXGroup(i);
        }
        
        skipVfxBtn.textContent = 'Skip It';
        skipVfxBtn.style.backgroundColor = '#f39c12';
        
        addVfxBtn.addEventListener('click', function() {
            const nextIndex = vfxInputsContainer.children.length + 1;
            addVFXGroup(nextIndex);
        });
        
        skipVfxBtn.addEventListener('click', function() {
            if (skipVfxBtn.textContent === 'Done') {
                vfxEditorInterface.classList.add('hidden');
                generateScript();
            } else {
                if (checkPartialVFXInputs()) {
                    alert("You can't skip because you have partially filled VFX fields. Please fill all fields or leave them all empty.");
                    return;
                }
                vfxEditorInterface.classList.add('hidden');
                generateScript();
            }
        });
    }
    
    // Add VFX group function
    function addVFXGroup(index) {
        const vfxInputsContainer = document.querySelector('.vfx-inputs');
        const vfxGroup = document.createElement('div');
        vfxGroup.className = 'vfx-group';
        vfxGroup.innerHTML = `
            <h3>VFX ${index}</h3>
            <div class="input-group">
                <label>Your VFX Path</label>
                <input type="text" class="vfx-path" placeholder="Enter VFX path">
            </div>
            <div class="input-group">
                <label>Select Move</label>
                <select class="vfx-select move-select">
                    <option value="">Select a move</option>
                    <option value="1">Move 1</option>
                    <option value="2">Move 2</option>
                    <option value="3">Move 3</option>
                    <option value="4">Move 4</option>
                </select>
            </div>
            <div class="input-group">
                <label>Destroy Time (seconds)</label>
                <input type="number" class="destroy-time" placeholder="5" step="0.1" min="0.1" value="5">
            </div>
        `;
        vfxInputsContainer.appendChild(vfxGroup);
        
        // Setup validation for new group
        setupVFXInputValidation();
    }
    
    // VFX Input Validation
    function setupVFXInputValidation() {
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('vfx-path') || 
                e.target.classList.contains('move-select') || 
                e.target.classList.contains('destroy-time')) {
                updateVFXSkipButton();
            }
        });
    }
    
    // Update VFX Skip Button
    function updateVFXSkipButton() {
        const allFilled = validateAllVFXGroups();
        if (allFilled) {
            skipVfxBtn.textContent = 'Done';
            skipVfxBtn.style.backgroundColor = '#2ecc71';
        } else {
            skipVfxBtn.textContent = 'Skip It';
            skipVfxBtn.style.backgroundColor = '#f39c12';
        }
    }
    
    // Validate All VFX Groups
    function validateAllVFXGroups() {
        const vfxGroups = document.querySelectorAll('.vfx-group');
        for (let group of vfxGroups) {
            const path = group.querySelector('.vfx-path').value;
            const move = group.querySelector('.move-select').value;
            const destroyTime = group.querySelector('.destroy-time').value;
            
            if (!path || !move || !destroyTime) return false;
        }
        return true;
    }
    
    // Check for partial VFX inputs
    function checkPartialVFXInputs() {
        const vfxGroups = document.querySelectorAll('.vfx-group');
        for (let group of vfxGroups) {
            const path = group.querySelector('.vfx-path').value;
            const move = group.querySelector('.move-select').value;
            const destroyTime = group.querySelector('.destroy-time').value;
            
            if ((path || move || destroyTime) && (!path || !move || !destroyTime)) return true;
        }
        return false;
    }
    
    // Generate the Lua script
    function generateScript() {
        scriptGeneratorInterface.classList.remove('hidden');
        generatingMessage.classList.remove('hidden');
        generatingMessage.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i> Your Script Is Getting Generated Please Wait...<br>
            <span class="signup-message">Sign Up For More Features</span>
        `;
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
        
        // Get VFX data (for logged-in users)
        const vfxData = [];
        if (sessionStorage.getItem('discord_token')) {
            const vfxGroups = document.querySelectorAll('.vfx-group');
            
            vfxGroups.forEach((group, index) => {
                const path = group.querySelector('.vfx-path').value;
                const move = group.querySelector('.move-select').value;
                const destroyTime = group.querySelector('.destroy-time').value || "5";
                
                if (path && move) {
                    vfxData.push({
                        index: index + 1,
                        path,
                        move,
                        destroyTime
                    });
                }
            });
        }
        
        // Simulate generation delay (3 seconds)
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

            // Add VFX code if any
            if (vfxData.length > 0) {
                // Get animation IDs for moves
                const moveAnimations = {};
                animGroups.forEach((group, index) => {
                    const original = group.querySelector('.original-anim').value;
                    const replacement = group.querySelector('.replacement-anim').value;
                    
                    if (original && replacement) {
                        moveAnimations[index + 1] = replacement;
                    }
                });
                
                luaScript += `

-- VFX Effects
local vfxData = {`;
                
                vfxData.forEach((vfx, idx) => {
                    const animId = moveAnimations[vfx.move] || "0";
                    luaScript += `
    {
        animId = "rbxassetid://${animId}",
        path = ${vfx.path},
        destroyTime = ${vfx.destroyTime}
    }`;
                    if (idx < vfxData.length - 1) luaScript += ',';
                });
                
                luaScript += `
}

local function setupVFX()
    local player = game.Players.LocalPlayer
    local character = player.Character or player.CharacterAdded:Wait()
    local humanoid = character:WaitForChild("Humanoid")
    
    humanoid.AnimationPlayed:Connect(function(track)
        for _, vfx in ipairs(vfxData) do
            if track.Animation.AnimationId == vfx.animId then
                local vfxInstance = vfx.path:Clone()
                vfxInstance.Parent = character:WaitForChild("HumanoidRootPart")
                
                for _, child in ipairs(vfxInstance:GetChildren()) do
                    if child:IsA("ParticleEmitter") then
                        child:Emit(15)
                        child.Enabled = true
                    end
                end
                
                task.delay(vfx.destroyTime, function()
                    if vfxInstance then
                        vfxInstance:Destroy()
                    end
                end)
            end
        end
    end)
end

setupVFX()`;
            }

            // Show the generated script
            scriptOutput.value = luaScript;
            generatingMessage.classList.add('hidden');
            scriptOutputContainer.classList.remove('hidden');
        }, 3000);
    }
    
    // Copy script button
    copyScriptBtn.addEventListener('click', function() {
        scriptOutput.select();
        document.execCommand('copy');
        
        // Show copied feedback
        const originalText = copyScriptBtn.innerHTML;
        copyScriptBtn.innerHTML = 'Copied!';
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
    
    // Update user UI
    function updateUserUI(user) {
        userProfile.classList.remove('hidden');
        userAvatar.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        usernameSpan.textContent = user.username;
    }
    
    // Initial auth check
    checkAuthStatus();
    setupMainDropdown();
});

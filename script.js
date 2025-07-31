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
    
    const completeVersionBtn = document.getElementById('complete-version-btn');
    const startBtn = document.querySelector('.start-btn');
    
    const skipMovesBtn = document.getElementById('skip-moves-btn');
    const skipAnimBtn = document.getElementById('skip-anim-btn');
    const skipVfxBtn = document.getElementById('skip-vfx-btn');
    
    const copyScriptBtn = document.getElementById('copy-script');
    const downloadScriptBtn = document.getElementById('download-script');
    const addAnimationBtn = document.getElementById('add-animation-btn');
    const addVfxBtn = document.getElementById('add-vfx-btn');

    // Setup main dropdown
    function setupMainDropdown() {
        const dropdownBtn = document.querySelector('.dropdown .dropdown-btn');
        const dropdownContent = document.querySelector('.dropdown .dropdown-content');

        if (dropdownBtn && dropdownContent) {
            dropdownBtn.addEventListener('click', function() {
                dropdownContent.classList.toggle('active');
                this.textContent = dropdownContent.classList.contains('active') ? 'Hide' : 'Updates';
            });
        }
    }

    // Start button click handler (Test Version)
    startBtn.addEventListener('click', function() {
        initialInterface.classList.add('hidden');
        moveNamesInterface.classList.remove('hidden');
        setupMoveNamesInterface();
    });
    
    // Complete Version button click handler
    completeVersionBtn.addEventListener('click', function() {
        initialInterface.classList.add('hidden');
        moveNamesInterface.classList.remove('hidden');
        setupMoveNamesInterface();
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
        
        // Setup input validation (only checks original/replacement anims)
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
            animationEditorInterface.classList.add('hidden');
            vfxEditorInterface.classList.remove('hidden');
            setupVFXEditorInterface();
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
    
    // Setup animation input validation (only checks original/replacement anims)
    function setupAnimationInputValidation() {
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('original-anim') || e.target.classList.contains('replacement-anim')) {
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
    
    // Validate animation inputs (ignores anim-speed)
    function validateAnimationInputs() {
        const animGroups = document.querySelectorAll('.animation-group');
        for (let group of animGroups) {
            const original = group.querySelector('.original-anim').value;
            const replacement = group.querySelector('.replacement-anim').value;
            
            // If one is filled but not the other → invalid
            if ((original && !replacement) || (!original && replacement)) {
                return false;
            }
        }
        return true;
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
        
        // Setup VFX input validation (checks path + move, ignores destroy-time)
        setupVFXInputValidation();
        
        skipVfxBtn.addEventListener('click', function() {
            vfxEditorInterface.classList.add('hidden');
            generateScript();
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
    }
    
    // VFX Input Validation (checks path + move, ignores destroy-time)
    function setupVFXInputValidation() {
        document.addEventListener('input', function(e) {
            if (e.target.classList.contains('vfx-path') || e.target.classList.contains('move-select')) {
                const allValid = validateAllVFXGroups();
                if (allValid) {
                    skipVfxBtn.textContent = 'Done';
                    skipVfxBtn.style.backgroundColor = '#2ecc71';
                } else {
                    skipVfxBtn.textContent = 'Skip It';
                    skipVfxBtn.style.backgroundColor = '#f39c12';
                }
            }
        });
    }
    
    // Validate All VFX Groups (ignores destroy-time)
    function validateAllVFXGroups() {
        const vfxGroups = document.querySelectorAll('.vfx-group');
        for (let group of vfxGroups) {
            const path = group.querySelector('.vfx-path').value;
            const move = group.querySelector('.move-select').value;
            
            // If one is filled but not the other → invalid
            if ((path && !move) || (!path && move)) {
                return false;
            }
        }
        return true;
    }
    
    // Generate the Lua script
    function generateScript() {
        scriptGeneratorInterface.classList.remove('hidden');
        generatingMessage.classList.remove('hidden');
        generatingMessage.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i> Your Script Is Getting Generated Please Wait...
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
        
        // Get VFX data
        const vfxData = [];
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
_G.v23 = game.Players.LocalPlayer
_G.v24 = _G.v23.Character or _G.v23.CharacterAdded:Wait()
_G.v25 = _G.v24:WaitForChild("Humanoid")

_G.v26 = function(_G.v27)
    if _G.v27.Animation.AnimationId == "rbxassetid://${animations[0].original}" then
        _G.v28 = game.Players.LocalPlayer
        _G.v29 = _G.v28.Character:WaitForChild("Humanoid")
        
        for _, _G.v30 in pairs(_G.v29:GetPlayingAnimationTracks()) do
            _G.v30:Stop()
        end
        
        _G.v31 = Instance.new("Animation")
        _G.v31.AnimationId = "rbxassetid://${animations[0].replacement}"
        _G.v32 = _G.v29:LoadAnimation(_G.v31)
        
        _G.v32:Play()
        _G.v32:AdjustSpeed(${animations[0].speed})
    end`;

                for (let i = 1; i < animations.length; i++) {
                    luaScript += `
    elseif _G.v27.Animation.AnimationId == "rbxassetid://${animations[i].original}" then
        _G.v33 = game.Players.LocalPlayer
        _G.v34 = _G.v33.Character:WaitForChild("Humanoid")
        
        for _, _G.v35 in pairs(_G.v34:GetPlayingAnimationTracks()) do
            _G.v35:Stop()
        end
        
        _G.v36 = Instance.new("Animation")
        _G.v36.AnimationId = "rbxassetid://${animations[i].replacement}"
        _G.v37 = _G.v34:LoadAnimation(_G.v36)
        
        _G.v37:Play()
        _G.v37:AdjustSpeed(${animations[i].speed})
    end`;
                }

                luaScript += `
end

_G.v25.AnimationPlayed:Connect(_G.v26)`;
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
_G.v38 = {`;
                
                vfxData.forEach((vfx, idx) => {
                    const animId = moveAnimations[vfx.move] || "0";
                    luaScript += `
    {
        _G.v39 = "rbxassetid://${animId}",
        _G.v40 = ${vfx.path},
        _G.v41 = ${vfx.destroyTime}
    }`;
                    if (idx < vfxData.length - 1) luaScript += ',';
                });
                
                luaScript += `}

_G.v42 = function()
    _G.v43 = game.Players.LocalPlayer
    _G.v44 = _G.v43.Character or _G.v43.CharacterAdded:Wait()
    _G.v45 = _G.v44:WaitForChild("Humanoid")
    
    _G.v45.AnimationPlayed:Connect(function(_G.v46)
        for _, _G.v47 in ipairs(_G.v38) do
            if _G.v46.Animation.AnimationId == _G.v47._G.v39 then
                _G.v48 = _G.v47._G.v40:Clone()
                _G.v48.Parent = _G.v44:WaitForChild("HumanoidRootPart")
                
                for _, _G.v49 in ipairs(_G.v48:GetChildren()) do
                    if _G.v49:IsA("ParticleEmitter") then
                        _G.v49:Emit(15)
                        _G.v49.Enabled = true
                    end
                end
                
                task.delay(_G.v47._G.v41, function()
                    if _G.v48 then
                        _G.v48:Destroy()
                    end
                end)
            end
        end
    end)
end

_G.v42()`;
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
    
    // Initial setup
    setupMainDropdown();
});

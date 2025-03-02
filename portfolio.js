// DOM Elements
const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Global variables for all effects
let currentEffect = null;
let animationFrameId = null;
let additionalCanvases = [];

// Show email function
function showEmail() {
    document.getElementById('email').style.display = 'block';
}

// Clean up previous effects
function cleanupEffects() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    additionalCanvases.forEach(canvas => {
        if (canvas && canvas.parentNode) {
            canvas.parentNode.removeChild(canvas);
        }
    });
    additionalCanvases = [];
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (currentEffect) {
        setBackgroundEffect(currentEffect);
    }
});

// Effect 1: Moving Lines
function drawLines() {
    let lines = [];
    const numLines = 5000;
    for (let i = 0; i < numLines; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 300 + 100,
            speed: Math.random() * 2 + 1,
            opacity: Math.random() * 0.3 + 0.1,
            colorShift: Math.random() * 0.1
        });
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        lines.forEach(line => {
            let brightness = Math.sin(Date.now() * 0.0005 + line.colorShift) * 30 + 100;
            ctx.strokeStyle = `rgba(${brightness}, ${brightness}, ${brightness}, ${line.opacity})`;
            ctx.beginPath();
            ctx.moveTo(line.x, line.y);
            ctx.lineTo(line.x + line.length, line.y + Math.sin(line.x * 0.01) * 50);
            ctx.globalAlpha = line.opacity;
            ctx.stroke();
            line.x += line.speed;
            if (line.x > canvas.width) line.x = -line.length;
        });
        animationFrameId = requestAnimationFrame(animate);
    }
    animate();
}

// Effect 2: Fast Grains
function drawFastGrains() {
    const grainCanvas = document.createElement('canvas');
    const grainCtx = grainCanvas.getContext('2d');
    grainCanvas.width = canvas.width;
    grainCanvas.height = canvas.height;
    document.body.appendChild(grainCanvas);
    additionalCanvases.push(grainCanvas);

    const numGrains = 2000;
    const grains = [];
    const centerX = grainCanvas.width / 2;
    const centerY = grainCanvas.height / 2;

    for (let i = 0; i < numGrains; i++) {
        let angle = Math.random() * Math.PI * 2;
        let radius = Math.random() * Math.min(centerX, centerY);
        grains.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            brightness: Math.random() * 255,
            speed: Math.random() * 0.5 + 0.5,
            direction: Math.random() * Math.PI * 2,
        });
    }

    function animateGrain() {
        grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);
        grains.forEach(grain => {
            let dx = grain.x - centerX;
            let dy = grain.y - centerY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let speedFactor = Math.max(0.2, 1 - distance / Math.max(centerX, centerY));

            grain.direction += (Math.random() - 0.5) * 0.02;
            grain.speed = speedFactor * (Math.random() * 0.2 + 0.2);

            grain.x += Math.cos(grain.direction) * grain.speed;
            grain.y += Math.sin(grain.direction) * grain.speed;

            grain.brightness += (Math.random() - 0.5) * 2;
            grain.brightness = Math.max(50, Math.min(200, grain.brightness));

            grainCtx.fillStyle = `rgb(${grain.brightness}, ${grain.brightness}, ${grain.brightness})`;
            grainCtx.fillRect(grain.x, grain.y, 2, 2);
        });
        requestAnimationFrame(animateGrain);
    }
    animateGrain();
}

// Effect 2: Galaxy Grain Effect
function drawGalaxyGrain() {
    const grainCanvas = document.createElement('canvas');
    const grainCtx = grainCanvas.getContext('2d');
    grainCanvas.width = canvas.width;
    grainCanvas.height = canvas.height;
    document.body.appendChild(grainCanvas);
    additionalCanvases.push(grainCanvas);
    let mouseX = grainCanvas.width / 2;
    let mouseY = grainCanvas.height / 2;
    const numGrains = 2000;
    const grains = [];
    function galaxyPosition(angle, radius) {
        return {
            x: grainCanvas.width / 2 + radius * Math.cos(angle) * (1 + 0.2 * Math.sin(3 * angle)),
            y: grainCanvas.height / 2 + radius * Math.sin(angle) * (1 + 0.2 * Math.cos(3 * angle))
        };
    }
    for (let i = 0; i < numGrains; i++) {
        let angle = Math.random() * Math.PI * 2;
        let radius = Math.sqrt(Math.random()) * Math.min(mouseX, mouseY) * 0.8;
        let pos = galaxyPosition(angle, radius);
        grains.push({
            x: pos.x,
            y: pos.y,
            brightness: Math.random() * 255,
            speed: Math.random() * 0.5 + 0.5,
            direction: angle + Math.PI / 2,
            repelFactor: Math.random() < 0.5 ? -1 : 1,
            inwardForce: 0.002 + Math.random() * 0.002,
        });
    }
    function animateGrain() {
        grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);
        for (let i = grains.length - 1; i >= 0; i--) {
            let grain = grains[i];
            let dx = grain.x - mouseX;
            let dy = grain.y - mouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let speedFactor = Math.max(0.2, 1 - distance / Math.max(mouseX, mouseY));
            let attractionAngle = Math.atan2(mouseY - grain.y, mouseX - grain.x);
            grain.direction += (Math.random() - 0.5) * 0.02;
            grain.direction = (grain.direction + attractionAngle * grain.repelFactor) / 2;
            grain.speed = speedFactor * (Math.random() * 0.2 + 0.2);
            let centerAngle = Math.atan2(grainCanvas.height / 2 - grain.y, grainCanvas.width / 2 - grain.x);
            grain.direction = (grain.direction + centerAngle * grain.inwardForce) / 2;
            grain.x += Math.cos(grain.direction) * grain.speed;
            grain.y += Math.sin(grain.direction) * grain.speed;
            grain.brightness += (Math.random() - 0.5) * 2;
            grain.brightness = Math.max(50, Math.min(200, grain.brightness));
            grainCtx.fillStyle = `rgb(${grain.brightness}, ${grain.brightness}, ${grain.brightness})`;
            grainCtx.fillRect(grain.x, grain.y, 2, 2);
        }
        requestAnimationFrame(animateGrain);
    }
    grainCanvas.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });
    animateGrain();
}

// Effect 3: Follow Grains
function drawFollowGrains() {
    const grainCanvas = document.createElement('canvas');
    const grainCtx = grainCanvas.getContext('2d');
    grainCanvas.width = canvas.width;
    grainCanvas.height = canvas.height;
    document.body.appendChild(grainCanvas);
    additionalCanvases.push(grainCanvas);  // Ensure it gets cleaned up

    grainCanvas.style.position = 'fixed';
    grainCanvas.style.top = '0';
    grainCanvas.style.left = '0';
    grainCanvas.style.width = '100%';
    grainCanvas.style.height = '100%';
    grainCanvas.style.zIndex = '0';

    const numGrains = 2000;
    const grains = [];
    let mouseX = grainCanvas.width / 2;
    let mouseY = grainCanvas.height / 2;
    let animationFrameId = null; // Track animation

    for (let i = 0; i < numGrains; i++) {
        let angle = Math.random() * Math.PI * 2;
        let radius = Math.random() * Math.min(mouseX, mouseY);
        grains.push({
            x: mouseX + Math.cos(angle) * radius,
            y: mouseY + Math.sin(angle) * radius,
            brightness: Math.random() * 255,
            speed: Math.random() * 0.5 + 0.5,
            direction: Math.random() * Math.PI * 2,
        });
    }

    function animateGrain() {
        if (!currentEffect || currentEffect !== 'followGrains') return; // Stop animation if effect changes

        grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);
        for (let i = grains.length - 1; i >= 0; i--) {
            let grain = grains[i];
            let dx = grain.x - mouseX;
            let dy = grain.y - mouseY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let speedFactor = Math.max(0.2, 1 - distance / Math.max(mouseX, mouseY));

            let attractionAngle = Math.atan2(mouseY - grain.y, mouseX - grain.x);
            grain.direction += (Math.random() - 0.5) * 0.02;
            grain.direction = (grain.direction + attractionAngle) / 2;
            grain.speed = speedFactor * (Math.random() * 0.2 + 0.2);

            let closeCount = 0;
            for (let j = 0; j < grains.length; j++) {
                if (i !== j) {
                    let other = grains[j];
                    let distX = grain.x - other.x;
                    let distY = grain.y - other.y;
                    let dist = Math.sqrt(distX * distX + distY * distY);
                    if (dist < 20) { // Repulsion effect
                        let repulsion = (20 - dist) * 0.01;
                        grain.direction += Math.atan2(distY, distX) * repulsion;
                        closeCount++;
                    }
                }
            }

            // If three grains come too close, shoot them apart
            if (closeCount >= 3) {
                grain.speed *= 5; // High speed burst
                grain.direction += Math.PI; // Opposite direction
            }

            grain.x += Math.cos(grain.direction) * grain.speed;
            grain.y += Math.sin(grain.direction) * grain.speed;

            if (grain.x < 0 || grain.x > grainCanvas.width || grain.y < 0 || grain.y > grainCanvas.height) {
                grains.splice(i, 1);
                grains.push({
                    x: mouseX + (Math.random() - 0.5) * 50,
                    y: mouseY + (Math.random() - 0.5) * 50,
                    brightness: Math.random() * 255,
                    speed: Math.random() * 0.5 + 0.5,
                    direction: Math.random() * Math.PI * 2,
                });
                continue;
            }

            grain.brightness += (Math.random() - 0.5) * 2;
            grain.brightness = Math.max(50, Math.min(200, grain.brightness));

            grainCtx.fillStyle = `rgb(${grain.brightness}, ${grain.brightness}, ${grain.brightness})`;
            grainCtx.fillRect(grain.x, grain.y, 2, 2);
        }

        animationFrameId = requestAnimationFrame(animateGrain);
    }

    grainCanvas.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    animateGrain();
}

function drawBlurGrains() {
    const grainCanvas = document.createElement('canvas');
    const grainCtx = grainCanvas.getContext('2d');
    grainCanvas.width = canvas.width;
    grainCanvas.height = canvas.height;
    document.body.appendChild(grainCanvas);
    
    grainCanvas.style.position = 'fixed';
    grainCanvas.style.top = '0';
    grainCanvas.style.left = '0';
    grainCanvas.style.width = '100%';
    grainCanvas.style.height = '100%';
    grainCanvas.style.zIndex = '0';
    grainCanvas.style.filter = 'blur(5px)'; // Initial blur

    additionalCanvases.push(grainCanvas);  // Ensure cleanup removes it

    let blurSize = 1;  
    let blurDirection = 0.5;
    let animationFrameId = null; // Track animation

    const numGrains = 3000;  // Adjust number of grains for visibility
    const grains = [];

    // Initialize grains with random positions
    for (let i = 0; i < numGrains; i++) {
        grains.push({
            x: Math.random() * grainCanvas.width,
            y: Math.random() * grainCanvas.height,
            brightness: Math.random() * 255,
            opacity: Math.random() * 0.8 + 0.2, // Ensure visibility
            dx: (Math.random() - 0.5) * 0.2,
            dy: (Math.random() - 0.5) * 0.2
        });
    }

    function animateGrain() {
        if (!currentEffect || currentEffect !== 'blurGrains') return; // Stop animation if effect changes

        grainCtx.clearRect(0, 0, grainCanvas.width, grainCanvas.height);

        for (let i = 0; i < numGrains; i++) {
            let grain = grains[i];

            // Move grains
            grain.x += grain.dx;
            grain.y += grain.dy;

            // Wrap around screen edges
            if (grain.x < 0) grain.x = grainCanvas.width;
            if (grain.x > grainCanvas.width) grain.x = 0;
            if (grain.y < 0) grain.y = grainCanvas.height;
            if (grain.y > grainCanvas.height) grain.y = 0;

            // Draw grains as small dots
            grainCtx.fillStyle = `rgba(${grain.brightness}, ${grain.brightness}, ${grain.brightness}, ${grain.opacity})`;
            grainCtx.fillRect(grain.x, grain.y, 2, 2);
        }

        // Modify blur dynamically
        blurSize += blurDirection * 0.1;
        if (blurSize > 8 || blurSize < 2) {
            blurDirection *= -1;
        }
        grainCanvas.style.filter = `blur(${blurSize}px)`;

        animationFrameId = requestAnimationFrame(animateGrain);
    }

    animateGrain();
}



// Background effects mapping
const effects = {
    'lines': drawLines,
    'galaxyGrain': drawGalaxyGrain,
    'fastGrains': drawFastGrains,
	'followGrains': drawFollowGrains,
	'blurGrains':drawBlurGrains 
};

function setBackgroundEffect(effect) {
    cleanupEffects();
    currentEffect = effect;
    if (effects[effect]) {
        effects[effect]();
    }
}

// Initialize with default effect
setBackgroundEffect('blurGrains');

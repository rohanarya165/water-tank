document.addEventListener('DOMContentLoaded', () => {
    const heightsInput = document.getElementById('heightsInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const randomBtn = document.getElementById('randomBtn');
    const waterResult = document.getElementById('waterResult');
    const waterTankVisual = document.getElementById('waterTankVisual');
    
    // Default example values
    heightsInput.value = '0,1,0,2,1,0,1,3,2,1,2,1';
    
    // Event listeners
    calculateBtn.addEventListener('click', () => {
        const heights = parseHeights(heightsInput.value);
        if (heights) {
            const waterUnits = calculateTrappedWater(heights);
            displayResults(heights, waterUnits);
        }
    });
    
    randomBtn.addEventListener('click', () => {
        const randomHeights = generateRandomHeights();
        heightsInput.value = randomHeights.join(',');
        const waterUnits = calculateTrappedWater(randomHeights);
        displayResults(randomHeights, waterUnits);
    });
    
    // Handle Enter key press in input field
    heightsInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calculateBtn.click();
        }
    });
    
    // Initialize with default values
    const initialHeights = parseHeights(heightsInput.value);
    if (initialHeights) {
        const waterUnits = calculateTrappedWater(initialHeights);
        displayResults(initialHeights, waterUnits);
    }
    
    function parseHeights(input) {
        try {
            // Improved parsing to handle more input formats
            const heights = input.split(',')
                .map(val => val.trim())
                .filter(val => val !== '') // Skip empty values
                .map(val => parseInt(val));
                
            // Check if all heights are valid numbers and greater than or equal to 0
            if (heights.some(isNaN) || heights.some(h => h < 0)) {
                alert('Please enter valid non-negative integers separated by commas.');
                return null;
            }
            
            if (heights.length < 3) {
                alert('Please enter at least 3 values to create a meaningful water trap.');
                return null;
            }
            
            return heights;
        } catch (error) {
            alert('Invalid input format. Please enter numbers separated by commas.');
            console.error(error);
            return null;
        }
    }
    
    function calculateTrappedWater(heights) {
        if (!heights || heights.length < 3) {
            return {
                total: 0,
                waterLevels: new Array(heights ? heights.length : 0).fill(0)
            };
        }
        
        const n = heights.length;
        
        // Using a more efficient single-pass approach with two pointers
        let left = 0;
        let right = n - 1;
        let leftMax = 0;
        let rightMax = 0;
        let totalWater = 0;
        let waterLevels = new Array(n).fill(0);
        
        while (left < right) {
            // Process the smaller boundary first
            if (heights[left] <= heights[right]) {
                if (heights[left] >= leftMax) {
                    // Update left max
                    leftMax = heights[left];
                } else {
                    // Calculate water at this position
                    waterLevels[left] = leftMax - heights[left];
                    totalWater += waterLevels[left];
                }
                left++;
            } else {
                if (heights[right] >= rightMax) {
                    // Update right max
                    rightMax = heights[right];
                } else {
                    // Calculate water at this position
                    waterLevels[right] = rightMax - heights[right];
                    totalWater += waterLevels[right];
                }
                right--;
            }
        }
        
        return {
            total: totalWater,
            waterLevels: waterLevels
        };
    }
    
    function displayResults(heights, waterUnits) {
        // Update the total water result with animation
        animateCounter(waterResult, waterUnits.total);
        
        // Clear previous visualization
        waterTankVisual.innerHTML = '';
        
        // Find the maximum height for scaling
        const maxHeight = Math.max(
            ...heights, 
            ...heights.map((h, i) => h + waterUnits.waterLevels[i]),
            5 // Minimum height for visualization
        );
        
        // Create visual elements
        heights.forEach((height, index) => {
            const blockDiv = document.createElement('div');
            blockDiv.className = 'block';
            
            // Add water level as a data attribute for tooltip
            const waterLevel = waterUnits.waterLevels[index];
            blockDiv.setAttribute('data-water', `Water: ${waterLevel}`);
            
            // Create empty space above blocks and water
            const emptyHeight = maxHeight - (height + waterLevel);
            for (let i = 0; i < emptyHeight; i++) {
                const emptyUnit = document.createElement('div');
                emptyUnit.className = 'unit';
                emptyUnit.style.visibility = 'hidden';
                blockDiv.appendChild(emptyUnit);
            }
            
            // Add water units with animation delay
            for (let i = 0; i < waterLevel; i++) {
                const waterUnit = document.createElement('div');
                waterUnit.className = 'unit water-unit';
                waterUnit.style.animationDelay = `${i * 0.1}s`;
                blockDiv.appendChild(waterUnit);
            }
            
            // Add block units
            for (let i = 0; i < height; i++) {
                const blockUnit = document.createElement('div');
                blockUnit.className = 'unit block-unit';
                blockDiv.appendChild(blockUnit);
            }
            
            // Add index and height labels
            const indexLabel = document.createElement('div');
            indexLabel.className = 'index-label';
            indexLabel.textContent = `${index} (h=${height})`;
            blockDiv.appendChild(indexLabel);
            
            waterTankVisual.appendChild(blockDiv);
        });
    }
    
    function animateCounter(element, target) {
        const duration = 1000;
        const start = parseInt(element.textContent) || 0;
        const range = target - start;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsedTime = currentTime - startTime;
            
            if (elapsedTime < duration) {
                const value = Math.floor(start + (range * (elapsedTime / duration)));
                element.textContent = value;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    function generateRandomHeights() {
        const length = Math.floor(Math.random() * 10) + 5; // 5 to 14 blocks
        const maxHeight = 7;
        const heights = [];
        
        for (let i = 0; i < length; i++) {
            heights.push(Math.floor(Math.random() * maxHeight));
        }
        
        // Ensure there are some higher blocks to make the example interesting
        if (Math.max(...heights) < 3) {
            // Add at least one block with height 3 or more
            const randomIndex = Math.floor(Math.random() * length);
            heights[randomIndex] = 3 + Math.floor(Math.random() * 4); // Height between 3 and 6
        }
        
        return heights;
    }
}); 
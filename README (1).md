# Water Tank Problem

## Problem Description
Given an array of non-negative integers representing heights of blocks, this application calculates and visualizes how much water can be trapped between the blocks after rainfall.

## Solution Approach
The solution uses the "Two Pointer" approach to calculate the trapped water:
1. For each position, we find the maximum height to its left and right
2. The water trapped at any position is min(leftMax, rightMax) - height[i]
3. We sum up the water trapped at each position to get the total water units

## How to Run
1. Open `index.html` in any modern web browser
2. You'll see a default visualization with some predefined heights
3. You can:
   - Enter custom heights (comma-separated integers ≥ 0)
   - Click "Calculate Water" to visualize and compute the trapped water
   - Click "Generate Random Heights" to create a random scenario

## Technologies Used
- HTML5
- CSS3
- Vanilla JavaScript (no libraries or frameworks)

## Visual Representation
- Brown blocks represent the height blocks
- Blue blocks represent the trapped water
- The total units of trapped water are displayed above the visualization

## Example
For input `[0,1,0,2,1,0,1,3,2,1,2,1]`, the trapped water is 6 units. 
// MouseButton enum-like object
export const MouseButton = {
    LeftButton: 0,
    RightButton: 2,
};

export const getMousePosition = (event) => {
    const canvas = document.getElementById('canvas1');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width; // Account for horizontal scaling
    const scaleY = canvas.height / rect.height; // Account for vertical scaling

    return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
    };
};

export function showConfigurationMenu(x, y, configOptions, onSelect, titleText = 'Configure Component') {
    // Create a custom configuration menu
    const menu = document.createElement('div');
    menu.style.position = 'absolute';
    menu.style.left = `${x}px`;
    menu.style.top = `${y + 150}px`;
    menu.style.padding = '10px';
    menu.style.backgroundColor = '#333';
    menu.style.border = '1px solid #ccc';
    menu.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    menu.style.zIndex = 1000;
    menu.style.fontFamily = 'Helvetica, Arial, sans-serif'; // Set font to Helvetica

    // Add a title
    const title = document.createElement('div');
    title.textContent = titleText;
    title.style.marginBottom = '10px';
    title.style.fontWeight = 'bold';
    title.style.color = '#fff'; // Light text color
    menu.appendChild(title);

    // Add configuration options
    configOptions.forEach(option => {
        const label = document.createElement('label');
        label.textContent = option.label;
        label.style.color = '#fff';
        label.style.display = 'block';
        label.style.marginBottom = '5px';
        menu.appendChild(label);

        const dropdown = document.createElement('select');
        dropdown.style.width = '100%';
        dropdown.style.padding = '5px';
        dropdown.style.marginBottom = '10px';
        dropdown.style.backgroundColor = '#555';
        dropdown.style.color = '#fff';
        dropdown.style.border = '1px solid #ccc';

        option.values.forEach(value => {
            const opt = document.createElement('option');
            opt.value = value.value;
            opt.textContent = value.label;
            if (value.selected) {
                opt.selected = true;
            }
            dropdown.appendChild(opt);
        });

        dropdown.addEventListener('change', () => {
            option.onChange(dropdown.value); // Call the specific onChange handler for this option
        });

        menu.appendChild(dropdown);
    });

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.backgroundColor = '#555'; // Dark button background
    closeButton.style.color = '#fff'; // Light button text
    closeButton.style.border = 'none';
    closeButton.style.padding = '5px 10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.display = 'block'; // Make it a block element
    closeButton.style.marginLeft = 'auto'; // Center horizontally
    closeButton.style.marginRight = 'auto'; // Center horizontally

    closeButton.addEventListener('mouseover', () => {
        closeButton.style.backgroundColor = '#777'; // Lighter hover background
    });
    closeButton.addEventListener('mouseout', () => {
        closeButton.style.backgroundColor = '#555'; // Reset to original background
    });

    closeButton.addEventListener('click', () => {
        document.body.removeChild(menu);
    });
    menu.appendChild(closeButton);

    // Append the menu to the body
    document.body.appendChild(menu);
}
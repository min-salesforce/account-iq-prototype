# Pinterest-Style Masonry Layout Prototype

A clean, responsive three-column masonry layout built with pure HTML, CSS, and JavaScript. Features drag-and-drop functionality for moving cards between columns and resizable cards with corner handles.

## Features

### ✨ Core Functionality
- **Three-Column Grid**: Responsive layout that adapts to screen size
- **Drag & Drop**: Move cards between columns with visual feedback
- **Resizable Cards**: Drag corner handles to resize cards
- **Masonry Layout**: Variable card heights create a Pinterest-style layout
- **Responsive Design**: Adapts to desktop (3 cols), tablet (2 cols), and mobile (1 col)

### 🎨 Visual Design
- Clean, modern interface following the UI plan specifications
- Smooth animations and transitions
- Visual feedback for drag operations (shadows, highlights, drop zones)
- Hover effects and focus states for accessibility

### 📱 Device Support
- **Desktop**: Full drag-and-drop with mouse
- **Mobile**: Touch-friendly drag-and-drop implementation
- **Keyboard**: Arrow key navigation for accessibility

## Usage

### Getting Started
1. Open `index.html` in any modern web browser
2. No build process or dependencies required!

### Interactions
- **Drag Cards**: Click and drag any card to move it between columns
- **Resize Cards**: Drag the corner handle (bottom-right) to resize cards
- **Span Snapping**: Cards snap to 1, 2, or 3 columns as you resize
- **Responsive**: Resize your browser window to see responsive behavior

### Demo Commands
Open browser console and try:
```javascript
// Add a new card to column 0
masonryLayout.addCard(0, "This is new content!");

// Remove a specific card
masonryLayout.removeCard("card-1");
```

## File Structure
```
pinterest-ui-prototype/
├── index.html          # Main HTML structure
├── styles.css          # All CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md          # This documentation
```

## Technical Implementation

### HTML Structure
- Semantic HTML5 structure
- Three column containers with data attributes
- Cards with unique IDs and drag handles

### CSS Features
- CSS Grid for responsive layout
- Flexbox for card arrangement within columns
- CSS transitions for smooth animations
- Media queries for responsive breakpoints
- Custom scrollbars and focus states

### JavaScript Functionality
- ES6 class-based architecture
- Native HTML5 Drag and Drop API
- Touch events for mobile support
- Resize functionality with mouse events and span snapping
- Keyboard navigation support

## Browser Compatibility
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## Design Specifications
Based on the UI Plan requirements:
- **Colors**: Primary (#3B82F6), Secondary (#10B981), Neutral (#6B7280)
- **Typography**: Inter font family
- **Spacing**: 16px gaps between cards and columns
- **Shadows**: Layered elevation system
- **Constraints**: Min card size 200x150px

## Performance Features
- Hardware-accelerated CSS transforms
- Efficient event delegation
- Minimal DOM manipulation
- Smooth 60fps animations

## Accessibility
- ARIA labels and roles
- Keyboard navigation with arrow keys
- Focus management during drag operations
- High contrast ratios
- Screen reader announcements

## Future Enhancements
- [ ] Undo/Redo functionality
- [ ] Card templates and content types
- [ ] Local storage persistence
- [ ] Bulk operations (multi-select)
- [ ] Advanced filtering and search
- [ ] Real-time collaboration

---

*This prototype demonstrates a clean, performant implementation without external dependencies, focusing on core functionality and user experience.*
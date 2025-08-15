// Pinterest-style Masonry Layout with Drag & Drop and Resize
class MasonryLayout {
    constructor() {
        this.draggedCard = null;
        this.draggedFrom = null;
        this.resizeData = null;
        this.init();
    }

    init() {
        this.setupDragAndDrop();
        this.setupResize();
        this.setupResponsive();
        console.log('Masonry Layout initialized');
    }

    // Drag and Drop functionality
    setupDragAndDrop() {
        const cards = document.querySelectorAll('.card');
        const columns = document.querySelectorAll('.column');

        // Add drag event listeners to cards
        cards.forEach(card => {
            card.addEventListener('dragstart', this.handleDragStart.bind(this));
            card.addEventListener('dragend', this.handleDragEnd.bind(this));
        });

        // Add drop event listeners to columns
        columns.forEach(column => {
            column.addEventListener('dragover', this.handleDragOver.bind(this));
            column.addEventListener('dragenter', this.handleDragEnter.bind(this));
            column.addEventListener('dragleave', this.handleDragLeave.bind(this));
            column.addEventListener('drop', this.handleDrop.bind(this));
        });
    }

    handleDragStart(e) {
        this.draggedCard = e.target;
        this.draggedFrom = e.target.parentElement;
        
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
        
        // Create ghost image
        const ghost = e.target.cloneNode(true);
        ghost.classList.add('card-ghost');
        ghost.style.position = 'absolute';
        ghost.style.top = '-1000px';
        document.body.appendChild(ghost);
        e.dataTransfer.setDragImage(ghost, 0, 0);
        
        setTimeout(() => document.body.removeChild(ghost), 0);
        
        console.log('Drag started:', e.target.dataset.cardId);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        
        // Remove drag-over classes from all columns
        document.querySelectorAll('.column').forEach(col => {
            col.classList.remove('drag-over');
        });
        
        this.draggedCard = null;
        this.draggedFrom = null;
        
        console.log('Drag ended');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        // Find the closest card to show drop indicator
        const afterElement = this.getDragAfterElement(e.currentTarget, e.clientY);
        const dropIndicator = this.getOrCreateDropIndicator();
        
        if (afterElement == null) {
            e.currentTarget.appendChild(dropIndicator);
        } else {
            e.currentTarget.insertBefore(dropIndicator, afterElement);
        }
        
        dropIndicator.classList.add('active');
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.currentTarget.classList.contains('column')) {
            e.currentTarget.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        if (e.currentTarget.classList.contains('column') && 
            !e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.classList.remove('drag-over');
            
            // Remove drop indicator
            const dropIndicator = e.currentTarget.querySelector('.drop-indicator');
            if (dropIndicator) {
                dropIndicator.classList.remove('active');
            }
        }
    }

    handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedCard || !e.currentTarget.classList.contains('column')) {
            return;
        }
        
        const targetColumn = e.currentTarget;
        const afterElement = this.getDragAfterElement(targetColumn, e.clientY);
        
        // Remove the card from its original position
        this.draggedCard.remove();
        
        // Insert the card in the new position
        if (afterElement == null) {
            targetColumn.appendChild(this.draggedCard);
        } else {
            targetColumn.insertBefore(this.draggedCard, afterElement);
        }
        
        // Remove drag-over class and drop indicator
        targetColumn.classList.remove('drag-over');
        const dropIndicator = targetColumn.querySelector('.drop-indicator');
        if (dropIndicator) {
            dropIndicator.remove();
        }
        
        // Add animation class
        this.draggedCard.classList.add('card-moving');
        setTimeout(() => {
            this.draggedCard.classList.remove('card-moving');
        }, 300);
        
        console.log('Card dropped in column:', targetColumn.dataset.column);
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    getOrCreateDropIndicator() {
        let indicator = document.querySelector('.drop-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'drop-indicator';
        }
        return indicator;
    }

    // Resize functionality
    setupResize() {
        const resizeHandles = document.querySelectorAll('.resize-handle');
        
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', this.handleResizeStart.bind(this));
        });
        
        document.addEventListener('mousemove', this.handleResizeMove.bind(this));
        document.addEventListener('mouseup', this.handleResizeEnd.bind(this));
    }

    handleResizeStart(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const cardId = e.target.dataset.resize;
        const card = document.querySelector(`[data-card-id="${cardId}"]`);
        
        if (!card) return;
        
        this.resizeData = {
            card: card,
            startX: e.clientX,
            startY: e.clientY,
            startWidth: card.offsetWidth,
            startHeight: card.offsetHeight
        };
        
        card.style.userSelect = 'none';
        document.body.style.cursor = 'nw-resize';
        
        console.log('Resize started for:', cardId);
    }

    handleResizeMove(e) {
        if (!this.resizeData) return;
        
        e.preventDefault();
        
        const { card, startX, startY, startWidth, startHeight } = this.resizeData;
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newWidth = Math.max(200, startWidth + deltaX);
        const newHeight = Math.max(150, startHeight + deltaY);
        
        card.style.width = newWidth + 'px';
        card.style.height = newHeight + 'px';
    }

    handleResizeEnd(e) {
        if (!this.resizeData) return;
        
        const { card } = this.resizeData;
        
        card.style.userSelect = '';
        document.body.style.cursor = '';
        
        console.log('Resize ended for:', card.dataset.cardId);
        
        this.resizeData = null;
    }

    // Responsive functionality
    setupResponsive() {
        window.addEventListener('resize', this.handleWindowResize.bind(this));
        this.handleWindowResize(); // Initial call
    }

    handleWindowResize() {
        const container = document.querySelector('.grid-container');
        const width = window.innerWidth;
        
        // Reset any fixed widths on cards for mobile
        if (width <= 768) {
            const cards = document.querySelectorAll('.card');
            cards.forEach(card => {
                card.style.width = '';
                card.style.height = '';
            });
        }
        
        console.log('Window resized, width:', width);
    }

    // Utility methods
    addCard(columnIndex, content) {
        const column = document.querySelector(`[data-column="${columnIndex}"]`);
        if (!column) return;
        
        const cardId = 'card-' + Date.now();
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.dataset.cardId = cardId;
        
        card.innerHTML = `
            <div class="card-header">
                <h3>New Card</h3>
                <div class="resize-handle" data-resize="${cardId}"></div>
            </div>
            <div class="card-content">
                <p>${content}</p>
            </div>
        `;
        
        column.appendChild(card);
        
        // Add event listeners to the new card
        card.addEventListener('dragstart', this.handleDragStart.bind(this));
        card.addEventListener('dragend', this.handleDragEnd.bind(this));
        
        // Add resize listener to the new handle
        const resizeHandle = card.querySelector('.resize-handle');
        resizeHandle.addEventListener('mousedown', this.handleResizeStart.bind(this));
        
        console.log('Added new card:', cardId);
    }

    removeCard(cardId) {
        const card = document.querySelector(`[data-card-id="${cardId}"]`);
        if (card) {
            card.remove();
            console.log('Removed card:', cardId);
        }
    }

    // Keyboard accessibility
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            const focusedCard = document.querySelector('.card:focus');
            if (!focusedCard) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    this.moveCardToColumn(focusedCard, 'left');
                    break;
                case 'ArrowRight':
                    this.moveCardToColumn(focusedCard, 'right');
                    break;
                case 'ArrowUp':
                    this.moveCardInColumn(focusedCard, 'up');
                    break;
                case 'ArrowDown':
                    this.moveCardInColumn(focusedCard, 'down');
                    break;
            }
        });
    }

    moveCardToColumn(card, direction) {
        const currentColumn = card.parentElement;
        const currentColumnIndex = parseInt(currentColumn.dataset.column);
        let targetColumnIndex;
        
        if (direction === 'left') {
            targetColumnIndex = Math.max(0, currentColumnIndex - 1);
        } else {
            targetColumnIndex = Math.min(2, currentColumnIndex + 1);
        }
        
        if (targetColumnIndex !== currentColumnIndex) {
            const targetColumn = document.querySelector(`[data-column="${targetColumnIndex}"]`);
            targetColumn.appendChild(card);
            card.focus();
        }
    }

    moveCardInColumn(card, direction) {
        const column = card.parentElement;
        const cards = [...column.querySelectorAll('.card')];
        const currentIndex = cards.indexOf(card);
        
        if (direction === 'up' && currentIndex > 0) {
            column.insertBefore(card, cards[currentIndex - 1]);
        } else if (direction === 'down' && currentIndex < cards.length - 1) {
            column.insertBefore(cards[currentIndex + 1], card);
        }
        
        card.focus();
    }
}

// Initialize the layout when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.masonryLayout = new MasonryLayout();
    
    // Add some demo functionality
    console.log('Demo commands available:');
    console.log('- masonryLayout.addCard(0, "New content") - Add a card to column 0');
    console.log('- masonryLayout.removeCard("card-1") - Remove a specific card');
});

// Add touch support for mobile devices
if ('ontouchstart' in window) {
    // Touch event handling for mobile drag and drop
    let touchData = null;
    
    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('.card')) {
            const card = e.target.closest('.card');
            const touch = e.touches[0];
            
            touchData = {
                card: card,
                startX: touch.clientX,
                startY: touch.clientY,
                offsetX: touch.clientX - card.getBoundingClientRect().left,
                offsetY: touch.clientY - card.getBoundingClientRect().top
            };
            
            card.classList.add('dragging');
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!touchData) return;
        
        e.preventDefault();
        const touch = e.touches[0];
        const { card, offsetX, offsetY } = touchData;
        
        card.style.position = 'fixed';
        card.style.left = (touch.clientX - offsetX) + 'px';
        card.style.top = (touch.clientY - offsetY) + 'px';
        card.style.zIndex = '1000';
    });
    
    document.addEventListener('touchend', (e) => {
        if (!touchData) return;
        
        const { card } = touchData;
        const touch = e.changedTouches[0];
        
        // Find the column under the touch point
        const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetColumn = elementBelow?.closest('.column');
        
        if (targetColumn && targetColumn !== card.parentElement) {
            targetColumn.appendChild(card);
        }
        
        // Reset card styles
        card.style.position = '';
        card.style.left = '';
        card.style.top = '';
        card.style.zIndex = '';
        card.classList.remove('dragging');
        
        touchData = null;
    });
}

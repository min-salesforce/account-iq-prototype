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
        this.setupCardSpanning();
        this.setupChat();
        this.setupLayoutVars();
        this.setupRTE();
        this.setupTabDragAndDrop();
        this.setupCardHeaderActions();
        console.log('Masonry Layout initialized');
    }

    setupCardHeaderActions() {
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => this.ensureCardHeaderActions(card));
    }

    ensureCardHeaderActions(cardEl) {
        const header = cardEl.querySelector('.card-header');
        if (!header) return;

        let controls = header.querySelector('.card-controls');
        const resize = header.querySelector('.resize-handle');

        // Create controls wrapper if missing
        if (!controls) {
            controls = document.createElement('div');
            controls.className = 'card-controls';
            if (resize) {
                header.replaceChild(controls, resize);
                controls.appendChild(resize);
            } else {
                header.appendChild(controls);
            }
        }

        // Insert actions if missing
        if (!controls.querySelector('.card-actions')) {
            const actions = document.createElement('div');
            actions.className = 'card-actions';
            actions.innerHTML = `
                <button class="card-action-btn" aria-label="Edit" title="Edit">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.19138 7.70797L4.24427 9.76153C4.33654 9.85383 4.47493 9.85383 4.5672 9.76153L9.68789 4.6161C9.78016 4.5238 9.78016 4.38536 9.68789 4.29307L7.65807 2.26258C7.5658 2.17029 7.42741 2.17029 7.33514 2.26258L2.19138 7.40802C2.09912 7.50031 2.09912 7.63875 2.19138 7.70797ZM8.32693 1.31662C8.23466 1.40891 8.23466 1.54735 8.32693 1.63965L10.3568 3.67013C10.449 3.76243 10.5874 3.76243 10.6797 3.67013L11.2563 3.09329C11.6254 2.74719 11.6254 2.19342 11.2563 1.82424L10.1722 0.739775C9.80316 0.370596 9.22651 0.370596 8.85745 0.739775L8.32693 1.31662ZM0.484503 11.1229C0.438371 11.3537 0.645966 11.5613 0.876628 11.5152L3.39084 10.9153C3.48311 10.8922 3.55231 10.8461 3.59844 10.7999L3.64457 10.7538C3.6907 10.7076 3.71377 10.5461 3.6215 10.4538L1.54555 8.37718C1.45328 8.28488 1.29182 8.30795 1.24569 8.3541L1.19955 8.40025C1.13036 8.46947 1.10729 8.53869 1.08422 8.60791L0.484503 11.1229Z" fill="#747474"/></svg>
                </button>
                <button class="card-action-btn" aria-label="Regenerate" title="Regenerate">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.26929 3.94626H6.78468C6.64621 3.94626 6.53083 4.06164 6.53083 4.20011V5.4001C6.53083 5.56164 6.43852 5.63087 6.32314 5.51549C6.27698 5.44626 6.23083 5.40011 6.1616 5.35395C5.33083 4.50011 4.17698 4.13087 3.00006 4.38472C2.58468 4.47703 2.19237 4.63857 1.84621 4.89241C0.853906 5.58472 0.276983 6.69241 0.253906 7.89241C0.253906 8.81549 0.576983 9.73857 1.20006 10.4309C1.84621 11.1463 2.74621 11.5386 3.69237 11.5386C4.63852 11.5386 5.33083 11.2386 5.95391 10.6847C6.06929 10.5693 6.06929 10.4078 5.95391 10.3155L5.60775 9.94626C5.51544 9.85395 5.37698 9.83087 5.28468 9.94626C4.68468 10.454 3.87698 10.6616 3.06929 10.454C2.8616 10.4078 2.63083 10.2924 2.44621 10.177C1.50006 9.57703 1.0616 8.44626 1.33852 7.31549C1.38468 7.08472 1.47698 6.87703 1.59237 6.66934C2.05391 5.83857 2.8616 5.35395 3.71544 5.35395C4.56929 5.35395 5.00775 5.63087 5.46929 6.11549C5.5616 6.18472 5.60775 6.27703 5.67698 6.34626C5.72314 6.48472 5.60775 6.55395 5.46929 6.55395H4.31544C4.17698 6.55395 4.0616 6.66934 4.0616 6.8078V7.33857C4.0616 7.47703 4.15391 7.56934 4.29237 7.56934H7.31544C7.43083 7.56934 7.52314 7.45395 7.52314 7.33857V4.20011C7.52314 4.06164 7.38468 3.94626 7.26929 3.94626Z" fill="#747474"/><path d="M11.6539 2.35395L10.8462 1.93857C10.6154 1.82318 10.4078 1.61549 10.2924 1.36164L9.90006 0.530874C9.85391 0.41549 9.66929 0.41549 9.62314 0.530874L9.23083 1.36164C9.11544 1.61549 8.90775 1.8001 8.67698 1.93857L7.86929 2.35395C7.75391 2.42318 7.75391 2.58472 7.86929 2.63087L8.67698 3.04626C8.90775 3.16164 9.11544 3.36934 9.23083 3.62318L9.62314 4.45395C9.66929 4.56934 9.85391 4.56934 9.90006 4.45395L10.2924 3.62318C10.4078 3.36934 10.6154 3.18472 10.8462 3.04626L11.6539 2.63087C11.7693 2.56164 11.7693 2.4001 11.6539 2.35395Z" fill="#747474"/>
                </button>`;

            // Insert actions before resize-handle if present, else append to controls
            if (resize && resize.parentElement === controls) {
                controls.insertBefore(actions, resize);
            } else {
                controls.appendChild(actions);
            }
        }
    }

    // Tabs drag-and-drop reordering (header)
    setupTabDragAndDrop() {
        const tabbar = document.querySelector('.tabbar');
        if (!tabbar) return;

        const tabs = [...tabbar.querySelectorAll('.tab')];
        tabs.forEach(tab => {
            tab.setAttribute('draggable', 'true');
            tab.addEventListener('dragstart', (e) => {
                this.draggedTab = tab;
                tab.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                // minimal drag image
                const ghost = document.createElement('div');
                ghost.style.position = 'absolute';
                ghost.style.top = '-1000px';
                ghost.textContent = tab.textContent;
                ghost.style.padding = '4px 8px';
                ghost.style.background = '#fff';
                document.body.appendChild(ghost);
                e.dataTransfer.setDragImage(ghost, 0, 0);
                setTimeout(() => document.body.removeChild(ghost), 0);
            });
            tab.addEventListener('dragend', () => {
                tab.classList.remove('dragging');
                this.draggedTab = null;
            });
        });

        tabbar.addEventListener('dragover', (e) => {
            if (!this.draggedTab) return;
            e.preventDefault();
            const after = this.getTabAfterElement(tabbar, e.clientX);
            if (after == null) {
                tabbar.appendChild(this.draggedTab);
            } else {
                tabbar.insertBefore(this.draggedTab, after);
            }
        });
    }

    getTabAfterElement(container, x) {
        const candidates = [...container.querySelectorAll('.tab:not(.dragging)')];
        return candidates.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = x - box.left - box.width / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
    }

    // Simple RTE handlers
    setupRTE() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.rte-btn');
            if (!btn) return;
            const cmd = btn.dataset.cmd;
            if (!cmd) return;
            document.execCommand(cmd, false, null);
        });
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
        
        // Re-apply spacers for current span in the new column
        const currentSpan = parseInt(this.draggedCard.dataset.span || '1');
        const clampedSpan = this.clampSpanToAvailableColumns(this.draggedCard, currentSpan);
        this.applyCardSpan(this.draggedCard, clampedSpan);
        
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
        
        const desiredWidth = Math.max(200, startWidth + deltaX);
        const newHeight = Math.max(150, startHeight + deltaY);

        const { span } = this.computeSpanSnap(card, desiredWidth);
        const clampedSpan = this.clampSpanToAvailableColumns(card, span);
        const snappedWidth = this.computeWidthForSpan(card, clampedSpan);

        // Anchor to left/top to avoid drift, and set exact snapped size
        card.style.position = 'relative';
        card.style.left = '0px';
        card.style.top = '0px';
        card.style.width = snappedWidth + 'px';
        card.style.height = newHeight + 'px';
        this.applyCardSpan(card, clampedSpan);
    }

    handleResizeEnd(e) {
        if (!this.resizeData) return;
        
        const { card } = this.resizeData;
        
        card.style.userSelect = '';
        document.body.style.cursor = '';

        // Finalize snap to exact span width
        const currentSpan = parseInt(card.dataset.span || '1');
        const clampedSpan = this.clampSpanToAvailableColumns(card, currentSpan);
        const snappedWidth = this.computeWidthForSpan(card, clampedSpan);
        card.style.width = snappedWidth + 'px';
        this.applyCardSpan(card, clampedSpan);
        
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

    // ---- Spanning helpers ----
    computeSpanSnap(card, desiredWidthPx) {
        const { columnWidth, gap } = this.getGridMetrics();
        const twoColThreshold = columnWidth + gap + columnWidth * 0.5;
        const threeColThreshold = columnWidth * 2 + gap * 2 + columnWidth * 0.5;
        let span = 1;
        if (desiredWidthPx > threeColThreshold) span = 3;
        else if (desiredWidthPx > twoColThreshold) span = 2;
        return { span };
    }

    clampSpanToAvailableColumns(card, span) {
        const currentColumnIndex = parseInt(card.parentElement.dataset.column);
        const { gridColumns } = this.getGridMetrics();
        const maxSpanRight = Math.max(1, gridColumns - currentColumnIndex);
        return Math.max(1, Math.min(span, maxSpanRight));
    }

    computeWidthForSpan(card, span) {
        const { columnWidth, gap } = this.getGridMetrics();
        return columnWidth * span + gap * (span - 1);
    }

    getGridMetrics() {
        const grid = document.querySelector('.grid-container');
        const columns = [...document.querySelectorAll('.grid-container .column')];
        const gridStyle = getComputedStyle(grid);
        const gap = parseFloat(gridStyle.gap) || 0;
        const gridColumns = columns.length;
        // Prefer computed width from grid container
        const gridWidth = grid.getBoundingClientRect().width;
        const columnWidth = gridColumns > 0 ? (gridWidth - gap * (gridColumns - 1)) / gridColumns : (columns[0] ? columns[0].getBoundingClientRect().width : 0);
        return { gap, gridColumns, columnWidth };
    }

    applyCardSpan(card, span) {
        card.dataset.span = String(span);
        card.classList.remove('card-span-1', 'card-span-2', 'card-span-3');
        if (span > 1) card.classList.add(`card-span-${span}`);
        this.updateSpacersForCard(card, span);
    }

    updateSpacersForCard(card, span) {
        const cardId = card.dataset.cardId;
        // Remove existing spacers for this card
        document.querySelectorAll(`.spacer[data-spacer-for="${cardId}"]`).forEach(el => el.remove());
        if (span <= 1) return;

        const sourceColumnIndex = parseInt(card.parentElement.dataset.column);
        const cardRect = card.getBoundingClientRect();
        const cardTop = cardRect.top + window.scrollY;
        const cardHeight = cardRect.height;

        for (let offset = 1; offset < span; offset++) {
            const targetIndex = sourceColumnIndex + offset;
            const targetColumn = document.querySelector(`.column[data-column="${targetIndex}"]`);
            if (!targetColumn) continue;

            const spacer = document.createElement('div');
            spacer.className = 'spacer';
            spacer.setAttribute('data-spacer-for', cardId);
            spacer.style.height = `${cardHeight}px`;

            // Insert spacer before the first child whose top >= cardTop
            let inserted = false;
            const children = [...targetColumn.children].filter(el => !el.classList.contains('column-header'));
            for (const child of children) {
                const rect = child.getBoundingClientRect();
                const childTop = rect.top + window.scrollY;
                if (childTop >= cardTop) {
                    targetColumn.insertBefore(spacer, child);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) targetColumn.appendChild(spacer);
        }
    }

    // Layout variables for header / right panel
    setupLayoutVars() {
        const header = document.getElementById('mainHeader');
        const root = document.documentElement;
        const updateVars = () => {
            const headerHeight = header ? header.offsetHeight : 72;
            root.style.setProperty('--header-height', headerHeight + 'px');
            // Right panel width is fixed in CSS; mirror to margin reservation
            const rightPanelWidth = 380;
            root.style.setProperty('--right-panel-width', rightPanelWidth + 'px');
        };
        updateVars();
        window.addEventListener('resize', updateVars);
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

    // Card spanning functionality
    setupCardSpanning() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('span-btn')) {
                this.handleSpanChange(e);
            }
        });
    }

    handleSpanChange(e) {
        const requestedSpan = parseInt(e.target.dataset.span);
        const card = e.target.closest('.card');
        const cardId = card.dataset.cardId;
        
        const clampedSpan = this.clampSpanToAvailableColumns(card, requestedSpan);
        const snappedWidth = this.computeWidthForSpan(card, clampedSpan);
        card.style.width = snappedWidth + 'px';
        this.applyCardSpan(card, clampedSpan);
        
        // Update button states
        const spanButtons = card.querySelectorAll('.span-btn');
        spanButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.span) === clampedSpan) {
                btn.classList.add('active');
            }
        });
        
        console.log(`Card ${cardId} span changed to ${clampedSpan} columns`);
    }

    // Chat functionality
    setupChat() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');
        const chatMessages = document.getElementById('chatMessages');
        const chatToggle = document.getElementById('chatToggle');
        const chatPanel = document.getElementById('chatPanel');
        
        if (!chatInput || !sendButton || !chatMessages) return;
        
        // Send message functionality
        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (!message) return;
            
            this.addUserMessage(message);
            chatInput.value = '';
            this.autoResizeTextarea(chatInput);
            
            // Simulate AI response
            setTimeout(() => {
                this.addAIResponse(message);
            }, 1000 + Math.random() * 1000);
        };
        
        sendButton.addEventListener('click', sendMessage);
        
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Auto-resize textarea
        chatInput.addEventListener('input', () => {
            this.autoResizeTextarea(chatInput);
        });
        
        // Chat toggle functionality
        if (chatToggle) {
            chatToggle.addEventListener('click', () => {
                chatPanel.classList.toggle('collapsed');
            });
        }
    }
    
    addUserMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">👤</div>
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    addAIResponse(userMessage) {
        const chatMessages = document.getElementById('chatMessages');
        const response = this.generateAIResponse(userMessage);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                ${response}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    generateAIResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        // Check for card creation requests
        if (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new card')) {
            const content = this.extractCardContent(userMessage);
            this.createNewCard(content);
            return `<p>I've created a new card for you with the content: "${content}"</p>`;
        }
        
        // Check for layout help
        if (lowerMessage.includes('layout') || lowerMessage.includes('organize') || lowerMessage.includes('arrange')) {
            return `<p>I can help you organize your layout! Try these tips:</p>
                    <ul>
                        <li>Drag cards between columns to reorganize</li>
                        <li>Use the span buttons (1, 2, 3) to make cards wider</li>
                        <li>Resize cards by dragging the corner handle</li>
                        <li>Cards automatically adjust to fit the grid</li>
                    </ul>`;
        }
        
        // Check for spanning help
        if (lowerMessage.includes('span') || lowerMessage.includes('wide') || lowerMessage.includes('column')) {
            return `<p>To make cards span multiple columns:</p>
                    <ul>
                        <li>Hover over a card to see the span controls (1, 2, 3)</li>
                        <li>Click "2" to span 2 columns</li>
                        <li>Click "3" to span all 3 columns</li>
                        <li>On mobile, all cards become single column</li>
                    </ul>`;
        }
        
        // Default responses
        const responses = [
            `<p>That's interesting! How can I help you with your card layout?</p>`,
            `<p>I can help you create new cards, organize your layout, or answer questions about the interface. What would you like to do?</p>`,
            `<p>Would you like me to create a new card with that content? Just let me know!</p>`,
            `<p>I'm here to help with your Pinterest-style layout. Try asking me to create a card or help organize your content.</p>`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    extractCardContent(message) {
        // Simple content extraction - in a real app, this would be more sophisticated
        const words = message.split(' ');
        const contentStart = words.findIndex(word => 
            ['about', 'with', 'containing', 'saying'].includes(word.toLowerCase())
        );
        
        if (contentStart !== -1 && contentStart < words.length - 1) {
            return words.slice(contentStart + 1).join(' ');
        }
        
        return message.replace(/create|add|new|card/gi, '').trim() || 'New card content';
    }
    
    createNewCard(content) {
        const columns = document.querySelectorAll('.column');
        const targetColumn = this.findShortestColumn(columns);
        
        const cardId = 'card-' + Date.now();
        const card = document.createElement('div');
        card.className = 'card';
        card.draggable = true;
        card.dataset.cardId = cardId;
        
        card.innerHTML = `
            <div class="card-header">
                <h3>AI Generated Card</h3>
                <div class="card-controls">
                    <div class="span-controls">
                        <button class="span-btn active" data-span="1" title="Single column">1</button>
                        <button class="span-btn" data-span="2" title="Span 2 columns">2</button>
                        <button class="span-btn" data-span="3" title="Span 3 columns">3</button>
                    </div>
                    <div class="resize-handle" data-resize="${cardId}"></div>
                </div>
            </div>
            <div class="card-content">
                <p>${this.escapeHtml(content)}</p>
            </div>
        `;
        
        targetColumn.appendChild(card);
        
        // Add event listeners to the new card
        card.addEventListener('dragstart', this.handleDragStart.bind(this));
        card.addEventListener('dragend', this.handleDragEnd.bind(this));
        
        // Add resize listener to the new handle
        const resizeHandle = card.querySelector('.resize-handle');
        resizeHandle.addEventListener('mousedown', this.handleResizeStart.bind(this));

        // Ensure header actions present on new cards
        this.ensureCardHeaderActions(card);
        
        // Animate in
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
        
        console.log('Created new card:', cardId);
    }
    
    findShortestColumn(columns) {
        let shortestColumn = columns[0];
        let shortestHeight = shortestColumn.offsetHeight;
        
        columns.forEach(column => {
            if (column.offsetHeight < shortestHeight) {
                shortestHeight = column.offsetHeight;
                shortestColumn = column;
            }
        });
        
        return shortestColumn;
    }
    
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

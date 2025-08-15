# Screen Content Configuration

Edit this file to control the content shown in the prototype. All sections map to visible UI elements. After edits, we’ll wire the app to load from here.

## Header
- **cloud_logo**: true
- **app_section_title**: Sales
- **search_placeholder**: Search
- **tabs**: [Home, Opportunities, Accounts, Leads, Contacts, * Meeting Brief for Acme Corp]
- **active_tab**: * Meeting Brief for Acme Corp

## Cards

### Column 0
- **card-1.title**: Sample Card 1
- **card-1.content**: This is a sample card with some content. You can drag it to other columns or resize it using the handle in the corner.
- **card-1.image**: 
- **card-1.span**: 1

- **card-2.title**: Wide Image Card (Spans 2 Columns)
- **card-2.content**: This card spans across 2 columns, demonstrating the multi-column spanning feature.
- **card-2.image**: https://picsum.photos/600/200?random=1
- **card-2.span**: 2

- **card-3.title**: Short Card
- **card-3.content**: Brief content.
- **card-3.image**: 
- **card-3.span**: 1

### Column 1
- **card-4.title**: Tall Card
- **card-4.content**: |
    This is a taller card with more content to demonstrate the masonry layout effect. The content can vary in height and the layout will adjust accordingly.
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
- **card-4.image**: 
- **card-4.span**: 1

- **card-5.title**: Scratch Pad
- **card-5.type**: rte
- **card-5.content**: |
    Start typing...
- **card-5.image**: 
- **card-5.span**: 1

### Column 2
- **card-6.title**: List Card
- **card-6.content**: |
    - Feature 1
    - Feature 2
    - Feature 3
    - Feature 4
- **card-6.image**: 
- **card-6.span**: 1

- **card-7.title**: Quote Card
- **card-7.content**: |
    "The best way to predict the future is to create it."
    
    - Peter Drucker
- **card-7.image**: 
- **card-7.span**: 1

- **card-8.title**: Another Card
- **card-8.content**: More sample content to fill out the layout.
- **card-8.image**: 
- **card-8.span**: 1

## Chat Panel (Agentforce)
- **header**: Agentforce
- **welcome**: |
    Hello! I'm your AI assistant. I can help you with:
    
    - Creating new cards
    - Organizing your layout
    - Suggesting content
    - Answering questions
    
    What would you like to do?



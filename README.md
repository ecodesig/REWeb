# Synapteca - Luxury Real Estate Website

A modern, AI-powered luxury real estate website built for Synapteca, showcasing premium properties in Sydney, Australia. This project features cutting-edge design with glassmorphism effects, integrated AI chat and voice assistants, and comprehensive property search functionality.

## 🏗️ Project Overview

**Company**: Synapteca  
**Location**: Sydney, Australia  
**Focus**: Luxury real estate with AI-powered concierge services  
**Contact**: synapteca@gmail.com  

## ✨ Features

### Currently Implemented

#### 🎨 Design & UX
- **Ultra-luxury aesthetics** with glassmorphism effects
- **Premium color palette**: Charcoal (#111318), Off-white (#F7F7F5), Gold (#C4A062), Deep Navy (#0E1A2A)
- **Typography**: Playfair Display (serif headers) + Inter (sans-serif body)
- **Responsive design** for all devices
- **Smooth animations** and micro-interactions
- **Sticky transparent header** that becomes solid on scroll

#### 🏠 Property Showcase
- **Hero section** with luxury property video background
- **Featured listings carousel** with property cards
- **Neighborhood showcase** (Double Bay, Mosman, Vaucluse, Point Piper, Rose Bay)
- **Client testimonials** with star ratings
- **8 mock luxury properties** with detailed information

#### 🔍 Advanced Search & Filters
- **Quick search bar** with real-time results
- **Advanced filters**: price range, property type, bedrooms, bathrooms, neighborhoods, square footage
- **Amenities filtering**: harbor views, pools, tennis courts, wine cellars, etc.
- **Multiple view modes**: grid, list, and map view
- **Search results sorting** by price, date, bedrooms, size
- **Pagination** with page numbers

#### 🤖 AI-Powered Features
- **AI Chat Concierge**:
  - Contextual responses based on current page
  - Lead intent extraction and localStorage persistence
  - Quick prompt buttons for common queries
  - Property-specific recommendations
  - Mock API integration (ready for real LLM)
  
- **AI Voice Agent**:
  - Web Speech API integration
  - Australian English speech recognition
  - Text-to-speech with premium voice selection
  - Visual feedback (listening indicators, transcription)
  - Graceful fallback for unsupported browsers

#### 🏡 Property Details
- **Interactive image gallery** with lightbox
- **Property facts grid** (price, beds, baths, size, year built, etc.)
- **Features & amenities showcase**
- **Neighborhood information** with highlights
- **Interactive map** with property location (Leaflet.js)
- **Mortgage calculator** with real-time calculations
- **Agent contact information**
- **Similar properties** recommendations

#### 📱 Interactive Components
- **Favorites system** with localStorage persistence
- **Property sharing** with native Web Share API
- **Tour scheduling** through AI chat integration
- **Compare properties** functionality (placeholder)
- **Viewing history** tracking

### 📄 Pages Implemented

1. **Home (index.html)**
   - Hero section with AI assistant cards
   - Featured properties
   - Neighborhood showcase
   - Client testimonials
   - CTA sections

2. **Listings (listings.html)**
   - Advanced search and filtering
   - Grid/list/map view modes
   - Pagination
   - Results sorting

3. **Property Details (listing-details.html)**
   - Comprehensive property information
   - Image gallery with lightbox
   - Mortgage calculator
   - Location map
   - Agent contact
   - Similar properties

4. **About (about.html)**
   - Company story and mission
   - Team profiles
   - Awards and recognition
   - Statistics and achievements

## 🛠️ Technical Architecture

### Frontend Stack
- **HTML5** with semantic structure
- **CSS3** with custom properties and modern features
- **Vanilla JavaScript** (ES6+) with modular architecture
- **Leaflet.js** for interactive maps
- **Font Awesome** for icons
- **Google Fonts** (Playfair Display + Inter)

### Key JavaScript Modules
- `main.js` - Core functionality and utilities
- `ai-chat.js` - AI chat concierge system
- `voice-agent.js` - Voice recognition and synthesis
- `listings.js` - Property search and filtering
- `listing-details.js` - Property detail page functionality
- `data.js` - Mock data and utility functions

### CSS Architecture
- `style.css` - Base styles and components
- `components.css` - Interactive UI components
- `listings-style.css` - Listings and property detail styles
- `responsive.css` - Mobile-first responsive design

### Data Management
- **Mock property data** for 8 luxury Sydney properties
- **Neighborhood information** for 5 prestigious areas
- **LocalStorage** for user preferences and favorites
- **Structured data** (JSON-LD) for SEO

## 🎯 AI Assistant Capabilities

### Chat Concierge
The AI chat system can handle:
- **Property inquiries**: Price ranges, features, neighborhoods
- **Scheduling**: Tour bookings and appointments
- **Market information**: Investment advice, pricing trends
- **Mortgage calculations**: Payment estimates and scenarios
- **Neighborhood details**: Local amenities and lifestyle information

### Voice Agent
- **Speech recognition** with Australian English support
- **Natural language processing** for property queries
- **Text-to-speech** responses with premium voice quality
- **Visual feedback** during voice interactions
- **Seamless integration** with chat system

## 🏘️ Property Data

### Featured Neighborhoods
1. **Point Piper** - Sydney's most prestigious waterfront address
2. **Double Bay** - Luxury shopping and harbor-side living
3. **Mosman** - Family-friendly harbor suburb with beaches
4. **Vaucluse** - Exclusive clifftop mansions with panoramic views
5. **Rose Bay** - Luxury waterfront with private jetty access

### Property Portfolio
- **8 luxury properties** ranging from $12.9M to $35M
- **Diverse property types**: Houses, penthouses, estates
- **Premium features**: Harbor views, pools, wine cellars, private jetties
- **Detailed information**: High-resolution images, floor plans, neighborhood data

## 🚀 Getting Started

### Prerequisites
- Modern web browser with JavaScript enabled
- Web server (for local development)

### Installation
1. Clone or download the project files
2. Serve the files using a local web server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (http-server)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open your browser and navigate to `http://localhost:8000`

### File Structure
```
├── index.html              # Home page
├── listings.html           # Property search and listings
├── listing-details.html    # Individual property details
├── about.html             # Company information
├── contact.html           # Contact page (to be created)
├── services.html          # Services page (to be created)
├── css/
│   ├── style.css          # Main styles
│   ├── components.css     # UI components
│   ├── listings-style.css # Listings specific styles
│   └── responsive.css     # Mobile responsive styles
├── js/
│   ├── main.js           # Core functionality
│   ├── ai-chat.js        # AI chat system
│   ├── voice-agent.js    # Voice interaction
│   ├── listings.js       # Property search
│   ├── listing-details.js # Property details
│   └── data.js           # Mock data and utilities
├── images/               # Image assets (to be added)
└── README.md            # This file
```

## 🔮 Future Enhancements

### Backend Integration Ready
The frontend is architected to easily integrate with:
- **Real LLM APIs** (OpenAI, Claude, etc.)
- **Property databases** and MLS systems
- **CRM systems** for lead management
- **Email and SMS** notification services
- **Payment processing** for premium services

### Placeholder Implementations
Several features have placeholder implementations ready for backend:
- **3D Virtual Tours** (Matterport integration)
- **Floor Plans** viewer
- **Property brochure** downloads
- **Advanced mortgage** pre-approval
- **Real-time chat** with human agents
- **Property comparison** tools
- **Market analytics** and reporting

### Enhancement Opportunities
1. **Advanced AI Features**:
   - Property recommendation engine
   - Market trend analysis
   - Automated property valuation
   - Investment opportunity scoring

2. **User Experience**:
   - User accounts and saved searches
   - Property alerts and notifications
   - Virtual tour integration
   - Mobile app companion

3. **Marketing Tools**:
   - Social media integration
   - Email marketing automation
   - Lead scoring and nurturing
   - Analytics and reporting

## 🎨 Design System

### Color Palette
- **Primary**: Charcoal (#111318)
- **Secondary**: Off-white (#F7F7F5)
- **Accent**: Gold (#C4A062)
- **Dark**: Deep Navy (#0E1A2A)

### Typography
- **Headers**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Weights**: 300, 400, 500, 600, 700

### Components
- **Glassmorphism effects** for premium feel
- **Smooth transitions** (0.3s cubic-bezier)
- **Subtle shadows** and depth layers
- **Consistent border radius** (12px)

## 🔧 Browser Support

- **Chrome/Edge**: Full support including voice features
- **Safari**: Full support with voice features
- **Firefox**: Chat support, limited voice features
- **Mobile browsers**: Responsive design with progressive enhancement

## 📱 Mobile Experience

- **Mobile-first design** approach
- **Touch-friendly** interactions
- **Optimized performance** for mobile networks
- **Progressive enhancement** for advanced features
- **Native sharing** integration where supported

## 🚀 Deployment

The website is ready for deployment to any static hosting platform:
- **Netlify**
- **Vercel** 
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Traditional web hosting**

## 🤝 Contributing

This is a client project for Synapteca. For questions or modifications, please contact the development team.

## 📄 License

This project is proprietary and confidential. All rights reserved by Synapteca.

---

**Built with ❤️ for Synapteca - Pioneering AI-Powered Luxury Real Estate in Sydney**
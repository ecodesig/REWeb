// Main JavaScript functionality for Synapteca
class SynaptecaMain {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.initializeComponents();
        this.loadFeaturedListings();
        this.setupScrollEffects();
    }

    bindEvents() {
        // Header scroll effect
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // Mobile navigation
        const navToggle = document.getElementById('navToggle');
        const nav = document.getElementById('nav');
        
        if (navToggle && nav) {
            navToggle.addEventListener('click', () => {
                nav.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }
        
        // Smooth scrolling for anchor links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });

        // Favorite buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.favorite-btn')) {
                this.toggleFavorite(e.target.closest('.favorite-btn'));
            }
        });

        // Property card click handler
        document.addEventListener('click', (e) => {
            const propertyCard = e.target.closest('.listing-card');
            if (propertyCard && !e.target.closest('.favorite-btn') && !e.target.closest('.btn')) {
                const propertyId = propertyCard.dataset.propertyId;
                if (propertyId) {
                    window.location.href = `listing-details.html?id=${propertyId}`;
                }
            }
        });

        // Neighborhood card clicks
        document.addEventListener('click', (e) => {
            const neighborhoodCard = e.target.closest('.neighborhood-card');
            if (neighborhoodCard) {
                const neighborhood = neighborhoodCard.dataset.neighborhood;
                if (neighborhood) {
                    window.location.href = `listings.html?neighborhood=${neighborhood}`;
                }
            }
        });
    }

    handleScroll() {
        const header = document.getElementById('header');
        const scrollY = window.scrollY;
        
        if (header) {
            if (scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    initializeComponents() {
        // Initialize animations on scroll
        this.observeElements();
        
        // Initialize testimonials slider
        this.initTestimonialsSlider();
        
        // Load user preferences
        this.loadUserPreferences();
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const elementsToObserve = document.querySelectorAll(
            '.listing-card, .neighborhood-card, .testimonial-card, .section-header'
        );
        
        elementsToObserve.forEach(el => observer.observe(el));
    }

    initTestimonialsSlider() {
        const slider = document.getElementById('testimonialsSlider');
        if (!slider) return;
        
        // Auto-rotate testimonials every 6 seconds
        const testimonials = slider.children;
        let currentIndex = 0;
        
        setInterval(() => {
            // Remove active class from all testimonials
            Array.from(testimonials).forEach((testimonial, index) => {
                testimonial.style.opacity = index === currentIndex ? '1' : '0.7';
                testimonial.style.transform = index === currentIndex ? 'scale(1)' : 'scale(0.95)';
            });
            
            currentIndex = (currentIndex + 1) % testimonials.length;
        }, 6000);
    }

    loadFeaturedListings() {
        const listingsContainer = document.getElementById('featuredListings');
        if (!listingsContainer) return;
        
        const featuredProperties = getFeaturedProperties(6);
        
        listingsContainer.innerHTML = featuredProperties.map(property => 
            this.createListingCard(property)
        ).join('');
        
        // Add staggered animation
        const cards = listingsContainer.querySelectorAll('.listing-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('slide-in-left');
            }, index * 150);
        });
    }

    createListingCard(property) {
        const isFavorited = this.isFavorited(property.id);
        
        return `
            <div class="listing-card" data-property-id="${property.id}">
                <div class="listing-image">
                    <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
                    ${property.newToMarket ? '<div class="listing-badge">New to Market</div>' : ''}
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-property-id="${property.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="listing-content">
                    <div class="listing-price">${property.priceDisplay}</div>
                    <div class="listing-address">${property.address}</div>
                    <div class="listing-details">
                        <div class="listing-detail">
                            <i class="fas fa-bed"></i>
                            <span>${property.bedrooms} beds</span>
                        </div>
                        <div class="listing-detail">
                            <i class="fas fa-bath"></i>
                            <span>${property.bathrooms} baths</span>
                        </div>
                        <div class="listing-detail">
                            <i class="fas fa-ruler-combined"></i>
                            <span>${formatNumber(property.sqft)} sqft</span>
                        </div>
                    </div>
                    <div class="listing-actions">
                        <a href="listing-details.html?id=${property.id}" class="btn btn-primary">
                            View Details
                        </a>
                        <button class="btn btn-outline" onclick="scheduleViewing(${property.id})">
                            <i class="fas fa-calendar"></i> Tour
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    toggleFavorite(button) {
        const propertyId = button.dataset.propertyId;
        if (!propertyId) return;
        
        const favorites = this.getFavorites();
        const isFavorited = favorites.includes(propertyId);
        
        if (isFavorited) {
            // Remove from favorites
            const index = favorites.indexOf(propertyId);
            favorites.splice(index, 1);
            button.classList.remove('favorited');
        } else {
            // Add to favorites
            favorites.push(propertyId);
            button.classList.add('favorited');
        }
        
        // Save to localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Animation feedback
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }

    getFavorites() {
        return JSON.parse(localStorage.getItem('favorites')) || [];
    }

    isFavorited(propertyId) {
        return this.getFavorites().includes(propertyId.toString());
    }

    setupScrollEffects() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                const heroVideo = hero.querySelector('.hero-video');
                if (heroVideo) {
                    heroVideo.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
            }
        });
        
        // Smooth reveal animations
        const revealElements = document.querySelectorAll('.section');
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            { threshold: 0.15 }
        );
        
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    }

    loadUserPreferences() {
        // Load user's saved search preferences
        const savedFilters = localStorage.getItem('searchFilters');
        if (savedFilters) {
            window.savedFilters = JSON.parse(savedFilters);
        }
        
        // Load viewing history
        const viewingHistory = localStorage.getItem('viewingHistory');
        if (viewingHistory) {
            window.viewingHistory = JSON.parse(viewingHistory);
        }
    }

    saveUserPreference(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    getUserPreference(key) {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    }

    trackPageView(page, propertyId = null) {
        const viewData = {
            page,
            propertyId,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        };
        
        // Add to viewing history
        let history = this.getUserPreference('viewingHistory') || [];
        history.push(viewData);
        
        // Keep only last 50 views
        if (history.length > 50) {
            history = history.slice(-50);
        }
        
        this.saveUserPreference('viewingHistory', history);
        
        // TODO: Send to analytics API
        console.log('Page view tracked:', viewData);
    }
}

// Global utility functions
function scheduleViewing(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    // Open AI chat with scheduling context
    if (window.aiChat) {
        window.aiChat.openChat();
        setTimeout(() => {
            const message = `I'd like to schedule a viewing for the property at ${property.address}`;
            window.aiChat.sendQuickPrompt(message);
        }, 500);
    } else {
        // Fallback to contact page
        window.location.href = `contact.html?type=tour&property=${propertyId}`;
    }
}

function requestInfo(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    // Open AI chat with info request context
    if (window.aiChat) {
        window.aiChat.openChat();
        setTimeout(() => {
            const message = `Can you tell me more about the property at ${property.address}?`;
            window.aiChat.sendQuickPrompt(message);
        }, 500);
    } else {
        // Fallback to contact page
        window.location.href = `contact.html?type=info&property=${propertyId}`;
    }
}

function shareProperty(propertyId) {
    const property = getPropertyById(propertyId);
    if (!property) return;
    
    const url = `${window.location.origin}/listing-details.html?id=${propertyId}`;
    const title = `${property.title} - ${property.priceDisplay}`;
    const text = `Check out this luxury property: ${property.address}`;
    
    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title,
            text,
            url
        }).catch(console.error);
    } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Property link copied to clipboard!');
        }).catch(() => {
            // Final fallback to prompt
            prompt('Copy this link:', url);
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#10b981' : '#3b82f6',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10001',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        fontSize: '0.95rem',
        fontWeight: '500',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize main functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.synaptecaMain = new SynaptecaMain();
    
    // Track page view
    const currentPage = window.location.pathname;
    window.synaptecaMain.trackPageView(currentPage);
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // Page became visible, check for updates
        console.log('Page became visible');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Connection lost. Some features may be unavailable.', 'warning');
});
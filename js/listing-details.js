// Listing Details page functionality
class ListingDetailsManager {
    constructor() {
        this.property = null;
        this.currentImageIndex = 0;
        this.lightboxIndex = 0;
        this.map = null;
        
        this.init();
    }

    init() {
        this.loadPropertyFromURL();
        this.bindEvents();
    }

    loadPropertyFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const propertyId = urlParams.get('id');
        
        if (!propertyId) {
            this.showPropertyNotFound();
            return;
        }
        
        // Simulate loading delay
        setTimeout(() => {
            this.property = getPropertyById(propertyId);
            
            if (!this.property) {
                this.showPropertyNotFound();
                return;
            }
            
            this.hideLoading();
            this.displayProperty();
            this.trackPropertyView();
        }, 1500);
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const propertyMain = document.getElementById('propertyMain');
        
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        if (propertyMain) {
            propertyMain.style.display = 'block';
        }
    }

    showPropertyNotFound() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        const propertyNotFound = document.getElementById('propertyNotFound');
        
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
        if (propertyNotFound) {
            propertyNotFound.style.display = 'block';
        }
    }

    displayProperty() {
        this.updatePageMeta();
        this.displayPropertyHeader();
        this.displayGallery();
        this.displayPropertyContent();
        this.displaySidebar();
        this.initializeMap();
        this.loadRelatedProperties();
        this.updateStructuredData();
    }

    updatePageMeta() {
        const title = `${this.property.title} - ${this.property.priceDisplay} | Synapteca`;
        const description = `${this.property.description.substring(0, 160)}...`;
        const image = this.property.images[0];
        
        // Update page title and meta description
        document.title = title;
        document.getElementById('pageTitle').content = title;
        document.getElementById('pageDescription').content = description;
        
        // Update Open Graph meta tags
        document.getElementById('ogTitle').content = title;
        document.getElementById('ogDescription').content = description;
        document.getElementById('ogImage').content = image;
        
        // Update breadcrumb
        document.getElementById('breadcrumbTitle').textContent = this.property.neighborhood;
    }

    displayPropertyHeader() {
        document.getElementById('propertyTitle').textContent = this.property.title;
        document.getElementById('propertyAddress').textContent = this.property.address;
        document.getElementById('propertyPrice').textContent = this.property.priceDisplay;
        
        // Property badges
        const badges = [];
        if (this.property.newToMarket) badges.push('<span class="badge new">New to Market</span>');
        if (this.property.featured) badges.push('<span class="badge featured">Featured</span>');
        document.getElementById('propertyBadges').innerHTML = badges.join('');
        
        // Set up favorite button
        this.updateFavoriteButton();
    }

    displayGallery() {
        const mainImage = document.getElementById('mainImage');
        const thumbnailGrid = document.getElementById('thumbnailGrid');
        
        if (!mainImage || !thumbnailGrid) return;
        
        // Set main image
        mainImage.src = this.property.images[0];
        mainImage.alt = this.property.title;
        
        // Create thumbnails
        thumbnailGrid.innerHTML = this.property.images.map((image, index) => `
            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="selectImage(${index})">
                <img src="${image}" alt="Property Image ${index + 1}" loading="lazy">
            </div>
        `).join('');
        
        // Update image counter
        document.getElementById('imageCounter').textContent = `1 / ${this.property.images.length}`;
    }

    displayPropertyContent() {
        this.displayPropertyFacts();
        this.displayDescription();
        this.displayFeatures();
        this.displayNeighborhoodInfo();
        this.displaySchoolRatings();
    }

    displayPropertyFacts() {
        const factsGrid = document.getElementById('factsGrid');
        if (!factsGrid) return;
        
        const facts = [
            { icon: 'fas fa-dollar-sign', label: 'Price', value: this.property.priceDisplay },
            { icon: 'fas fa-bed', label: 'Bedrooms', value: this.property.bedrooms },
            { icon: 'fas fa-bath', label: 'Bathrooms', value: this.property.bathrooms },
            { icon: 'fas fa-car', label: 'Parking', value: `${this.property.parking} spaces` },
            { icon: 'fas fa-ruler-combined', label: 'Size', value: `${formatNumber(this.property.sqft)} sqft` },
            { icon: 'fas fa-calendar', label: 'Year Built', value: this.property.yearBuilt },
            { icon: 'fas fa-home', label: 'Property Type', value: this.property.propertyType },
            { icon: 'fas fa-chart-line', label: 'Days on Market', value: `${this.property.daysOnMarket} days` },
            { icon: 'fas fa-money-bill', label: 'HOA Fees', value: `$${formatNumber(this.property.hoaFees)}/month` },
            { icon: 'fas fa-receipt', label: 'Property Tax', value: `$${formatNumber(this.property.propertyTax)}/year` }
        ];
        
        factsGrid.innerHTML = facts.map(fact => `
            <div class="fact-item">
                <i class="${fact.icon}"></i>
                <div class="fact-details">
                    <span class="fact-label">${fact.label}</span>
                    <span class="fact-value">${fact.value}</span>
                </div>
            </div>
        `).join('');
    }

    displayDescription() {
        document.getElementById('propertyDescription').innerHTML = `
            <p>${this.property.description}</p>
        `;
    }

    displayFeatures() {
        const featuresGrid = document.getElementById('propertyFeatures');
        if (!featuresGrid) return;
        
        featuresGrid.innerHTML = this.property.features.map(feature => `
            <div class="feature-item">
                <i class="fas fa-check-circle"></i>
                <span>${feature}</span>
            </div>
        `).join('');
    }

    displayNeighborhoodInfo() {
        const neighborhood = neighborhoods.find(n => n.slug === this.property.suburb);
        if (!neighborhood) return;
        
        document.getElementById('neighborhoodDescription').innerHTML = `
            <p>${neighborhood.description}</p>
            <p>Average property price in ${neighborhood.name}: ${formatPrice(neighborhood.averagePrice)}</p>
        `;
        
        const highlightsContainer = document.getElementById('neighborhoodHighlights');
        highlightsContainer.innerHTML = neighborhood.highlights.map(highlight => `
            <span class="highlight-tag">${highlight}</span>
        `).join('');
        
        // Update neighborhood name for related properties
        document.getElementById('neighborhoodName').textContent = neighborhood.name;
        
        // Add nearby places
        this.displayNearbyPlaces();
        this.displayTransportation();
    }

    displayNearbyPlaces() {
        const nearbyPlaces = document.getElementById('nearbyPlaces');
        if (!nearbyPlaces) return;
        
        // Mock nearby places based on neighborhood
        const places = this.getMockNearbyPlaces();
        nearbyPlaces.innerHTML = places.map(place => `
            <li>
                <i class="${place.icon}"></i>
                <span>${place.name}</span>
                <small>${place.distance}</small>
            </li>
        `).join('');
    }

    displayTransportation() {
        const transportation = document.getElementById('transportationOptions');
        if (!transportation) return;
        
        // Mock transportation options
        const options = this.getMockTransportation();
        transportation.innerHTML = options.map(option => `
            <li>
                <i class="${option.icon}"></i>
                <span>${option.name}</span>
                <small>${option.distance}</small>
            </li>
        `).join('');
    }

    displaySchoolRatings() {
        const schoolsGrid = document.getElementById('schoolsGrid');
        if (!schoolsGrid) return;
        
        // Mock school ratings
        const schools = this.getMockSchools();
        schoolsGrid.innerHTML = schools.map(school => `
            <div class="school-item">
                <div class="school-info">
                    <h4>${school.name}</h4>
                    <p>${school.type} • ${school.distance}</p>
                </div>
                <div class="school-rating">
                    <span class="rating-score">${school.rating}</span>
                    <div class="rating-stars">
                        ${this.generateStars(school.rating)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    displaySidebar() {
        this.setupMortgageCalculator();
        this.displayAgentContact();
        this.loadSimilarProperties();
    }

    setupMortgageCalculator() {
        const calcPrice = document.getElementById('calcPrice');
        if (calcPrice) {
            calcPrice.value = this.property.priceDisplay;
        }
        
        // Bind calculator events
        this.bindCalculatorEvents();
        
        // Initial calculation
        setTimeout(() => {
            this.calculateMortgage();
        }, 500);
    }

    bindCalculatorEvents() {
        const downPaymentSlider = document.getElementById('downPaymentSlider');
        const downPaymentInput = document.getElementById('downPayment');
        
        if (downPaymentSlider && downPaymentInput) {
            downPaymentSlider.addEventListener('input', (e) => {
                downPaymentInput.value = e.target.value;
                this.calculateMortgage();
            });
            
            downPaymentInput.addEventListener('input', (e) => {
                downPaymentSlider.value = e.target.value;
                this.calculateMortgage();
            });
        }
        
        // Auto-calculate on input changes
        ['interestRate', 'loanTerm'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', () => this.calculateMortgage());
            }
        });
    }

    calculateMortgage() {
        const price = this.property.price;
        const downPaymentPercent = parseFloat(document.getElementById('downPayment').value) || 20;
        const interestRate = parseFloat(document.getElementById('interestRate').value) || 6.5;
        const loanTermYears = parseInt(document.getElementById('loanTerm').value) || 30;
        
        const downPaymentAmount = price * (downPaymentPercent / 100);
        const loanAmount = price - downPaymentAmount;
        
        // Calculate monthly payment (Principal & Interest)
        const monthlyRate = interestRate / 100 / 12;
        const numPayments = loanTermYears * 12;
        
        const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                         (Math.pow(1 + monthlyRate, numPayments) - 1);
        
        // Calculate other monthly costs
        const monthlyPropertyTax = this.property.propertyTax / 12;
        const monthlyInsurance = price * 0.0035 / 12; // Estimate 0.35% of home value annually
        const monthlyHOA = this.property.hoaFees || 0;
        
        const totalMonthly = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyHOA;
        
        // Display results
        const resultsDiv = document.getElementById('calculatorResults');
        if (resultsDiv) {
            resultsDiv.style.display = 'block';
            
            document.getElementById('monthlyPayment').textContent = formatPrice(totalMonthly);
            document.getElementById('principalInterest').textContent = formatPrice(monthlyPI);
            document.getElementById('propertyTax').textContent = formatPrice(monthlyPropertyTax);
            document.getElementById('insurance').textContent = formatPrice(monthlyInsurance);
            document.getElementById('hoaFees').textContent = formatPrice(monthlyHOA);
        }
    }

    displayAgentContact() {
        const agentContact = document.getElementById('agentContact');
        if (!agentContact || !this.property.agent) return;
        
        agentContact.innerHTML = `
            <div class="agent-card">
                <div class="agent-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="agent-info">
                    <h4>${this.property.agent.name}</h4>
                    <p>Luxury Property Specialist</p>
                    <div class="agent-contact-info">
                        <a href="tel:${this.property.agent.phone}" class="contact-item">
                            <i class="fas fa-phone"></i>
                            <span>${this.property.agent.phone}</span>
                        </a>
                        <a href="mailto:${this.property.agent.email}" class="contact-item">
                            <i class="fas fa-envelope"></i>
                            <span>${this.property.agent.email}</span>
                        </a>
                    </div>
                    <button class="btn btn-primary btn-full" onclick="contactAgent()">
                        <i class="fas fa-comment"></i> Contact Agent
                    </button>
                </div>
            </div>
        `;
    }

    loadSimilarProperties() {
        const similarContainer = document.getElementById('similarPropertiesList');
        if (!similarContainer) return;
        
        // Find similar properties (same neighborhood, similar price range)
        const similarProperties = sydneyProperties.filter(p => {
            if (p.id === this.property.id) return false;
            
            const priceDiff = Math.abs(p.price - this.property.price) / this.property.price;
            return p.suburb === this.property.suburb || priceDiff < 0.3;
        }).slice(0, 3);
        
        similarContainer.innerHTML = similarProperties.map(property => `
            <div class="similar-property-card">
                <div class="similar-property-image">
                    <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
                </div>
                <div class="similar-property-info">
                    <div class="similar-price">${property.priceDisplay}</div>
                    <p class="similar-address">${property.address}</p>
                    <div class="similar-details">
                        <span><i class="fas fa-bed"></i> ${property.bedrooms}</span>
                        <span><i class="fas fa-bath"></i> ${property.bathrooms}</span>
                    </div>
                    <a href="listing-details.html?id=${property.id}" class="btn btn-outline btn-sm">
                        View Details
                    </a>
                </div>
            </div>
        `).join('');
    }

    initializeMap() {
        const mapElement = document.getElementById('locationMap');
        if (!mapElement || !this.property.coordinates) return;
        
        const [lat, lng] = this.property.coordinates;
        
        // Initialize Leaflet map
        this.map = L.map('locationMap').setView([lat, lng], 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        
        // Add property marker
        const marker = L.marker([lat, lng]).addTo(this.map);
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${this.property.title}</h4>
                <p>${this.property.address}</p>
                <p><strong>${this.property.priceDisplay}</strong></p>
            </div>
        `).openPopup();
        
        // Add nearby amenities markers (mock data)
        this.addNearbyAmenities();
    }

    loadRelatedProperties() {
        const relatedContainer = document.getElementById('relatedPropertiesCarousel');
        if (!relatedContainer) return;
        
        const relatedProperties = getPropertiesByNeighborhood(this.property.suburb)
            .filter(p => p.id !== this.property.id)
            .slice(0, 4);
        
        relatedContainer.innerHTML = relatedProperties.map(property => `
            <div class="related-property-card">
                <div class="related-property-image">
                    <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
                    ${property.newToMarket ? '<div class="listing-badge">New</div>' : ''}
                </div>
                <div class="related-property-content">
                    <div class="related-price">${property.priceDisplay}</div>
                    <h4>${property.title}</h4>
                    <p>${property.address}</p>
                    <div class="related-details">
                        <span><i class="fas fa-bed"></i> ${property.bedrooms} beds</span>
                        <span><i class="fas fa-bath"></i> ${property.bathrooms} baths</span>
                        <span><i class="fas fa-ruler-combined"></i> ${formatNumber(property.sqft)} sqft</span>
                    </div>
                    <a href="listing-details.html?id=${property.id}" class="btn btn-primary">
                        View Details
                    </a>
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Image gallery navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.previousImage();
            if (e.key === 'ArrowRight') this.nextImage();
            if (e.key === 'Escape') this.closeLightbox();
        });
        
        // Lightbox click outside to close
        document.getElementById('lightboxOverlay')?.addEventListener('click', (e) => {
            if (e.target.id === 'lightboxOverlay') {
                this.closeLightbox();
            }
        });
    }

    selectImage(index) {
        this.currentImageIndex = index;
        
        // Update main image
        const mainImage = document.getElementById('mainImage');
        mainImage.src = this.property.images[index];
        
        // Update thumbnails
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
        
        // Update counter
        document.getElementById('imageCounter').textContent = `${index + 1} / ${this.property.images.length}`;
    }

    nextImage() {
        const nextIndex = (this.currentImageIndex + 1) % this.property.images.length;
        this.selectImage(nextIndex);
    }

    previousImage() {
        const prevIndex = (this.currentImageIndex - 1 + this.property.images.length) % this.property.images.length;
        this.selectImage(prevIndex);
    }

    openLightbox() {
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        const lightboxImage = document.getElementById('lightboxImage');
        
        this.lightboxIndex = this.currentImageIndex;
        lightboxImage.src = this.property.images[this.lightboxIndex];
        lightboxOverlay.style.display = 'flex';
        
        // Update counter
        document.getElementById('lightboxCounter').textContent = `${this.lightboxIndex + 1} / ${this.property.images.length}`;
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        lightboxOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    nextLightboxImage() {
        this.lightboxIndex = (this.lightboxIndex + 1) % this.property.images.length;
        document.getElementById('lightboxImage').src = this.property.images[this.lightboxIndex];
        document.getElementById('lightboxCounter').textContent = `${this.lightboxIndex + 1} / ${this.property.images.length}`;
    }

    previousLightboxImage() {
        this.lightboxIndex = (this.lightboxIndex - 1 + this.property.images.length) % this.property.images.length;
        document.getElementById('lightboxImage').src = this.property.images[this.lightboxIndex];
        document.getElementById('lightboxCounter').textContent = `${this.lightboxIndex + 1} / ${this.property.images.length}`;
    }

    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('headerFavoriteBtn');
        if (!favoriteBtn) return;
        
        const isFavorited = window.synaptecaMain ? window.synaptecaMain.isFavorited(this.property.id) : false;
        favoriteBtn.classList.toggle('favorited', isFavorited);
        
        favoriteBtn.addEventListener('click', () => {
            if (window.synaptecaMain) {
                window.synaptecaMain.toggleFavorite(favoriteBtn);
            }
        });
    }

    trackPropertyView() {
        if (window.synaptecaMain) {
            window.synaptecaMain.trackPageView('listing-details', this.property.id);
        }
        
        // Add to viewing history
        let history = JSON.parse(localStorage.getItem('viewingHistory')) || [];
        history.unshift({
            propertyId: this.property.id,
            title: this.property.title,
            address: this.property.address,
            price: this.property.priceDisplay,
            image: this.property.images[0],
            timestamp: Date.now()
        });
        
        // Keep only last 10 viewed
        history = history.slice(0, 10);
        localStorage.setItem('viewingHistory', JSON.stringify(history));
    }

    updateStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": this.property.title,
            "description": this.property.description,
            "url": window.location.href,
            "image": this.property.images,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": this.property.address,
                "addressLocality": this.property.neighborhood,
                "addressRegion": "NSW",
                "addressCountry": "AU"
            },
            "offers": {
                "@type": "Offer",
                "price": this.property.price,
                "priceCurrency": "AUD"
            },
            "floorSize": {
                "@type": "QuantitativeValue",
                "value": this.property.sqft,
                "unitText": "sqft"
            },
            "numberOfRooms": this.property.bedrooms,
            "numberOfBathrooms": this.property.bathrooms,
            "yearBuilt": this.property.yearBuilt
        };
        
        document.getElementById('propertyStructuredData').textContent = JSON.stringify(structuredData);
    }

    // Mock data methods
    getMockNearbyPlaces() {
        const places = {
            'double-bay': [
                { name: 'Double Bay Shopping Centre', icon: 'fas fa-shopping-bag', distance: '200m' },
                { name: 'Redleaf Beach', icon: 'fas fa-umbrella-beach', distance: '400m' },
                { name: 'Royal Sydney Golf Club', icon: 'fas fa-golf-ball', distance: '1.2km' }
            ],
            'mosman': [
                { name: 'Taronga Zoo', icon: 'fas fa-paw', distance: '800m' },
                { name: 'Balmoral Beach', icon: 'fas fa-umbrella-beach', distance: '1.5km' },
                { name: 'Mosman Village', icon: 'fas fa-store', distance: '300m' }
            ],
            'vaucluse': [
                { name: 'Vaucluse House', icon: 'fas fa-landmark', distance: '500m' },
                { name: 'Nielsen Park', icon: 'fas fa-tree', distance: '600m' },
                { name: 'Gap Bluff', icon: 'fas fa-mountain', distance: '1km' }
            ]
        };
        
        return places[this.property.suburb] || places['double-bay'];
    }

    getMockTransportation() {
        return [
            { name: 'Edgecliff Station', icon: 'fas fa-train', distance: '1.2km' },
            { name: 'Bus Stop - New South Head Rd', icon: 'fas fa-bus', distance: '150m' },
            { name: 'Sydney Harbour Bridge', icon: 'fas fa-road', distance: '8km' },
            { name: 'Sydney Airport', icon: 'fas fa-plane', distance: '12km' }
        ];
    }

    getMockSchools() {
        return [
            { name: 'Ascham School', type: 'Private Girls School', rating: 9.2, distance: '800m' },
            { name: 'Cranbrook School', type: 'Private Boys School', rating: 9.0, distance: '1.2km' },
            { name: 'SCEGGS Redlands', type: 'Private Girls School', rating: 8.8, distance: '1.5km' },
            { name: 'Double Bay Public School', type: 'Public Primary', rating: 8.5, distance: '600m' }
        ];
    }

    generateStars(rating) {
        const stars = Math.floor(rating / 2);
        const hasHalf = (rating % 2) >= 1;
        let html = '';
        
        for (let i = 0; i < stars; i++) {
            html += '<i class="fas fa-star"></i>';
        }
        if (hasHalf) {
            html += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = stars + (hasHalf ? 1 : 0); i < 5; i++) {
            html += '<i class="far fa-star"></i>';
        }
        
        return html;
    }

    addNearbyAmenities() {
        if (!this.map) return;
        
        // Mock nearby amenities
        const amenities = [
            { name: 'Shopping Centre', lat: -33.8707, lng: 151.2405, icon: '🛍️' },
            { name: 'Beach', lat: -33.8697, lng: 151.2385, icon: '🏖️' },
            { name: 'Restaurant', lat: -33.8717, lng: 151.2375, icon: '🍽️' },
            { name: 'School', lat: -33.8687, lng: 151.2415, icon: '🏫' }
        ];
        
        amenities.forEach(amenity => {
            const marker = L.marker([amenity.lat, amenity.lng]).addTo(this.map);
            marker.bindPopup(`${amenity.icon} ${amenity.name}`);
        });
    }
}

// Global functions for HTML onclick handlers
function selectImage(index) {
    if (window.listingDetailsManager) {
        window.listingDetailsManager.selectImage(index);
    }
}

function nextImage() {
    if (window.listingDetailsManager) {
        window.listingDetailsManager.nextImage();
    }
}

function previousImage() {
    if (window.listingDetailsManager) {
        window.listingDetailsManager.previousImage();
    }
}

function openLightbox() {
    if (window.listingDetailsManager) {
        window.listingDetailsManager.openLightbox();
    }
}

function closeLightbox() {
    if (window.listingDetailsManager) {
        window.listingDetailsManager.closeLightbox();
    }
}

function nextLightboxImage() {
    if (window.listingDetailsManager) {
        window.listingDetailsManager.nextLightboxImage();
    }
}

function previousLightboxImage() {
    if (window.listingDetailsManager) {
        window.listingDetailsManager.previousLightboxImage();
    }
}

function calculateMortgage() {
    if (window.listingDetailsManager) {
        window.listingDetailsManager.calculateMortgage();
    }
}

function scheduleViewing() {
    if (window.aiChat) {
        window.aiChat.openChat();
        setTimeout(() => {
            const message = `I'd like to schedule a viewing for ${window.listingDetailsManager.property.address}`;
            window.aiChat.sendQuickPrompt(message);
        }, 500);
    }
}

function requestInfo() {
    if (window.aiChat) {
        window.aiChat.openChat();
        setTimeout(() => {
            const message = `Can you provide more information about the property at ${window.listingDetailsManager.property.address}?`;
            window.aiChat.sendQuickPrompt(message);
        }, 500);
    }
}

function shareProperty() {
    if (window.listingDetailsManager && window.listingDetailsManager.property) {
        shareProperty(window.listingDetailsManager.property.id);
    }
}

function contactAgent() {
    if (window.aiChat) {
        window.aiChat.openChat();
        setTimeout(() => {
            const message = "I'd like to speak with the listing agent about this property";
            window.aiChat.sendQuickPrompt(message);
        }, 500);
    }
}

function requestBrochure() {
    showNotification('Property brochure download would be available with backend integration', 'info');
}

function compareProperties() {
    showNotification('Property comparison feature would allow side-by-side analysis', 'info');
}

function askAIQuestions() {
    if (window.aiChat) {
        window.aiChat.openChat();
        setTimeout(() => {
            const message = "I have some questions about this property";
            window.aiChat.sendQuickPrompt(message);
        }, 500);
    }
}

function open3DTour() {
    showNotification('3D virtual tour would open with Matterport integration', 'info');
}

function openFloorPlans() {
    showNotification('Interactive floor plans would be displayed', 'info');
}

function openVideoTour() {
    showNotification('Property video tour would play', 'info');
}

// Initialize listing details manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.listingDetailsManager = new ListingDetailsManager();
});
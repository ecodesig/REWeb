// Listings page functionality
class ListingsManager {
    constructor() {
        this.currentView = 'grid';
        this.currentFilters = {
            minPrice: 0,
            maxPrice: 50000000,
            propertyType: 'all',
            bedrooms: null,
            bathrooms: null,
            neighborhood: 'all',
            amenities: [],
            sqft: 1000
        };
        this.currentSort = 'price-desc';
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.filteredProperties = [];
        this.map = null;
        this.mapMarkers = [];
        
        this.init();
    }

    init() {
        this.loadPropertiesFromURL();
        this.bindEvents();
        this.initializeFilters();
        this.loadProperties();
        this.setupMap();
    }

    loadPropertiesFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Load filters from URL parameters
        if (urlParams.get('neighborhood')) {
            this.currentFilters.neighborhood = urlParams.get('neighborhood');
        }
        if (urlParams.get('minPrice')) {
            this.currentFilters.minPrice = parseInt(urlParams.get('minPrice'));
        }
        if (urlParams.get('maxPrice')) {
            this.currentFilters.maxPrice = parseInt(urlParams.get('maxPrice'));
        }
        if (urlParams.get('bedrooms')) {
            this.currentFilters.bedrooms = parseInt(urlParams.get('bedrooms'));
        }
        if (urlParams.get('propertyType')) {
            this.currentFilters.propertyType = urlParams.get('propertyType');
        }
    }

    bindEvents() {
        // View toggles
        document.querySelectorAll('.view-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });

        // Filter toggles
        const filtersToggle = document.getElementById('filtersToggle');
        const filtersContent = document.getElementById('filtersContent');
        
        if (filtersToggle && filtersContent) {
            filtersToggle.addEventListener('click', () => {
                filtersContent.classList.toggle('active');
                const isActive = filtersContent.classList.contains('active');
                filtersToggle.innerHTML = `<i class="fas fa-sliders-h"></i> ${isActive ? 'Hide' : 'Advanced'} Filters`;
            });
        }

        // Price range sliders
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        
        if (minPrice && maxPrice) {
            minPrice.addEventListener('input', () => this.updatePriceRange());
            maxPrice.addEventListener('input', () => this.updatePriceRange());
        }

        // Square footage slider
        const sqftRange = document.getElementById('sqftRange');
        if (sqftRange) {
            sqftRange.addEventListener('input', (e) => {
                document.getElementById('sqftValue').textContent = `${formatNumber(e.target.value)}+ sqft`;
            });
        }

        // Filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('filter-btn')) {
                this.handleFilterButtonClick(e.target);
            }
        });

        // Apply and clear filters
        const applyFilters = document.getElementById('applyFilters');
        const clearFilters = document.getElementById('clearFilters');
        
        if (applyFilters) {
            applyFilters.addEventListener('click', () => this.applyFilters());
        }
        
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearFilters());
        }

        // Sort dropdown
        const sortBy = document.getElementById('sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.sortAndDisplayProperties();
            });
        }

        // Quick search
        const quickSearch = document.getElementById('quickSearch');
        if (quickSearch) {
            quickSearch.addEventListener('input', debounce((e) => {
                this.performQuickSearch(e.target.value);
            }, 500));
        }

        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.closest('.pagination-btn') || e.target.closest('.page-number')) {
                this.handlePagination(e.target);
            }
        });
    }

    initializeFilters() {
        // Set initial filter values from URL or defaults
        const minPriceSlider = document.getElementById('minPrice');
        const maxPriceSlider = document.getElementById('maxPrice');
        const neighborhoodSelect = document.getElementById('neighborhood');
        const propertyTypeSelect = document.getElementById('propertyType');
        
        if (minPriceSlider) {
            minPriceSlider.value = this.currentFilters.minPrice;
        }
        if (maxPriceSlider) {
            maxPriceSlider.value = this.currentFilters.maxPrice;
        }
        if (neighborhoodSelect) {
            neighborhoodSelect.value = this.currentFilters.neighborhood;
        }
        if (propertyTypeSelect) {
            propertyTypeSelect.value = this.currentFilters.propertyType;
        }

        // Set bedroom/bathroom filter buttons
        if (this.currentFilters.bedrooms) {
            const bedroomBtn = document.querySelector(`[data-bedrooms="${this.currentFilters.bedrooms}"]`);
            if (bedroomBtn) {
                bedroomBtn.classList.add('active');
            }
        }

        this.updatePriceRange();
    }

    updatePriceRange() {
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const minPriceValue = document.getElementById('minPriceValue');
        const maxPriceValue = document.getElementById('maxPriceValue');
        
        if (minPrice && maxPrice && minPriceValue && maxPriceValue) {
            const min = parseInt(minPrice.value);
            const max = parseInt(maxPrice.value);
            
            // Ensure min is not greater than max
            if (min > max) {
                minPrice.value = max;
                return;
            }
            
            minPriceValue.textContent = this.formatPriceLabel(min);
            maxPriceValue.textContent = this.formatPriceLabel(max);
            
            this.currentFilters.minPrice = min;
            this.currentFilters.maxPrice = max;
        }
    }

    formatPriceLabel(price) {
        if (price === 0) return '$0';
        if (price >= 50000000) return '$50M+';
        if (price >= 1000000) {
            return `$${Math.floor(price / 1000000)}M`;
        }
        return `$${Math.floor(price / 1000)}K`;
    }

    handleFilterButtonClick(button) {
        const parent = button.parentElement;
        const filterType = Object.keys(button.dataset)[0];
        const value = button.dataset[filterType];
        
        // Remove active class from siblings
        parent.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update filters
        if (value === 'any') {
            this.currentFilters[filterType] = null;
        } else {
            this.currentFilters[filterType] = parseInt(value);
        }
    }

    switchView(viewType) {
        // Update toggle buttons
        document.querySelectorAll('.view-toggle').forEach(toggle => {
            toggle.classList.remove('active');
        });
        document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
        
        this.currentView = viewType;
        
        const listingsContainer = document.getElementById('listingsContainer');
        const mapContainer = document.getElementById('mapContainer');
        
        if (viewType === 'map') {
            listingsContainer.style.display = 'none';
            mapContainer.style.display = 'block';
            this.initializeMap();
        } else {
            listingsContainer.style.display = 'block';
            mapContainer.style.display = 'none';
            
            const listingsGrid = document.getElementById('listingsGrid');
            listingsGrid.className = viewType === 'grid' ? 'listings-grid' : 'listings-list';
        }
        
        this.displayProperties();
    }

    setupMap() {
        // Initialize Leaflet map (placeholder implementation)
        const mapElement = document.getElementById('propertyMap');
        if (!mapElement) return;
        
        // This will be initialized when map view is selected
    }

    initializeMap() {
        if (this.map) return; // Already initialized
        
        const mapElement = document.getElementById('propertyMap');
        if (!mapElement) return;
        
        // Initialize Leaflet map centered on Sydney
        this.map = L.map('propertyMap').setView([-33.8688, 151.2093], 12);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        
        // Add property markers
        this.addPropertyMarkers();
    }

    addPropertyMarkers() {
        if (!this.map) return;
        
        // Clear existing markers
        this.mapMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.mapMarkers = [];
        
        // Add markers for filtered properties
        this.filteredProperties.forEach(property => {
            if (property.coordinates) {
                const [lat, lng] = property.coordinates;
                
                const marker = L.marker([lat, lng]).addTo(this.map);
                
                const popupContent = `
                    <div class="map-popup">
                        <img src="${property.images[0]}" alt="${property.title}" style="width: 200px; height: 120px; object-fit: cover; border-radius: 8px;">
                        <h4 style="margin: 10px 0 5px; font-size: 1rem;">${property.title}</h4>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">${property.address}</p>
                        <p style="margin: 5px 0; font-weight: 600; color: #C4A062;">${property.priceDisplay}</p>
                        <div style="display: flex; gap: 10px; margin: 8px 0;">
                            <span><i class="fas fa-bed"></i> ${property.bedrooms}</span>
                            <span><i class="fas fa-bath"></i> ${property.bathrooms}</span>
                            <span><i class="fas fa-ruler-combined"></i> ${formatNumber(property.sqft)} sqft</span>
                        </div>
                        <a href="listing-details.html?id=${property.id}" class="btn btn-primary btn-sm" style="display: inline-block; margin-top: 8px; padding: 0.5rem 1rem; font-size: 0.85rem;">View Details</a>
                    </div>
                `;
                
                marker.bindPopup(popupContent);
                this.mapMarkers.push(marker);
            }
        });
    }

    loadProperties() {
        // Apply filters to properties
        this.filteredProperties = this.applyCurrentFilters(sydneyProperties);
        this.sortAndDisplayProperties();
    }

    applyCurrentFilters(properties) {
        return properties.filter(property => {
            // Price range
            if (property.price < this.currentFilters.minPrice || property.price > this.currentFilters.maxPrice) {
                return false;
            }
            
            // Property type
            if (this.currentFilters.propertyType !== 'all' && 
                property.propertyType.toLowerCase() !== this.currentFilters.propertyType) {
                return false;
            }
            
            // Bedrooms
            if (this.currentFilters.bedrooms && property.bedrooms < this.currentFilters.bedrooms) {
                return false;
            }
            
            // Bathrooms
            if (this.currentFilters.bathrooms && property.bathrooms < this.currentFilters.bathrooms) {
                return false;
            }
            
            // Neighborhood
            if (this.currentFilters.neighborhood !== 'all' && 
                property.suburb !== this.currentFilters.neighborhood) {
                return false;
            }
            
            // Square footage
            if (property.sqft < this.currentFilters.sqft) {
                return false;
            }
            
            // Amenities
            if (this.currentFilters.amenities.length > 0) {
                const hasRequiredAmenities = this.currentFilters.amenities.every(amenity => 
                    property.features.includes(amenity)
                );
                if (!hasRequiredAmenities) {
                    return false;
                }
            }
            
            return true;
        });
    }

    applyFilters() {
        // Collect all filter values
        this.collectFilterValues();
        
        // Apply filters and update display
        this.loadProperties();
        
        // Update URL with current filters
        this.updateURL();
        
        // Show success message
        showNotification('Filters applied successfully!', 'success');
    }

    collectFilterValues() {
        // Price range (already updated by sliders)
        
        // Property type
        const propertyType = document.getElementById('propertyType');
        if (propertyType) {
            this.currentFilters.propertyType = propertyType.value;
        }
        
        // Neighborhood
        const neighborhood = document.getElementById('neighborhood');
        if (neighborhood) {
            this.currentFilters.neighborhood = neighborhood.value;
        }
        
        // Square footage
        const sqftRange = document.getElementById('sqftRange');
        if (sqftRange) {
            this.currentFilters.sqft = parseInt(sqftRange.value);
        }
        
        // Amenities
        const amenityCheckboxes = document.querySelectorAll('.amenity-checkbox input:checked');
        this.currentFilters.amenities = Array.from(amenityCheckboxes).map(cb => cb.value);
    }

    clearFilters() {
        // Reset all filters to defaults
        this.currentFilters = {
            minPrice: 0,
            maxPrice: 50000000,
            propertyType: 'all',
            bedrooms: null,
            bathrooms: null,
            neighborhood: 'all',
            amenities: [],
            sqft: 1000
        };
        
        // Reset UI elements
        this.resetFilterUI();
        
        // Reload properties
        this.loadProperties();
        
        // Clear URL parameters
        window.history.pushState({}, '', window.location.pathname);
        
        showNotification('Filters cleared', 'info');
    }

    resetFilterUI() {
        // Reset sliders
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = 50000000;
        document.getElementById('sqftRange').value = 1000;
        
        // Reset selects
        document.getElementById('propertyType').value = 'all';
        document.getElementById('neighborhood').value = 'all';
        
        // Reset buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Reset checkboxes
        document.querySelectorAll('.amenity-checkbox input').forEach(cb => {
            cb.checked = false;
        });
        
        // Update price display
        this.updatePriceRange();
        
        // Update sqft display
        document.getElementById('sqftValue').textContent = '1,000+ sqft';
    }

    sortAndDisplayProperties() {
        // Sort properties based on current sort option
        switch (this.currentSort) {
            case 'price-desc':
                this.filteredProperties.sort((a, b) => b.price - a.price);
                break;
            case 'price-asc':
                this.filteredProperties.sort((a, b) => a.price - b.price);
                break;
            case 'newest':
                this.filteredProperties.sort((a, b) => b.daysOnMarket - a.daysOnMarket);
                break;
            case 'bedrooms-desc':
                this.filteredProperties.sort((a, b) => b.bedrooms - a.bedrooms);
                break;
            case 'sqft-desc':
                this.filteredProperties.sort((a, b) => b.sqft - a.sqft);
                break;
        }
        
        this.displayProperties();
    }

    displayProperties() {
        this.updateResultsHeader();
        
        if (this.currentView === 'map') {
            this.addPropertyMarkers();
            return;
        }
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProperties = this.filteredProperties.slice(startIndex, endIndex);
        
        const listingsGrid = document.getElementById('listingsGrid');
        if (!listingsGrid) return;
        
        if (pageProperties.length === 0) {
            listingsGrid.innerHTML = this.createNoResultsMessage();
            document.getElementById('paginationContainer').style.display = 'none';
            return;
        }
        
        listingsGrid.innerHTML = pageProperties.map(property => 
            this.createPropertyCard(property)
        ).join('');
        
        this.updatePagination();
    }

    createPropertyCard(property) {
        const isFavorited = window.synaptecaMain ? window.synaptecaMain.isFavorited(property.id) : false;
        
        return `
            <div class="listing-card" data-property-id="${property.id}">
                <div class="listing-image">
                    <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
                    ${property.newToMarket ? '<div class="listing-badge">New to Market</div>' : ''}
                    ${property.featured ? '<div class="listing-badge featured">Featured</div>' : ''}
                    <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" data-property-id="${property.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="listing-content">
                    <div class="listing-price">${property.priceDisplay}</div>
                    <div class="listing-address">${property.address}</div>
                    <div class="listing-neighborhood">${property.neighborhood}</div>
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
                        <div class="listing-detail">
                            <i class="fas fa-calendar"></i>
                            <span>${property.daysOnMarket} days on market</span>
                        </div>
                    </div>
                    <div class="listing-features">
                        ${property.features.slice(0, 3).map(feature => 
                            `<span class="feature-tag">${feature}</span>`
                        ).join('')}
                    </div>
                    <div class="listing-actions">
                        <a href="listing-details.html?id=${property.id}" class="btn btn-primary">
                            View Details
                        </a>
                        <button class="btn btn-outline" onclick="scheduleViewing(${property.id})">
                            <i class="fas fa-calendar"></i> Tour
                        </button>
                        <button class="btn btn-glass" onclick="shareProperty(${property.id})">
                            <i class="fas fa-share"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    createNoResultsMessage() {
        return `
            <div class="no-results">
                <div class="no-results-content">
                    <i class="fas fa-search"></i>
                    <h3>No Properties Found</h3>
                    <p>We couldn't find any properties matching your search criteria. Try adjusting your filters or contact our AI concierge for personalized assistance.</p>
                    <div class="no-results-actions">
                        <button class="btn btn-primary" onclick="openAIChat()">
                            <i class="fas fa-robot"></i> Ask Our AI Concierge
                        </button>
                        <button class="btn btn-outline" onclick="window.listingsManager.clearFilters()">
                            <i class="fas fa-times"></i> Clear Filters
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    updateResultsHeader() {
        const resultsCount = document.getElementById('resultsCount');
        const resultsLocation = document.getElementById('resultsLocation');
        
        if (resultsCount) {
            const count = this.filteredProperties.length;
            resultsCount.textContent = `${count} ${count === 1 ? 'Property' : 'Properties'} Found`;
        }
        
        if (resultsLocation) {
            let location = 'Sydney Luxury Market';
            if (this.currentFilters.neighborhood !== 'all') {
                const neighborhoodName = this.currentFilters.neighborhood.replace('-', ' ')
                    .replace(/\b\w/g, l => l.toUpperCase());
                location = `${neighborhoodName}, Sydney`;
            }
            resultsLocation.textContent = location;
        }
    }

    updatePagination() {
        const totalPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
        const paginationContainer = document.getElementById('paginationContainer');
        
        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }
        
        paginationContainer.style.display = 'block';
        
        // Update pagination buttons
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === totalPages;
        
        // Update page numbers
        const paginationNumbers = document.getElementById('paginationNumbers');
        paginationNumbers.innerHTML = this.generatePageNumbers(totalPages);
        
        // Update pagination info
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredProperties.length);
        const paginationInfo = document.getElementById('paginationInfo');
        
        if (paginationInfo) {
            paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${this.filteredProperties.length} properties`;
        }
    }

    generatePageNumbers(totalPages) {
        let pages = [];
        const current = this.currentPage;
        
        // Always show first page
        pages.push(1);
        
        // Add ellipsis if needed
        if (current > 3) {
            pages.push('...');
        }
        
        // Add pages around current
        for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }
        
        // Add ellipsis if needed
        if (current < totalPages - 2) {
            pages.push('...');
        }
        
        // Always show last page
        if (totalPages > 1 && !pages.includes(totalPages)) {
            pages.push(totalPages);
        }
        
        return pages.map(page => {
            if (page === '...') {
                return '<span class="pagination-ellipsis">...</span>';
            }
            const isActive = page === current;
            return `<button class="page-number ${isActive ? 'active' : ''}" data-page="${page}">${page}</button>`;
        }).join('');
    }

    handlePagination(element) {
        if (element.id === 'prevPage') {
            this.currentPage = Math.max(1, this.currentPage - 1);
        } else if (element.id === 'nextPage') {
            const totalPages = Math.ceil(this.filteredProperties.length / this.itemsPerPage);
            this.currentPage = Math.min(totalPages, this.currentPage + 1);
        } else if (element.classList.contains('page-number')) {
            this.currentPage = parseInt(element.dataset.page);
        }
        
        this.displayProperties();
        
        // Scroll to top of results
        document.querySelector('.results-section').scrollIntoView({ behavior: 'smooth' });
    }

    performQuickSearch(query) {
        if (!query.trim()) {
            this.loadProperties();
            return;
        }
        
        const searchTerm = query.toLowerCase();
        this.filteredProperties = sydneyProperties.filter(property => {
            return property.title.toLowerCase().includes(searchTerm) ||
                   property.address.toLowerCase().includes(searchTerm) ||
                   property.neighborhood.toLowerCase().includes(searchTerm) ||
                   property.features.some(feature => feature.toLowerCase().includes(searchTerm));
        });
        
        this.currentPage = 1;
        this.displayProperties();
    }

    updateURL() {
        const params = new URLSearchParams();
        
        if (this.currentFilters.minPrice > 0) {
            params.set('minPrice', this.currentFilters.minPrice);
        }
        if (this.currentFilters.maxPrice < 50000000) {
            params.set('maxPrice', this.currentFilters.maxPrice);
        }
        if (this.currentFilters.propertyType !== 'all') {
            params.set('propertyType', this.currentFilters.propertyType);
        }
        if (this.currentFilters.neighborhood !== 'all') {
            params.set('neighborhood', this.currentFilters.neighborhood);
        }
        if (this.currentFilters.bedrooms) {
            params.set('bedrooms', this.currentFilters.bedrooms);
        }
        if (this.currentFilters.bathrooms) {
            params.set('bathrooms', this.currentFilters.bathrooms);
        }
        
        const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
        window.history.pushState({}, '', newURL);
    }
}

// Global functions for map controls
function fitMapToBounds() {
    if (window.listingsManager && window.listingsManager.map && window.listingsManager.mapMarkers.length > 0) {
        const group = new L.featureGroup(window.listingsManager.mapMarkers);
        window.listingsManager.map.fitBounds(group.getBounds().pad(0.1));
    }
}

function toggleSatelliteView() {
    // Placeholder for satellite view toggle
    showNotification('Satellite view would be available with Google Maps integration');
}

function openAISearchAssistant() {
    if (window.aiChat) {
        window.aiChat.openChat();
        setTimeout(() => {
            const message = "I'm looking for a luxury property in Sydney. Can you help me with my search criteria?";
            window.aiChat.sendQuickPrompt(message);
        }, 500);
    }
}

// Initialize listings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.listingsManager = new ListingsManager();
});
/**
 * Sunasutra Website JavaScript
 * Mobile-optimized navigation and UI functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get elements that will be used in multiple places
    const siteOverlay = document.querySelector('.site-overlay');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdowns = document.querySelectorAll('.dropdown');
    const searchIcon = document.querySelector('.search-icon');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');

    // Mobile Menu Toggle functionality
    if (menuToggle && navLinks) {
        // Add aria attributes for accessibility
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
        
        // Toggle mobile menu visibility
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            siteOverlay.classList.toggle('active');
            const isExpanded = navLinks.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
            document.body.style.overflow = isExpanded ? 'hidden' : '';
            
            // If closing the menu, close all dropdowns
            if (!isExpanded) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
                });
            }
        });

        // Handle dropdown toggles in mobile view
        dropdowns.forEach(dropdown => {
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            
            if (dropdownToggle) {
                // Add aria attributes for accessibility
                dropdownToggle.setAttribute('aria-expanded', 'false');
                dropdownToggle.setAttribute('aria-haspopup', 'true');
                
                dropdownToggle.addEventListener('click', function(e) {
                    // Only for mobile
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        e.stopPropagation(); // Stop event bubbling
                        
                        const isActive = dropdown.classList.contains('active');
                        
                        // Close other dropdowns
                        dropdowns.forEach(otherDropdown => {
                            if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                                otherDropdown.classList.remove('active');
                                const otherToggle = otherDropdown.querySelector('.dropdown-toggle');
                                if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                            }
                        });
                        
                        // Toggle current dropdown
                        dropdown.classList.toggle('active');
                        dropdownToggle.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
                    }
                });
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                siteOverlay.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';

                // Close all dropdowns
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
                });
            }
        });

        // Close mobile menu when resizing to desktop
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                siteOverlay.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';

                // Reset dropdown states
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
                    if (dropdownToggle) dropdownToggle.setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    // Manual Carousel functionality
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    // Create carousel navigation elements if they don't exist
    if (carouselContainer && slides.length > 0) {
        // Add navigation arrows
        if (!document.querySelector('.carousel-arrows')) {
            const arrowsDiv = document.createElement('div');
            arrowsDiv.className = 'carousel-arrows';
            
            const prevArrow = document.createElement('div');
            prevArrow.className = 'carousel-arrow prev';
            prevArrow.innerHTML = '<i class="bi bi-chevron-left"></i>';
            
            const nextArrow = document.createElement('div');
            nextArrow.className = 'carousel-arrow next';
            nextArrow.innerHTML = '<i class="bi bi-chevron-right"></i>';
            
            arrowsDiv.appendChild(prevArrow);
            arrowsDiv.appendChild(nextArrow);
            carouselContainer.appendChild(arrowsDiv);
        }
        
        // Add pagination dots
        if (!document.querySelector('.carousel-pagination')) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'carousel-pagination';
            
            for (let i = 0; i < slides.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.dataset.slide = i;
                paginationDiv.appendChild(dot);
            }
            
            carouselContainer.appendChild(paginationDiv);
        }
        
        // Function to show a specific slide
        function showSlide(n) {
            // Handle edge cases
            if (n >= slides.length) {
                currentSlide = 0;
            } else if (n < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = n;
            }
            
            // Hide all slides
            slides.forEach(slide => {
                slide.style.opacity = 0;
            });
            
            // Show the current slide
            slides[currentSlide].style.opacity = 1;
            
            // Update dot indicators
            document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
        }

        // Event listener for previous arrow
        document.querySelector('.carousel-arrow.prev').addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });
        
        // Event listener for next arrow
        document.querySelector('.carousel-arrow.next').addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });
        
        // Event listeners for pagination dots
        document.querySelectorAll('.carousel-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                showSlide(parseInt(dot.dataset.slide));
            });
        });

        // Add touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        function handleGesture() {
            if (touchEndX < touchStartX - 50) {
                // Swipe left, go to next slide
                showSlide(currentSlide + 1);
            } else if (touchEndX > touchStartX + 50) {
                // Swipe right, go to previous slide
                showSlide(currentSlide - 1);
            }
        }
        
        carouselContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        carouselContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleGesture();
        }, false);
    }

    // Search functionality
    if (searchIcon && searchOverlay && closeSearch) {
        // Open search overlay
        searchIcon.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            siteOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            
            // Focus on search input
            setTimeout(() => {
                const searchInput = searchOverlay.querySelector('input');
                if (searchInput) searchInput.focus();
            }, 400);
        });
        
        // Close search overlay
        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            siteOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close overlays when clicking on the site overlay
    if (siteOverlay) {
        siteOverlay.addEventListener('click', function() {
            if (searchOverlay) searchOverlay.classList.remove('active');
            if (cartSidebar) cartSidebar.classList.remove('active');
            siteOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close overlays with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (searchOverlay) searchOverlay.classList.remove('active');
            if (cartSidebar) cartSidebar.classList.remove('active');
            if (siteOverlay) siteOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Shop Now button functionality
    const shopButtons = document.querySelectorAll('.shop-button');
    shopButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Navigate to the shop page (you can update this URL)
            window.location.href = '#';
        });
    });

    // Product slider functionality for all category sections
    initializeCategorySliders();
    
    // Initialize sustainability facts slider
    initializeSustainabilityFactsSlider();
    
    // Initialize ways to influence slider
    initializeInfluenceSlider();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Skip if it's a dropdown toggle
            if (this.classList.contains('dropdown-toggle')) return;
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip placeholder links
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Get navbar height for offset
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight - 20, // Offset for fixed navbar plus some padding
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize Video Player
    const playButton = document.querySelector('.play-button');
    const videoContainer = document.querySelector('.video-container');
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (playButton && videoContainer && videoPlaceholder) {
        playButton.addEventListener('click', function() {
            // Create and embed video iframe (replace with your actual video URL)
            const videoIframe = document.createElement('iframe');
            videoIframe.setAttribute('src', 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1');
            videoIframe.setAttribute('frameborder', '0');
            videoIframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
            videoIframe.setAttribute('allowfullscreen', '');
            videoIframe.style.width = '100%';
            videoIframe.style.height = '100%';
            videoIframe.style.position = 'absolute';
            videoIframe.style.top = '0';
            videoIframe.style.left = '0';
            
            // Replace placeholder with iframe
            videoContainer.innerHTML = '';
            videoContainer.appendChild(videoIframe);
        });
    }

    // Product icon functionality for all products
    document.querySelectorAll('.product-card').forEach(card => {
        const productImage = card.querySelector('.product-image');
        const productIcons = card.querySelector('.product-icons');
        
        if (productImage && productIcons) {
            // Show icons on hover for desktop
            productImage.addEventListener('mouseenter', function() {
                productIcons.style.opacity = '1';
            });
            
            productImage.addEventListener('mouseleave', function() {
                productIcons.style.opacity = '0';
            });
            
            // Handle touch events for mobile
            productImage.addEventListener('touchstart', function(e) {
                e.preventDefault();
                if (productIcons.style.opacity === '1') {
                    productIcons.style.opacity = '0';
                } else {
                    productIcons.style.opacity = '1';
                }
            });
        }
        
        // Handle icon buttons
        card.querySelectorAll('.icon-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
            });
        });
    });

    // Handle dropdown menus for Collections and Shop
    const dropdownItems = document.querySelectorAll('.nav-links li a i.bi-caret-down-fill');
    
    dropdownItems.forEach(item => {
        const parentLink = item.parentElement;
        const parentLi = parentLink.parentElement;
        
        // Create dropdown content
        const dropdownContent = document.createElement('div');
        dropdownContent.className = 'dropdown-content';
        
        // Add different menu items based on which dropdown it is
        if (parentLink.textContent.includes('Collections')) {
            const menuItems = ['Summer Collection', 'Winter Collection', 'Spring Collection', 'Fall Collection'];
            menuItems.forEach(menuItem => {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = menuItem;
                dropdownContent.appendChild(link);
            });
        } else if (parentLink.textContent.includes('Shop')) {
            const menuItems = ['Women', 'Men', 'Kids', 'Accessories'];
            menuItems.forEach(menuItem => {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = menuItem;
                dropdownContent.appendChild(link);
            });
        }
        
        // Append dropdown content to the list item
        parentLi.appendChild(dropdownContent);
        
        // Toggle dropdown on click
        parentLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close all other dropdowns
            const allDropdowns = document.querySelectorAll('.dropdown-content');
            allDropdowns.forEach(dropdown => {
                if (dropdown !== dropdownContent) {
                    dropdown.classList.remove('show');
                }
            });
            
            // Toggle current dropdown
            dropdownContent.classList.toggle('show');
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.nav-links li a') && !e.target.matches('.nav-links li a i')) {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // Declare all required elements first
    const allProductCards = document.querySelectorAll('.product-card');
    const iconBtns = document.querySelectorAll('.icon-btn');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    const dots = document.querySelectorAll('.dot');
    const productSlider = document.querySelector('.product-slider');

    // Product Slider functionality for Semiformal section
    if (prevArrow && nextArrow && allProductCards.length > 0) {
        // Variables for slider state
        let currentSlideIndex = 0;
        const totalSlides = allProductCards.length;
        const visibleSlides = window.innerWidth > 768 ? 2 : 1; // Show 2 on desktop, 1 on mobile
        const maxSlideIndex = Math.max(0, totalSlides - visibleSlides);
        
        // Initialize slider position
        updateSliderPosition();
        
        // Function to update slider position
        function updateSliderPosition() {
            // Update dots
            dots.forEach((dot, index) => {
                if (index === currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Update product card visibility based on current index
            allProductCards.forEach((card, index) => {
                if (index >= currentSlideIndex && index < currentSlideIndex + visibleSlides) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Enable/disable arrows based on position
            prevArrow.style.opacity = currentSlideIndex === 0 ? '0.5' : '1';
            nextArrow.style.opacity = currentSlideIndex >= maxSlideIndex ? '0.5' : '1';
            prevArrow.style.pointerEvents = currentSlideIndex === 0 ? 'none' : 'auto';
            nextArrow.style.pointerEvents = currentSlideIndex >= maxSlideIndex ? 'none' : 'auto';
        }
        
        // Event listener for window resize
        window.addEventListener('resize', () => {
            const newVisibleSlides = window.innerWidth > 768 ? 2 : 1;
            const newMaxSlideIndex = Math.max(0, totalSlides - newVisibleSlides);
            currentSlideIndex = Math.min(currentSlideIndex, newMaxSlideIndex);
            updateSliderPosition();
        });
        
        // Click event for previous arrow
        prevArrow.addEventListener('click', function() {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSliderPosition();
            }
        });
        
        // Click event for next arrow
        nextArrow.addEventListener('click', function() {
            if (currentSlideIndex < maxSlideIndex) {
                currentSlideIndex++;
                updateSliderPosition();
            }
        });
        
        // Click event for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlideIndex = Math.min(index, maxSlideIndex);
                updateSliderPosition();
            });
        });
        
        // Set up initial styles for the slider
        if (productSlider) {
            const productSliderContainer = productSlider.parentElement;
            productSliderContainer.style.overflow = 'hidden';
            
            productSlider.style.display = 'grid';
            productSlider.style.gridTemplateColumns = `repeat(${totalSlides}, 1fr)`;
            productSlider.style.width = '100%';
            productSlider.style.gap = '20px';
            
            allProductCards.forEach(card => {
                card.style.width = '100%';
                card.style.gridColumn = 'span 1';
            });
        }
    }

    // Sustainability Facts Slider
    const factSlides = document.querySelectorAll('.fact-slide');
    const factDots = document.querySelectorAll('.fact-dot');
    const factPrevBtn = document.querySelector('.facts-prev');
    const factNextBtn = document.querySelector('.facts-next');
    let currentFactIndex = 0;
    
    // Function to show a specific fact
    function showFact(index) {
        // Hide all facts
        factSlides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Update dots
        factDots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Show the selected fact
        factSlides[index].classList.add('active');
        currentFactIndex = index;
    }
    
    // Previous button click
    if (factPrevBtn) {
        factPrevBtn.addEventListener('click', function() {
            const newIndex = (currentFactIndex - 1 + factSlides.length) % factSlides.length;
            showFact(newIndex);
        });
    }
    
    // Next button click
    if (factNextBtn) {
        factNextBtn.addEventListener('click', function() {
            const newIndex = (currentFactIndex + 1) % factSlides.length;
            showFact(newIndex);
        });
    }
    
    // Dot navigation
    factDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showFact(index);
        });
    });
    
    // Auto-rotate facts every 7 seconds
    if (factSlides.length > 1) {
        setInterval(function() {
            const newIndex = (currentFactIndex + 1) % factSlides.length;
            showFact(newIndex);
        }, 7000);
    }

    // Function to initialize the influence slider - UPDATED FOR MOBILE
    function initializeInfluenceSlider() {
        const influenceSlides = document.querySelectorAll('.influence-slide');
        const influencePrev = document.querySelector('.influence-prev');
        const influenceNext = document.querySelector('.influence-next');
        const influenceDots = document.querySelectorAll('.influence-dots .influence-dot');
        const influenceSlidesContainer = document.querySelector('.influence-slides');
        const influenceDividers = document.querySelectorAll('.influence-divider');
        
        if (!influenceSlides.length || !influencePrev || !influenceNext || !influenceDots.length || !influenceSlidesContainer) return;
        
        // We have 3 pairs of slides (6 cards total)
        let currentIndex = 0;
        const totalPairs = 3;
        
        function updateSlider() {
            // Hide all slides first
            influenceSlides.forEach(slide => {
                slide.style.display = 'none';
            });
            
            // Hide all dividers
            influenceDividers.forEach(divider => {
                divider.style.display = 'none';
            });
            
            // Show current pair of slides
            const startIndex = currentIndex * 2;
            if (influenceSlides[startIndex]) {
                influenceSlides[startIndex].style.display = 'block';
            }
            
            if (influenceSlides[startIndex + 1]) {
                influenceSlides[startIndex + 1].style.display = 'block';
            }
            
            // Show divider between current pair
            if (influenceDividers[currentIndex]) {
                influenceDividers[currentIndex].style.display = 'block';
            }
            
            // Update dots
            influenceDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Update arrow states
            influencePrev.style.opacity = currentIndex === 0 ? '0.5' : '1';
            influencePrev.disabled = currentIndex === 0;
            
            influenceNext.style.opacity = currentIndex >= totalPairs - 1 ? '0.5' : '1';
            influenceNext.disabled = currentIndex >= totalPairs - 1;
        }
        
        // Initial setup
        updateSlider();
        
        // Previous button click
        influencePrev.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });
        
        // Next button click
        influenceNext.addEventListener('click', () => {
            if (currentIndex < totalPairs - 1) {
                currentIndex++;
                updateSlider();
            }
        });
        
        // Dot navigation
        influenceDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateSlider();
            });
        });
        
        // Handle responsive behavior
        window.addEventListener('resize', () => {
            updateSlider();
        });
        
        // Add touch swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        influenceSlidesContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        influenceSlidesContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            
            if (touchEndX < touchStartX - 50 && currentIndex < totalPairs - 1) {
                // Swipe left, go to next slide
                currentIndex++;
                updateSlider();
            } else if (touchEndX > touchStartX + 50 && currentIndex > 0) {
                // Swipe right, go to previous slide
                currentIndex--;
                updateSlider();
            }
        }, false);
    }

    // Initialize all category carousels
    const carouselSections = [
        {
            name: 'semiformal',
            prevArrow: document.querySelector('.semiformal-prev'),
            nextArrow: document.querySelector('.semiformal-next'),
            productCards: document.querySelectorAll('.semiformal-slider .product-card'),
            dots: document.querySelectorAll('.semiformal-dots .dot')
        },
        {
            name: 'formal',
            prevArrow: document.querySelector('.formal-prev'),
            nextArrow: document.querySelector('.formal-next'),
            productCards: document.querySelectorAll('.formal-slider .product-card'),
            dots: document.querySelectorAll('.formal-dots .dot')
        },
        {
            name: 'casual',
            prevArrow: document.querySelector('.casual-prev'),
            nextArrow: document.querySelector('.casual-next'),
            productCards: document.querySelectorAll('.casual-slider .product-card'),
            dots: document.querySelectorAll('.casual-dots .dot')
        },
        {
            name: 'ethnic',
            prevArrow: document.querySelector('.ethnic-prev'),
            nextArrow: document.querySelector('.ethnic-next'),
            productCards: document.querySelectorAll('.ethnic-slider .product-card'),
            dots: document.querySelectorAll('.ethnic-dots .dot')
        },
        {
            name: 'accessories',
            prevArrow: document.querySelector('.accessories-prev'),
            nextArrow: document.querySelector('.accessories-next'),
            productCards: document.querySelectorAll('.accessories-slider .product-card'),
            dots: document.querySelectorAll('.accessories-dots .dot')
        }
    ];

    // Initialize carousels for all sections
    carouselSections.forEach(section => {
        initializeCarousel(section);
    });

    // Function to initialize a carousel
    function initializeCarousel(section) {
        if (!section.prevArrow || !section.nextArrow || section.productCards.length === 0) {
            return;
        }

        // Variables for slider state
        let currentSlideIndex = 0;
        const totalSlides = section.productCards.length;
        // Responsive: Show 1 on mobile, 2 on larger screens
        const getVisibleSlides = () => window.innerWidth <= 767 ? 1 : 2;
        let visibleSlides = getVisibleSlides();
        let maxSlideIndex = Math.max(0, totalSlides - visibleSlides);
        
        // Initialize slider position
        updateSliderPosition();
        
        // Function to update slider position
        function updateSliderPosition() {
            // Update dots
            section.dots.forEach((dot, index) => {
                if (index === currentSlideIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            
            // Update product card visibility based on current index
            section.productCards.forEach((card, index) => {
                if (index >= currentSlideIndex && index < currentSlideIndex + visibleSlides) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Enable/disable arrows based on position
            section.prevArrow.style.opacity = currentSlideIndex === 0 ? '0.5' : '1';
            section.nextArrow.style.opacity = currentSlideIndex >= maxSlideIndex ? '0.5' : '1';
            section.prevArrow.style.pointerEvents = currentSlideIndex === 0 ? 'none' : 'auto';
            section.nextArrow.style.pointerEvents = currentSlideIndex >= maxSlideIndex ? 'none' : 'auto';
        }
        
        // Event listener for window resize
        window.addEventListener('resize', () => {
            const newVisibleSlides = getVisibleSlides();
            if (newVisibleSlides !== visibleSlides) {
                visibleSlides = newVisibleSlides;
                maxSlideIndex = Math.max(0, totalSlides - visibleSlides);
                // Ensure current index is valid after resize
                currentSlideIndex = Math.min(currentSlideIndex, maxSlideIndex);
                updateSliderPosition();
            }
        });
        
        // Click event for previous arrow
        section.prevArrow.addEventListener('click', function() {
            if (currentSlideIndex > 0) {
                currentSlideIndex--;
                updateSliderPosition();
            }
        });
        
        // Click event for next arrow
        section.nextArrow.addEventListener('click', function() {
            if (currentSlideIndex < maxSlideIndex) {
                currentSlideIndex++;
                updateSliderPosition();
            }
        });
        
        // Click event for dots
        section.dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlideIndex = Math.min(index, maxSlideIndex);
                updateSliderPosition();
            });
        });

        // Set up product icon hover functionality
        section.productCards.forEach(card => {
            const productImage = card.querySelector('.product-image');
            const productIcons = card.querySelector('.product-icons');
            
            if (productImage && productIcons) {
                // Touch support for mobile devices
                productImage.addEventListener('touchstart', function() {
                    // Toggle icon visibility
                    if (productIcons.style.opacity === '1') {
                        productIcons.style.opacity = '0';
                    } else {
                        productIcons.style.opacity = '1';
                    }
                });
            }
        });

        // Add click event listeners to icons within this section
        const iconBtns = section.productCards[0]?.querySelectorAll('.icon-btn') || [];
        
        iconBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent triggering parent events
                
                if (btn.classList.contains('cart-btn')) {
                    alert('Added to cart!');
                } else if (btn.classList.contains('view-btn')) {
                    alert('Quick view functionality to be implemented');
                } else if (btn.classList.contains('wishlist-btn')) {
                    if (btn.classList.contains('active')) {
                        btn.classList.remove('active');
                        btn.style.backgroundColor = '#333';
                        alert('Removed from wishlist!');
                    } else {
                        btn.classList.add('active');
                        btn.style.backgroundColor = '#ff6f61';
                        alert('Added to wishlist!');
                    }
                }
            });
        });
    }

    // Function to initialize all category sliders
    function initializeCategorySliders() {
        const categorySliders = [
            {
                container: '.semiformal-section',
                prevBtn: '.semiformal-prev',
                nextBtn: '.semiformal-next',
                slider: '.semiformal-slider',
                dots: '.semiformal-dots .dot'
            },
            {
                container: '.casual-section',
                prevBtn: '.casual-prev',
                nextBtn: '.casual-next',
                slider: '.casual-slider',
                dots: '.casual-dots .dot'
            },
            {
                container: '.ethnic-section',
                prevBtn: '.ethnic-prev',
                nextBtn: '.ethnic-next',
                slider: '.ethnic-slider',
                dots: '.ethnic-dots .dot'
            },
            {
                container: '.accessories-section',
                prevBtn: '.accessories-prev',
                nextBtn: '.accessories-next',
                slider: '.accessories-slider',
                dots: '.accessories-dots .dot'
            }
        ];
        
        categorySliders.forEach(slider => {
            initializeCarousel(slider);
        });
    }
    
    // Function to initialize a specific category slider
    function initializeCarousel(sliderConfig) {
        const container = document.querySelector(sliderConfig.container);
        if (!container) return;
        
        const prevBtn = container.querySelector(sliderConfig.prevBtn);
        const nextBtn = container.querySelector(sliderConfig.nextBtn);
        const slider = container.querySelector(sliderConfig.slider);
        const dots = container.querySelectorAll(sliderConfig.dots);
        const slides = slider.querySelectorAll('.product-card');
        
        if (!prevBtn || !nextBtn || !slider || slides.length === 0) return;
        
        let currentIndex = 0;
        const totalSlides = slides.length;
        // Responsive: 1 card on mobile, 2 on tablet/desktop
        let cardsPerSlide = getCardsPerSlide();
        let maxIndex = Math.max(0, Math.ceil(totalSlides / cardsPerSlide) - 1);
        
        // Helper function to determine cards per slide based on screen size
        function getCardsPerSlide() {
            return window.innerWidth <= 767 ? 1 : 2;
        }
        
        function updateSliderPosition() {
            // Update active dot
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Hide all slides first
            slides.forEach(slide => {
                slide.style.display = 'none';
            });
            
            // Show only the current slide's cards (responsive number of cards per slide)
            const startCardIndex = currentIndex * cardsPerSlide;
            for (let i = 0; i < cardsPerSlide; i++) {
                const cardIndex = startCardIndex + i;
                if (cardIndex < totalSlides) {
                    slides[cardIndex].style.display = 'block';
                }
            }
            
            // Update button states
            prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }
        
        // Set initial state
        updateSliderPosition();
        
        // Add event listeners
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSliderPosition();
            }
        });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (index <= maxIndex) {
                    currentIndex = index;
                    updateSliderPosition();
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Update cards per slide based on screen size
            const newCardsPerSlide = getCardsPerSlide();
            
            if (newCardsPerSlide !== cardsPerSlide) {
                cardsPerSlide = newCardsPerSlide;
                maxIndex = Math.max(0, Math.ceil(totalSlides / cardsPerSlide) - 1);
                
                // Ensure current index is valid after resize
                currentIndex = Math.min(currentIndex, maxIndex);
                updateSliderPosition();
            }
        });
    }
    
    // Function to initialize the sustainability facts slider - UPDATED FOR MOBILE
    function initializeSustainabilityFactsSlider() {
        const factsSlides = document.querySelectorAll('.fact-slide');
        const factsPrev = document.querySelector('.facts-prev');
        const factsNext = document.querySelector('.facts-next');
        const factsDots = document.querySelectorAll('.facts-dots .fact-dot');
        
        if (!factsSlides.length || !factsPrev || !factsNext || !factsDots.length) return;
        
        let currentFactIndex = 0;
        const totalFacts = factsSlides.length;
        
        function showFact(index) {
            // Hide all facts
            factsSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Update dots
            factsDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            // Show selected fact
            factsSlides[index].classList.add('active');
        }
        
        // Initialize dots
        factsDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentFactIndex = index;
                showFact(currentFactIndex);
            });
        });
        
        // Previous button
        factsPrev.addEventListener('click', () => {
            currentFactIndex = (currentFactIndex - 1 + totalFacts) % totalFacts;
            showFact(currentFactIndex);
        });
        
        // Next button
        factsNext.addEventListener('click', () => {
            currentFactIndex = (currentFactIndex + 1) % totalFacts;
            showFact(currentFactIndex);
        });

        // Add touch swipe support for facts slider
        const factsSlider = document.querySelector('.facts-slider');
        if (factsSlider) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            function handleSwipe() {
                if (touchEndX < touchStartX - 50) {
                    // Swipe left, go to next fact
                    currentFactIndex = (currentFactIndex + 1) % totalFacts;
                    showFact(currentFactIndex);
                } else if (touchEndX > touchStartX + 50) {
                    // Swipe right, go to previous fact
                    currentFactIndex = (currentFactIndex - 1 + totalFacts) % totalFacts;
                    showFact(currentFactIndex);
                }
            }
            
            factsSlider.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, false);
            
            factsSlider.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, false);
        }
    }
});


const footerEl = document.getElementById("footer-el");
if (footerEl) {
    footerEl.textContent = new Date().getFullYear();
}
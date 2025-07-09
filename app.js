// GCP Vertex AI Guide - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initSmoothScrolling();
    initActiveSection();
    initPrintButton();
    initCopyCodeBlocks();
    initAccessibilityEnhancements();
    initImageEnhancements();
    initProgressIndicator();
    initSidebarToggle();
});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-list a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, `#${targetId}`);
                
                // Focus the target section for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Remove tabindex after focus
                setTimeout(() => {
                    targetElement.removeAttribute('tabindex');
                }, 100);
            }
        });
    });
}

// Highlight active section in navigation
function initActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-list a');
    
    // Create intersection observer to track visible sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;
                
                // Remove active class from all nav links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-list a[href="#${activeId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-20% 0px -80% 0px'
    });
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Add print button functionality
function initPrintButton() {
    // Create print button
    const printButton = document.createElement('button');
    printButton.innerHTML = '📄 Print Guide';
    printButton.className = 'btn btn--secondary print-btn';
    printButton.setAttribute('aria-label', 'Print this guide');
    printButton.type = 'button';
    
    // Add print button to header
    const header = document.querySelector('.header .container');
    if (header) {
        // Make header position relative for absolute positioning of button
        header.style.position = 'relative';
        
        printButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.print();
        });
        
        header.appendChild(printButton);
    }
    
    // Add keyboard shortcut for printing
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
}

// Add copy functionality to code blocks
function initCopyCodeBlocks() {
    const codeBlocks = document.querySelectorAll('code');
    
    codeBlocks.forEach(code => {
        // Only add copy button to code blocks that look like they contain commands or file paths
        const text = code.textContent.trim();
        if (text.includes('.') || text.includes('/') || text.includes('→')) {
            const copyBtn = document.createElement('button');
            copyBtn.innerHTML = '📋';
            copyBtn.className = 'copy-btn';
            copyBtn.title = 'Copy to clipboard';
            copyBtn.setAttribute('aria-label', 'Copy code to clipboard');
            copyBtn.type = 'button';
            
            // Position relative to code block
            code.style.position = 'relative';
            copyBtn.style.position = 'absolute';
            copyBtn.style.top = '2px';
            copyBtn.style.right = '2px';
            copyBtn.style.background = 'var(--color-primary)';
            copyBtn.style.color = 'white';
            copyBtn.style.border = 'none';
            copyBtn.style.borderRadius = '3px';
            copyBtn.style.padding = '2px 6px';
            copyBtn.style.fontSize = '12px';
            copyBtn.style.cursor = 'pointer';
            copyBtn.style.opacity = '0';
            copyBtn.style.transition = 'opacity 0.2s';
            
            code.appendChild(copyBtn);
            
            // Show copy button on hover
            code.addEventListener('mouseenter', () => {
                copyBtn.style.opacity = '1';
            });
            
            code.addEventListener('mouseleave', () => {
                copyBtn.style.opacity = '0';
            });
            
            // Copy functionality
            copyBtn.addEventListener('click', async function(e) {
                e.stopPropagation();
                try {
                    await navigator.clipboard.writeText(text);
                    copyBtn.innerHTML = '✅';
                    copyBtn.title = 'Copied!';
                    
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋';
                        copyBtn.title = 'Copy to clipboard';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    copyBtn.innerHTML = '❌';
                    setTimeout(() => {
                        copyBtn.innerHTML = '📋';
                    }, 2000);
                }
            });
        }
    });
}

// Image enhancement features
function initImageEnhancements() {
    const images = document.querySelectorAll('.step-image');
    
    images.forEach(image => {
        // Ensure image has proper loading attributes
        image.loading = 'lazy';
        image.style.cursor = 'pointer';
        
        // Add loading state
        image.addEventListener('load', function() {
            this.classList.add('loaded');
            this.style.opacity = '1';
        });
        
        // Add error handling
        image.addEventListener('error', function() {
            this.classList.add('error');
            const container = this.closest('.image-container');
            if (container) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'image-error';
                errorMsg.innerHTML = '⚠️ Image failed to load - Click to try opening in new tab';
                errorMsg.style.padding = 'var(--space-16)';
                errorMsg.style.color = 'var(--color-error)';
                errorMsg.style.textAlign = 'center';
                errorMsg.style.background = 'var(--color-surface)';
                errorMsg.style.cursor = 'pointer';
                
                // Add click handler to error message
                errorMsg.addEventListener('click', function() {
                    window.open(image.src, '_blank');
                });
                
                container.appendChild(errorMsg);
            }
        });
        
        // Add keyboard navigation for images
        image.setAttribute('tabindex', '0');
        image.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.open(this.src, '_blank');
            }
        });
        
        // Add click handler to open image in new tab
        image.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(this.src, '_blank');
        });
    });
}

// Accessibility enhancements
function initAccessibilityEnhancements() {
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.zIndex = '999';
    skipLink.style.padding = '8px';
    skipLink.style.background = 'var(--color-primary)';
    skipLink.style.color = 'white';
    skipLink.style.textDecoration = 'none';
    
    skipLink.addEventListener('focus', function() {
        this.style.left = '0';
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.left = '-9999px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main id to main element
    const main = document.querySelector('.main');
    if (main) {
        main.id = 'main';
    }
    
    // Enhance heading hierarchy
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
        const heading = section.querySelector('h2');
        if (heading) {
            heading.setAttribute('id', `section-${index + 1}`);
        }
    });
    
    // Add live region for dynamic content updates
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-9999px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
    
    // Announce section changes
    const navLinks = document.querySelectorAll('.nav-list a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const sectionTitle = this.textContent;
            setTimeout(() => {
                liveRegion.textContent = `Navigated to ${sectionTitle}`;
            }, 100);
        });
    });
}

// Handle URL hash on page load
window.addEventListener('load', function() {
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
});

// Add progress indicator
function initProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'var(--color-primary)';
    progressBar.style.zIndex = '1000';
    progressBar.style.transition = 'width 0.3s ease';
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Initialize sidebar toggle functionality
function initSidebarToggle() {
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('navigationSidebar');
    const navCloseBtn = document.getElementById('navCloseBtn');
    const body = document.body;
    
    function closeSidebar() {
        sidebar.classList.remove('sidebar-open');
        navToggle.classList.remove('active');
        body.classList.remove('sidebar-open');
        navToggle.setAttribute('aria-expanded', 'false');
        
        // Announce to screen readers
        const liveRegion = document.querySelector('[aria-live="polite"]');
        if (liveRegion) {
            liveRegion.textContent = 'Navigation closed';
        }
    }
    
    function openSidebar() {
        sidebar.classList.add('sidebar-open');
        navToggle.classList.add('active');
        body.classList.add('sidebar-open');
        navToggle.setAttribute('aria-expanded', 'true');
        
        // Announce to screen readers
        const liveRegion = document.querySelector('[aria-live="polite"]');
        if (liveRegion) {
            liveRegion.textContent = 'Navigation opened';
        }
    }
    
    if (navToggle && sidebar) {
        // Navigation toggle click - single toggle function
        navToggle.addEventListener('click', function() {
            const isOpen = sidebar.classList.contains('sidebar-open');
            
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
        
        // Close button click
        if (navCloseBtn) {
            navCloseBtn.addEventListener('click', function() {
                closeSidebar();
                navToggle.focus();
            });
        }
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !navToggle.contains(e.target)) {
                if (sidebar.classList.contains('sidebar-open')) {
                    closeSidebar();
                }
            }
        });
        
        // Close sidebar when pressing Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('sidebar-open')) {
                closeSidebar();
                navToggle.focus();
            }
        });
        
        // Close sidebar when clicking on a link (mobile)
        const navLinks = sidebar.querySelectorAll('.nav-list a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeSidebar();
                }
            });
        });
        
        // Set initial aria-expanded attribute
        navToggle.setAttribute('aria-expanded', 'false');
        
        // Trap focus within sidebar when open
        sidebar.addEventListener('keydown', function(e) {
            if (e.key === 'Tab' && sidebar.classList.contains('sidebar-open')) {
                const focusableElements = sidebar.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
}

// Add CSS for active nav link and other dynamic styles
const style = document.createElement('style');
style.textContent = `
    .nav-list a.active {
        background: var(--color-primary);
        color: var(--color-btn-primary-text);
    }
    
    .print-btn {
        position: absolute;
        top: 50%;
        right: 0;
        transform: translateY(-50%);
        font-size: var(--font-size-sm);
        padding: var(--space-6) var(--space-12);
        white-space: nowrap;
    }
    
    .skip-link:focus {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        z-index: 999;
    }
    
    .step-image {
        opacity: 0.8;
        transition: opacity 0.3s ease;
    }
    
    .step-image.loaded {
        opacity: 1;
    }
    
    .step-image.error {
        opacity: 0.5;
        filter: grayscale(100%);
    }
    
    .step-image:hover {
        opacity: 0.9;
        transform: scale(1.01);
        transition: all 0.2s ease;
    }
    
    .step-image:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: 2px;
    }
    
    .image-error {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        border-radius: var(--radius-base);
    }
    
    .image-error:hover {
        background: var(--color-secondary-hover);
    }
    
    @media print {
        .print-btn,
        .progress-bar,
        .copy-btn {
            display: none !important;
        }
        
        .step-image {
            cursor: default !important;
            transform: none !important;
        }
    }
    
    @media (max-width: 768px) {
        .print-btn {
            position: static;
            transform: none;
            margin-top: var(--space-16);
            width: 100%;
        }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .step-image {
            transition: none !important;
        }
        
        .step-image:hover {
            transform: none !important;
        }
    }
`;
document.head.appendChild(style);

// Add smooth scroll behavior for all anchor links
document.addEventListener('DOMContentLoaded', function() {
    const allLinks = document.querySelectorAll('a[href^="#"]');
    
    allLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL
                    history.pushState(null, null, href);
                }
            }
        });
    });
});

// Force image loading on page load
window.addEventListener('load', function() {
    const images = document.querySelectorAll('.step-image');
    images.forEach(image => {
        // Force reload if image hasn't loaded
        if (!image.complete || image.naturalHeight === 0) {
            const originalSrc = image.src;
            image.src = '';
            image.src = originalSrc;
        }
    });
});
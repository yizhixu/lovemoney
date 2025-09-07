// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add click events to navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Add scroll effect to navigation
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(15px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });

    // Add animation on scroll for content sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.8s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    // Observe all content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });

    // Add interactive effects to cards
    const cards = document.querySelectorAll('.guide-card, .character-card, .tip-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effect to items
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        item.addEventListener('click', function() {
            // Add a brief highlight effect
            this.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            this.style.color = 'white';
            this.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                this.style.background = 'linear-gradient(135deg, #f8f9ff, #f0f2ff)';
                this.style.color = '';
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });

    // Add floating animation to hero background
    const hero = document.querySelector('.hero');
    if (hero) {
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s infinite linear;
                pointer-events: none;
            `;
            hero.appendChild(particle);
        }
    }

    // Add search functionality (placeholder)
    const searchButton = document.createElement('button');
    searchButton.innerHTML = '🔍 搜索攻略';
    searchButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        padding: 15px 20px;
        border-radius: 50px;
        cursor: pointer;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;

    searchButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.05)';
        this.style.boxShadow = '0 15px 40px rgba(102, 126, 234, 0.4)';
    });

    searchButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
    });

    searchButton.addEventListener('click', function() {
        alert('搜索功能正在开发中，敬请期待！🚀');
    });

    document.body.appendChild(searchButton);

    // Add mobile menu toggle
    const mobileMenuButton = document.createElement('button');
    mobileMenuButton.innerHTML = '☰';
    mobileMenuButton.style.cssText = `
        display: none;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #333;
        cursor: pointer;
        padding: 10px;
    `;

    // Insert mobile menu button in navigation
    const navContainer = document.querySelector('.nav-container');
    navContainer.appendChild(mobileMenuButton);

    // Mobile menu functionality
    mobileMenuButton.addEventListener('click', function() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu.style.display === 'flex') {
            navMenu.style.display = 'none';
        } else {
            navMenu.style.display = 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '70px';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.background = 'rgba(255, 255, 255, 0.98)';
            navMenu.style.padding = '20px';
            navMenu.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Show mobile menu button on small screens
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuButton.style.display = 'block';
        } else {
            mobileMenuButton.style.display = 'none';
            document.querySelector('.nav-menu').style.display = 'flex';
        }
    }

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    // Add progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.3s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });

    console.log('🎮 LoveMoney 攻略站已加载完成！');
    console.log('💡 提示：点击各个卡片可以查看更多详细信息');
});
// LMRN.tools - Love, Money, Rock'n'Roll Route Calculator
// Interactive functionality for the LMRNR guide site

// Game data structure
const gameData = {
    endings: [
        {
            id: 'true-love',
            name: 'Истинная любовь',
            requirements: { ellie: 80, money: 50 },
            exclusions: { hiro: 60, kat: 60, nikolai: 60 }
        },
        {
            id: 'rockstar',
            name: 'Рок-звезда',
            requirements: { ellie: 60, hiro: 60, kat: 60, nikolai: 60, money: 100 }
        },
        {
            id: 'business',
            name: 'Бизнес-империя',
            requirements: { money: 150 },
            exclusions: { ellie: 50, hiro: 50, kat: 50, nikolai: 50 }
        },
        {
            id: 'ellie-romance',
            name: 'Романс с Элли',
            requirements: { ellie: 70, money: 30 }
        },
        {
            id: 'hiro-romance',
            name: 'Романс с Хиро',
            requirements: { hiro: 70, money: 30 }
        },
        {
            id: 'kat-romance',
            name: 'Романс с Кэт',
            requirements: { kat: 70, money: 30 }
        },
        {
            id: 'nikolai-romance',
            name: 'Романс с Николаем',
            requirements: { nikolai: 70, money: 30 }
        },
        {
            id: 'secret',
            name: 'Секретная концовка',
            requirements: { money: 80, ellie: 40, hiro: 40, kat: 40, nikolai: 40 }
        }
    ]
};

// Global state
let currentStats = {
    money: 0,
    ellie: 0,
    hiro: 0,
    kat: 0,
    nikolai: 0
};

let progressData = {
    endings: new Set(),
    cg: new Set(),
    achievements: new Set()
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCalculator();
    initializeWalkthrough();
    initializeProgressTracker();
    initializeUI();
    loadProgressData();
    
    console.log('🎸 LMRN.tools загружен успешно!');
});

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    }

    // Header scroll effect
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(15px)';
        }
        lastScrollY = window.scrollY;
    });

    // Progress indicator
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(90deg, #1a1a2e, #16213e, #0f3460);
        z-index: 9999;
        transition: width 0.3s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = Math.min(scrolled, 100) + '%';
    });
}

// Route calculator functionality
function initializeCalculator() {
    const choiceInputs = document.querySelectorAll('.choice-option input[type="radio"]');
    const resetButton = document.getElementById('resetChoices');

    // Add event listeners to choice inputs
    choiceInputs.forEach(input => {
        input.addEventListener('change', function() {
            updateStats();
            updateEndingsDisplay();
            updateRecommendations();
        });
    });

    // Reset button functionality
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            choiceInputs.forEach(input => input.checked = false);
            resetStats();
            updateStatsDisplay();
            updateEndingsDisplay();
            updateRecommendations();
        });
    }

    // Initial update
    updateStatsDisplay();
}

function updateStats() {
    // Reset stats
    currentStats = {
        money: 0,
        ellie: 0,
        hiro: 0,
        kat: 0,
        nikolai: 0
    };

    // Calculate stats from selected choices
    const selectedChoices = document.querySelectorAll('.choice-option input[type="radio"]:checked');
    selectedChoices.forEach(choice => {
        // Add money
        const money = parseInt(choice.dataset.money) || 0;
        currentStats.money += money;

        // Add love points to all characters if specified
        const love = parseInt(choice.dataset.love) || 0;
        if (love > 0) {
            currentStats.ellie += love;
            currentStats.hiro += love;
            currentStats.kat += love;
            currentStats.nikolai += love;
        }

        // Add individual character points
        ['ellie', 'hiro', 'kat', 'nikolai'].forEach(character => {
            const points = parseInt(choice.dataset[character]) || 0;
            currentStats[character] += points;
        });
    });

    // Ensure stats don't go below 0
    Object.keys(currentStats).forEach(key => {
        currentStats[key] = Math.max(0, currentStats[key]);
    });

    updateStatsDisplay();
}

function resetStats() {
    currentStats = {
        money: 0,
        ellie: 0,
        hiro: 0,
        kat: 0,
        nikolai: 0
    };
}

function updateStatsDisplay() {
    // Update stat values and progress bars
    Object.keys(currentStats).forEach(stat => {
        const valueElement = document.getElementById(`${stat}-value`);
        const barElement = document.getElementById(`${stat}-bar`);
        
        if (valueElement) {
            valueElement.textContent = currentStats[stat];
        }
        
        if (barElement) {
            const maxValue = stat === 'money' ? 200 : 100;
            const percentage = Math.min((currentStats[stat] / maxValue) * 100, 100);
            barElement.style.width = percentage + '%';
        }
    });
}

function updateEndingsDisplay() {
    const endingsListElement = document.getElementById('endings-list');
    if (!endingsListElement) return;

    const availableEndings = getAvailableEndings();
    
    if (availableEndings.length === 0) {
        endingsListElement.innerHTML = '<p class="no-endings">Сделайте выборы, чтобы увидеть доступные концовки</p>';
        return;
    }

    const endingsHTML = availableEndings.map(ending => {
        return `<div class="available-ending">
            <span class="ending-name">🎭 ${ending.name}</span>
            <div class="ending-progress">
                ${getEndingProgress(ending)}
            </div>
        </div>`;
    }).join('');

    endingsListElement.innerHTML = endingsHTML;
}

function getAvailableEndings() {
    return gameData.endings.filter(ending => {
        // Check if all requirements are met
        const requirementsMet = Object.keys(ending.requirements).every(stat => {
            return currentStats[stat] >= ending.requirements[stat];
        });

        // Check if no exclusions are violated
        const exclusionsRespected = !ending.exclusions || Object.keys(ending.exclusions).every(stat => {
            return currentStats[stat] < ending.exclusions[stat];
        });

        return requirementsMet && exclusionsRespected;
    });
}

function getEndingProgress(ending) {
    const requirements = ending.requirements;
    const progress = Object.keys(requirements).map(stat => {
        const current = currentStats[stat];
        const required = requirements[stat];
        const percentage = Math.min((current / required) * 100, 100);
        return `<div class="req-progress">
            <span class="req-name">${getStatName(stat)}</span>
            <span class="req-value">${current}/${required}</span>
        </div>`;
    }).join('');

    return progress;
}

function getStatName(stat) {
    const names = {
        money: '💰 Деньги',
        ellie: '🎤 Элли',
        hiro: '🥁 Хиро',
        kat: '🎸 Кэт',
        nikolai: '🎹 Николай'
    };
    return names[stat] || stat;
}

function updateRecommendations() {
    const recommendationsElement = document.getElementById('recommendations');
    if (!recommendationsElement) return;

    const availableEndings = getAvailableEndings();
    const closestEnding = getClosestEnding();

    let recommendationsHTML = '';

    if (availableEndings.length > 0) {
        recommendationsHTML = `
            <div class="recommendation">
                <h5>✅ Доступные концовки: ${availableEndings.length}</h5>
                <p>Вы можете достичь следующих концовок с текущими параметрами!</p>
            </div>
        `;
    } else if (closestEnding) {
        const missingRequirements = getMissingRequirements(closestEnding);
        recommendationsHTML = `
            <div class="recommendation">
                <h5>🎯 Ближайшая цель: ${closestEnding.name}</h5>
                <p>Вам нужно:</p>
                <ul class="missing-reqs">
                    ${missingRequirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>
        `;
    } else {
        recommendationsHTML = `
            <div class="recommendation">
                <h5>🚀 Начните прохождение</h5>
                <p>Делайте выборы в главах, чтобы получить персонализированные рекомендации.</p>
            </div>
        `;
    }

    recommendationsElement.innerHTML = recommendationsHTML;
}

function getClosestEnding() {
    let closestEnding = null;
    let minDistance = Infinity;

    gameData.endings.forEach(ending => {
        const distance = getEndingDistance(ending);
        if (distance < minDistance && distance > 0) {
            minDistance = distance;
            closestEnding = ending;
        }
    });

    return closestEnding;
}

function getEndingDistance(ending) {
    let distance = 0;
    
    Object.keys(ending.requirements).forEach(stat => {
        const required = ending.requirements[stat];
        const current = currentStats[stat];
        if (current < required) {
            distance += required - current;
        }
    });

    // Check exclusions
    if (ending.exclusions) {
        Object.keys(ending.exclusions).forEach(stat => {
            const limit = ending.exclusions[stat];
            const current = currentStats[stat];
            if (current >= limit) {
                distance += 1000; // Heavy penalty for violating exclusions
            }
        });
    }

    return distance;
}

function getMissingRequirements(ending) {
    const missing = [];
    
    Object.keys(ending.requirements).forEach(stat => {
        const required = ending.requirements[stat];
        const current = currentStats[stat];
        if (current < required) {
            const needed = required - current;
            missing.push(`${getStatName(stat)}: +${needed} (текущее: ${current}/${required})`);
        }
    });

    return missing;
}

// Walkthrough functionality
function initializeWalkthrough() {
    const chapterButtons = document.querySelectorAll('.chapter-btn');
    const chapters = document.querySelectorAll('.chapter');
    
    chapterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const chapterNum = this.dataset.chapter;
            
            // Update active button
            chapterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding chapter
            chapters.forEach(chapter => {
                chapter.style.display = 'none';
            });
            
            const targetChapter = document.getElementById(`chapter-${chapterNum}`);
            if (targetChapter) {
                targetChapter.style.display = 'block';
            }
        });
    });

    // Spoiler buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('spoiler-btn')) {
            e.preventDefault();
            const spoilerContent = e.target.nextElementSibling;
            if (spoilerContent && spoilerContent.classList.contains('spoiler-content')) {
                spoilerContent.classList.toggle('visible');
                e.target.textContent = spoilerContent.classList.contains('visible') 
                    ? '🔍 Скрыть спойлеры' 
                    : '🔍 Показать подробности (спойлеры)';
            }
        }
    });
}

// Progress tracker functionality
function initializeProgressTracker() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const targetTab = document.getElementById(`${tabName}-tab`);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    // Progress checkboxes
    setupProgressCheckboxes('.ending-checkbox', 'endings');
    setupProgressCheckboxes('.cg-checkbox', 'cg');
    setupProgressCheckboxes('.achievement-checkbox', 'achievements');

    // Share progress button
    const shareBtn = document.getElementById('shareProgress');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareProgress);
    }

    // Filter buttons for endings
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter endings
            filterEndings(filter);
        });
    });

    updateProgressStats();
}

function setupProgressCheckboxes(selector, category) {
    const checkboxes = document.querySelectorAll(selector);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const item = this.closest('[data-ending], [data-character], .achievement-item, .cg-item');
            if (item) {
                const id = item.dataset.ending || item.dataset.character || 
                          item.querySelector('h4')?.textContent || 
                          item.querySelector('p')?.textContent;
                
                if (this.checked) {
                    progressData[category].add(id);
                } else {
                    progressData[category].delete(id);
                }
                
                updateProgressStats();
                saveProgressData();
                updateStatusText(item, this.checked);
            }
        });
    });
}

function updateStatusText(item, completed) {
    const statusText = item.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = completed ? 'Получено' : 'Не получено';
        statusText.style.color = completed ? '#4caf50' : '#666';
    }
}

function updateProgressStats() {
    // Update endings progress
    const endingsCompleted = progressData.endings.size;
    const endingsTotal = 12; // Total endings in the game
    const endingsPercent = Math.round((endingsCompleted / endingsTotal) * 100);
    
    updateProgressDisplay('endings', endingsCompleted, endingsTotal, endingsPercent);
    
    // Update CG progress
    const cgCompleted = progressData.cg.size;
    const cgTotal = document.querySelectorAll('.cg-checkbox').length;
    const cgPercent = Math.round((cgCompleted / cgTotal) * 100);
    
    updateProgressDisplay('cg', cgCompleted, cgTotal, cgPercent);
    
    // Update achievements progress
    const achievementsCompleted = progressData.achievements.size;
    const achievementsTotal = document.querySelectorAll('.achievement-checkbox').length;
    const achievementsPercent = Math.round((achievementsCompleted / achievementsTotal) * 100);
    
    updateProgressDisplay('achievements', achievementsCompleted, achievementsTotal, achievementsPercent);
}

function updateProgressDisplay(category, completed, total, percent) {
    const percentElement = document.getElementById(`${category}-percent`);
    const completedElement = document.getElementById(`${category}-completed`);
    const totalElement = document.getElementById(`${category}-total`);
    
    if (percentElement) percentElement.textContent = `${percent}%`;
    if (completedElement) completedElement.textContent = completed;
    if (totalElement) totalElement.textContent = total;
}

function filterEndings(filter) {
    const endingGuides = document.querySelectorAll('.ending-guide');
    endingGuides.forEach(guide => {
        const category = guide.dataset.category;
        if (filter === 'all' || category === filter) {
            guide.style.display = 'block';
        } else {
            guide.style.display = 'none';
        }
    });
}

function shareProgress() {
    const endingsPercent = Math.round((progressData.endings.size / 12) * 100);
    const cgPercent = Math.round((progressData.cg.size / document.querySelectorAll('.cg-checkbox').length) * 100);
    
    const shareText = `🎸 Мой прогресс в Love, Money, Rock'n'Roll:\n\n` +
                     `📊 Концовки: ${endingsPercent}% (${progressData.endings.size}/12)\n` +
                     `🎨 CG галерея: ${cgPercent}%\n` +
                     `🏆 Достижения: ${progressData.achievements.size}\n\n` +
                     `Играю с помощью LMRN.tools - лучший гид по игре! 🚀`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Мой прогресс в Love, Money, Rock\'n\'Roll',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText + '\n' + window.location.href).then(() => {
            showNotification('Прогресс скопирован в буфер обмена!');
        }).catch(() => {
            // Final fallback - show modal with text
            showShareModal(shareText);
        });
    }
}

function showShareModal(text) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    modal.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; width: 90%;">
            <h3 style="margin-bottom: 15px;">Поделиться прогрессом</h3>
            <textarea readonly style="width: 100%; height: 150px; margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-family: monospace; font-size: 12px;">${text}</textarea>
            <button onclick="this.parentElement.parentElement.remove()" style="background: #ff6b6b; color: white; border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer;">Закрыть</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 15px 20px;
        border-radius: 25px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// General UI functionality
function initializeUI() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Add hover effects to interactive elements
    addHoverEffects();
    
    // Initialize scroll animations
    initializeScrollAnimations();
}

function addHoverEffects() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.ending-card, .character-detailed, .cg-item, .achievement-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn, .cta-button, .tab-btn, .filter-btn, .chapter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease-out';
                entry.target.style.opacity = '1';
            }
        });
    }, observerOptions);

    // Observe content sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        observer.observe(section);
    });
}

// Data persistence
function saveProgressData() {
    const data = {
        endings: Array.from(progressData.endings),
        cg: Array.from(progressData.cg),
        achievements: Array.from(progressData.achievements)
    };
    localStorage.setItem('lmrn-progress', JSON.stringify(data));
}

function loadProgressData() {
    try {
        const saved = localStorage.getItem('lmrn-progress');
        if (saved) {
            const data = JSON.parse(saved);
            progressData.endings = new Set(data.endings || []);
            progressData.cg = new Set(data.cg || []);
            progressData.achievements = new Set(data.achievements || []);
            
            // Update UI to reflect loaded progress
            updateProgressCheckboxes();
            updateProgressStats();
        }
    } catch (error) {
        console.error('Ошибка загрузки прогресса:', error);
    }
}

function updateProgressCheckboxes() {
    // Update endings checkboxes
    document.querySelectorAll('.ending-checkbox').forEach(checkbox => {
        const card = checkbox.closest('[data-ending]');
        if (card && progressData.endings.has(card.dataset.ending)) {
            checkbox.checked = true;
            updateStatusText(card, true);
        }
    });

    // Update CG checkboxes
    document.querySelectorAll('.cg-checkbox').forEach(checkbox => {
        const item = checkbox.closest('[data-character]');
        if (item && progressData.cg.has(item.dataset.character)) {
            checkbox.checked = true;
        }
    });

    // Update achievement checkboxes
    document.querySelectorAll('.achievement-checkbox').forEach(checkbox => {
        const item = checkbox.closest('.achievement-item');
        if (item) {
            const title = item.querySelector('h4')?.textContent;
            if (title && progressData.achievements.has(title)) {
                checkbox.checked = true;
            }
        }
    });
}

// Utility functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
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

// Export functions for global access
window.scrollToSection = scrollToSection;
window.shareProgress = shareProgress;

// Easter egg
console.log(`
🎸 LMRN.tools - Love, Money, Rock'n'Roll Guide
═══════════════════════════════════════════════
💰 Калькулятор маршрутов готов!
📖 Прохождения без спойлеров загружены!
📊 Трекер прогресса активирован!

Создано с ❤️ для фанатов визуальных новелл
`);

// Analytics placeholder (replace with actual analytics)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics tracking
    console.log('📊 Event:', eventName, properties);
}

// Track page load
trackEvent('page_load', {
    page: 'main',
    timestamp: new Date().toISOString()
});

// Track calculator usage
document.addEventListener('change', function(e) {
    if (e.target.matches('.choice-option input[type="radio"]')) {
        trackEvent('calculator_choice_made', {
            choice: e.target.value,
            chapter: e.target.name
        });
    }
});

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when you have a service worker
        // navigator.serviceWorker.register('/sw.js').then(function(registration) {
        //     console.log('✅ Service Worker зарегистрирован:', registration.scope);
        // }).catch(function(error) {
        //     console.log('❌ Ошибка регистрации Service Worker:', error);
        // });
    });
}
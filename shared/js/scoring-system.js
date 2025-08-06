/**
 * Scoring System Module
 * Manages student scores and achievements for the Web Security Lab
 * Created for Web Security Lab
 */

class ScoringSystem {
    constructor() {
        this.challenges = {
            xss: {
                name: 'XSS Challenge',
                maxScore: 100,
                levels: [
                    { name: 'Beginner', threshold: 20, points: 20, description: 'Identify basic XSS vulnerability' },
                    { name: 'Intermediate', threshold: 50, points: 30, description: 'Exploit reflected XSS vulnerability' },
                    { name: 'Advanced', threshold: 80, points: 30, description: 'Exploit stored XSS vulnerability' },
                    { name: 'Expert', threshold: 100, points: 20, description: 'Implement complete XSS protection' }
                ]
            },
            sql: {
                name: 'SQL Injection Challenge',
                maxScore: 100,
                levels: [
                    { name: 'Beginner', threshold: 20, points: 20, description: 'Identify basic SQL Injection vulnerability' },
                    { name: 'Intermediate', threshold: 50, points: 30, description: 'Exploit login bypass vulnerability' },
                    { name: 'Advanced', threshold: 80, points: 30, description: 'Extract data using UNION attacks' },
                    { name: 'Expert', threshold: 100, points: 20, description: 'Implement complete SQL Injection protection' }
                ]
            },
            csrf: {
                name: 'CSRF Challenge',
                maxScore: 100,
                levels: [
                    { name: 'Beginner', threshold: 20, points: 20, description: 'Identify CSRF vulnerability' },
                    { name: 'Intermediate', threshold: 50, points: 30, description: 'Create CSRF exploit' },
                    { name: 'Advanced', threshold: 80, points: 30, description: 'Bypass basic CSRF protection' },
                    { name: 'Expert', threshold: 100, points: 20, description: 'Implement complete CSRF protection' }
                ]
            },
            ecommerce: {
                name: 'E-commerce Security',
                maxScore: 100,
                levels: [
                    { name: 'Beginner', threshold: 20, points: 20, description: 'Identify insecure direct object references' },
                    { name: 'Intermediate', threshold: 50, points: 30, description: 'Exploit authentication vulnerabilities' },
                    { name: 'Advanced', threshold: 80, points: 30, description: 'Exploit business logic vulnerabilities' },
                    { name: 'Expert', threshold: 100, points: 20, description: 'Implement complete e-commerce security' }
                ]
            }
        };

        this.achievements = [
            { id: 'first_steps', name: 'First Steps', description: 'Start your security journey', icon: '🚀', condition: scores => scores.total > 0 },
            { id: 'xss_master', name: 'XSS Master', description: 'Successfully exploit and fix XSS vulnerabilities', icon: '🎯', condition: scores => scores.xss >= 50 },
            { id: 'sql_sleuth', name: 'SQL Sleuth', description: 'Discover and prevent SQL Injection attacks', icon: '🔍', condition: scores => scores.sql >= 50 },
            { id: 'csrf_defender', name: 'CSRF Defender', description: 'Implement protection against CSRF attacks', icon: '🛡️', condition: scores => scores.csrf >= 50 },
            { id: 'security_specialist', name: 'Security Specialist', description: 'Complete all security challenges', icon: '🔒', condition: scores => scores.total >= 300 },
            { id: 'perfect_score', name: 'Perfect Score', description: 'Achieve 100% in any challenge', icon: '🏆', condition: scores => scores.xss === 100 || scores.sql === 100 || scores.csrf === 100 || scores.ecommerce === 100 },
            { id: 'vulnerability_hunter', name: 'Vulnerability Hunter', description: 'Find 10 vulnerabilities', icon: '🔎', condition: scores => this.getVulnerabilityCount() >= 10 },
            { id: 'security_expert', name: 'Security Expert', description: 'Achieve at least 50% in all challenges', icon: '👨‍💻', condition: scores => scores.xss >= 50 && scores.sql >= 50 && scores.csrf >= 50 && scores.ecommerce >= 50 }
        ];

        this.init();
    }

    /**
     * Initialize the scoring system
     */
    init() {
        // Initialize scores in localStorage if not exists
        if (!localStorage.getItem('seclab_student_scores')) {
            const initialScores = {
                xss: 0,
                sql: 0,
                csrf: 0,
                ecommerce: 0,
                total: 0,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('seclab_student_scores', JSON.stringify(initialScores));
        }
        
        // Initialize achievements in localStorage if not exists
        if (!localStorage.getItem('seclab_achievements')) {
            const initialAchievements = this.achievements.map(achievement => ({
                id: achievement.id,
                unlocked: false,
                unlockedAt: null
            }));
            
            localStorage.setItem('seclab_achievements', JSON.stringify(initialAchievements));
        }
        
        // Initialize vulnerability counter if not exists
        if (!localStorage.getItem('seclab_vulnerability_counter')) {
            const initialCounter = {
                xss: 0,
                sql: 0,
                csrf: 0,
                total: 0,
                lastReset: new Date().toISOString()
            };
            
            localStorage.setItem('seclab_vulnerability_counter', JSON.stringify(initialCounter));
        }
        
        // Create UI elements if on a challenge page
        this.createScoreUI();
        
        console.log('[ScoringSystem] Initialized');
    }

    /**
     * Create score UI elements
     */
    createScoreUI() {
        // Check if we're on a challenge page
        const isChallengePage = this.getCurrentChallenge() !== null;
        
        if (!isChallengePage) return;
        
        // Create score container if it doesn't exist
        if (!document.querySelector('.score-container')) {
            const container = document.createElement('div');
            container.className = 'score-container';
            
            // Add container to the page
            document.body.appendChild(container);
            
            // Add CSS for score container
            this.addScoreStyles();
            
            // Update score display
            this.updateScoreDisplay();
        }
    }

    /**
     * Add CSS styles for score UI
     */
    addScoreStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .score-container {
                position: fixed;
                top: 20px;
                left: 20px;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 10px;
                padding: 15px;
                color: white;
                font-family: 'Roboto Mono', monospace;
                z-index: 1000;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                border: 1px solid #333;
                min-width: 200px;
                transition: all 0.3s ease;
            }
            
            .score-container:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 128, 255, 0.4);
            }
            
            .score-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #333;
                padding-bottom: 10px;
            }
            
            .score-title {
                font-weight: bold;
                font-size: 16px;
                color: #00ff88;
            }
            
            .score-value {
                font-size: 18px;
                font-weight: bold;
                color: #0080ff;
            }
            
            .score-progress {
                margin-top: 10px;
            }
            
            .progress-bar {
                height: 8px;
                background: #333;
                border-radius: 4px;
                overflow: hidden;
                margin-top: 5px;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #0080ff, #00ff88);
                width: 0%;
                transition: width 0.5s ease;
            }
            
            .score-label {
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #ccc;
            }
            
            .score-notification {
                position: fixed;
                top: 80px;
                left: 20px;
                background: linear-gradient(45deg, #0080ff, #00ff88);
                color: black;
                padding: 10px 15px;
                border-radius: 8px;
                font-family: 'Roboto Mono', monospace;
                font-weight: bold;
                z-index: 1001;
                box-shadow: 0 4px 20px rgba(0, 128, 255, 0.4);
                animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
                pointer-events: none;
            }
            
            @keyframes slideIn {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            .achievement-notification {
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(45deg, #ffaa00, #ff0080);
                color: white;
                padding: 15px;
                border-radius: 10px;
                font-family: 'Roboto Mono', monospace;
                z-index: 1001;
                box-shadow: 0 4px 20px rgba(255, 0, 128, 0.4);
                display: flex;
                align-items: center;
                gap: 15px;
                animation: slideUp 0.5s ease, fadeOut 0.5s ease 4.5s forwards;
                pointer-events: none;
                max-width: 300px;
            }
            
            .achievement-icon {
                font-size: 30px;
            }
            
            .achievement-content {
                flex: 1;
            }
            
            .achievement-title {
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 5px;
            }
            
            .achievement-description {
                font-size: 12px;
                opacity: 0.9;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Update score display
     */
    updateScoreDisplay() {
        const container = document.querySelector('.score-container');
        if (!container) return;
        
        // Get current challenge
        const challenge = this.getCurrentChallenge();
        if (!challenge) return;
        
        // Get scores
        const scores = this.getScores();
        const challengeScore = scores[challenge] || 0;
        
        // Update container content
        container.innerHTML = `
            <div class="score-header">
                <div class="score-title">${this.challenges[challenge].name}</div>
                <div class="score-value">${challengeScore} pts</div>
            </div>
            <div class="score-progress">
                <div class="score-label">
                    <span>Progress</span>
                    <span>${challengeScore}/${this.challenges[challenge].maxScore}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(challengeScore / this.challenges[challenge].maxScore) * 100}%"></div>
                </div>
            </div>
        `;
    }

    /**
     * Get current challenge based on URL
     */
    getCurrentChallenge() {
        const path = window.location.pathname;
        
        if (path.includes('XSS')) return 'xss';
        if (path.includes('SQL')) return 'sql';
        if (path.includes('CSRF')) return 'csrf';
        if (path.includes('E-commerce')) return 'ecommerce';
        
        return null;
    }

    /**
     * Get scores from localStorage
     */
    getScores() {
        try {
            const savedScores = localStorage.getItem('seclab_student_scores');
            return savedScores ? JSON.parse(savedScores) : {
                xss: 0,
                sql: 0,
                csrf: 0,
                ecommerce: 0,
                total: 0
            };
        } catch (error) {
            console.error('[ScoringSystem] Error getting scores:', error);
            return {
                xss: 0,
                sql: 0,
                csrf: 0,
                ecommerce: 0,
                total: 0
            };
        }
    }

    /**
     * Get vulnerability count from localStorage
     */
    getVulnerabilityCount() {
        try {
            const savedCounter = localStorage.getItem('seclab_vulnerability_counter');
            if (!savedCounter) return 0;
            
            const counter = JSON.parse(savedCounter);
            return counter.total || 0;
        } catch (error) {
            console.error('[ScoringSystem] Error getting vulnerability count:', error);
            return 0;
        }
    }

    /**
     * Award points for a specific challenge
     */
    awardPoints(challenge, points, reason = '') {
        if (!this.challenges[challenge]) {
            console.error(`[ScoringSystem] Invalid challenge: ${challenge}`);
            return;
        }
        
        try {
            // Get current scores
            const scores = this.getScores();
            
            // Calculate new score (don't exceed max)
            const newScore = Math.min(
                this.challenges[challenge].maxScore,
                scores[challenge] + points
            );
            
            // Check if score actually increased
            if (newScore <= scores[challenge]) {
                return;
            }
            
            // Calculate points actually awarded
            const pointsAwarded = newScore - scores[challenge];
            
            // Update scores
            scores[challenge] = newScore;
            scores.total += pointsAwarded;
            scores.lastUpdated = new Date().toISOString();
            
            // Save updated scores
            localStorage.setItem('seclab_student_scores', JSON.stringify(scores));
            
            // Update score display
            this.updateScoreDisplay();
            
            // Show notification
            this.showPointsNotification(pointsAwarded, reason);
            
            // Check for achievements
            this.checkAchievements(scores);
            
            console.log(`[ScoringSystem] Awarded ${pointsAwarded} points for ${challenge}`);
            
            return pointsAwarded;
        } catch (error) {
            console.error('[ScoringSystem] Error awarding points:', error);
            return 0;
        }
    }

    /**
     * Show points notification
     */
    showPointsNotification(points, reason = '') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'score-notification';
        notification.textContent = `+${points} points${reason ? ': ' + reason : ''}`;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    /**
     * Check for unlocked achievements
     */
    checkAchievements(scores) {
        try {
            // Get current achievements
            const savedAchievements = localStorage.getItem('seclab_achievements');
            if (!savedAchievements) return;
            
            const achievements = JSON.parse(savedAchievements);
            
            // Check each achievement
            this.achievements.forEach(achievement => {
                // Find achievement in saved list
                const savedAchievement = achievements.find(a => a.id === achievement.id);
                
                // Skip if already unlocked
                if (savedAchievement && savedAchievement.unlocked) return;
                
                // Check if achievement condition is met
                if (achievement.condition(scores)) {
                    // Update achievement
                    if (savedAchievement) {
                        savedAchievement.unlocked = true;
                        savedAchievement.unlockedAt = new Date().toISOString();
                    } else {
                        achievements.push({
                            id: achievement.id,
                            unlocked: true,
                            unlockedAt: new Date().toISOString()
                        });
                    }
                    
                    // Save updated achievements
                    localStorage.setItem('seclab_achievements', JSON.stringify(achievements));
                    
                    // Show achievement notification
                    this.showAchievementNotification(achievement);
                    
                    console.log(`[ScoringSystem] Achievement unlocked: ${achievement.name}`);
                }
            });
        } catch (error) {
            console.error('[ScoringSystem] Error checking achievements:', error);
        }
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <div class="achievement-title">Achievement Unlocked: ${achievement.name}</div>
                <div class="achievement-description">${achievement.description}</div>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after animation completes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Get all achievements with unlock status
     */
    getAchievements() {
        try {
            // Get saved achievements
            const savedAchievements = localStorage.getItem('seclab_achievements');
            if (!savedAchievements) return this.achievements.map(a => ({ ...a, unlocked: false }));
            
            const unlockedStatus = JSON.parse(savedAchievements);
            
            // Combine achievement details with unlock status
            return this.achievements.map(achievement => {
                const status = unlockedStatus.find(a => a.id === achievement.id);
                return {
                    ...achievement,
                    unlocked: status ? status.unlocked : false,
                    unlockedAt: status ? status.unlockedAt : null
                };
            });
        } catch (error) {
            console.error('[ScoringSystem] Error getting achievements:', error);
            return this.achievements.map(a => ({ ...a, unlocked: false }));
        }
    }

    /**
     * Reset all scores and achievements
     */
    resetProgress() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            // Reset scores
            const initialScores = {
                xss: 0,
                sql: 0,
                csrf: 0,
                ecommerce: 0,
                total: 0,
                lastUpdated: new Date().toISOString()
            };
            
            localStorage.setItem('seclab_student_scores', JSON.stringify(initialScores));
            
            // Reset achievements
            const initialAchievements = this.achievements.map(achievement => ({
                id: achievement.id,
                unlocked: false,
                unlockedAt: null
            }));
            
            localStorage.setItem('seclab_achievements', JSON.stringify(initialAchievements));
            
            // Reset vulnerability counter
            const initialCounter = {
                xss: 0,
                sql: 0,
                csrf: 0,
                total: 0,
                lastReset: new Date().toISOString()
            };
            
            localStorage.setItem('seclab_vulnerability_counter', JSON.stringify(initialCounter));
            
            // Update UI
            this.updateScoreDisplay();
            
            console.log('[ScoringSystem] Progress reset');
            
            return true;
        }
        
        return false;
    }
}

// Initialize the scoring system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.scoringSystem = new ScoringSystem();
});
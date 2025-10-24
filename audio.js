// 音效管理模块

/**
 * 音效管理器
 * 使用 Web Audio API 生成音效，无需外部音频文件
 */
export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3; // 默认音量 30%
        
        this.initAudioContext();
    }

    /**
     * 初始化音频上下文
     */
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API 不支持', e);
            this.enabled = false;
        }
    }

    /**
     * 播放移动棋子音效
     */
    playMoveSound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        // 创建振荡器（生成音调）
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 设置音调：清脆的"啪"声
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, now);
        oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.05);
        
        // 设置音量包络
        gainNode.gain.setValueAtTime(this.volume, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        // 播放
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    }

    /**
     * 播放吃子音效
     */
    playCaptureSound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        // 创建两个振荡器，产生更丰富的音效
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 设置音调：低沉的"咚"声
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(200, now);
        osc1.frequency.exponentialRampToValueAtTime(100, now + 0.15);
        
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(150, now);
        osc2.frequency.exponentialRampToValueAtTime(75, now + 0.15);
        
        // 设置音量包络
        gainNode.gain.setValueAtTime(this.volume * 1.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        // 播放
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.15);
        osc2.stop(now + 0.15);
    }

    /**
     * 播放选中棋子音效
     */
    playSelectSound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // 设置音调：轻快的"嘀"声
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1200, now);
        
        // 设置音量包络
        gainNode.gain.setValueAtTime(this.volume * 0.5, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        // 播放
        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }

    /**
     * 播放将军音效
     */
    playCheckSound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        // 创建三个音符的序列
        for (let i = 0; i < 3; i++) {
            const startTime = now + i * 0.1;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // 设置音调：警告音
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(1000 + i * 200, startTime);
            
            // 设置音量包络
            gainNode.gain.setValueAtTime(this.volume * 0.6, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.08);
            
            // 播放
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.08);
        }
    }

    /**
     * 播放胜利音效
     */
    playVictorySound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        // 播放一段上升的旋律
        const melody = [
            { freq: 523, time: 0 },      // C5
            { freq: 659, time: 0.15 },   // E5
            { freq: 784, time: 0.3 },    // G5
            { freq: 1047, time: 0.45 }   // C6
        ];
        
        melody.forEach(note => {
            const startTime = now + note.time;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(note.freq, startTime);
            
            gainNode.gain.setValueAtTime(this.volume * 0.8, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    }

    /**
     * 播放失败音效
     */
    playDefeatSound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        // 播放一段下降的旋律
        const melody = [
            { freq: 523, time: 0 },      // C5
            { freq: 466, time: 0.15 },   // A#4
            { freq: 392, time: 0.3 },    // G4
            { freq: 330, time: 0.45 }    // E4
        ];
        
        melody.forEach(note => {
            const startTime = now + note.time;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(note.freq, startTime);
            
            gainNode.gain.setValueAtTime(this.volume * 0.8, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    }

    /**
     * 播放和棋音效
     */
    playDrawSound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        // 播放平稳的音调
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, now);
        
        gainNode.gain.setValueAtTime(this.volume * 0.6, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        oscillator.start(now);
        oscillator.stop(now + 0.5);
    }

    /**
     * 播放悔棋音效
     */
    playUndoSound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        // 播放两个快速的音符（倒退感）
        for (let i = 0; i < 2; i++) {
            const startTime = now + i * 0.08;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(600 - i * 200, startTime);
            
            gainNode.gain.setValueAtTime(this.volume * 0.5, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.06);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.06);
        }
    }

    /**
     * 播放新游戏音效
     */
    playNewGameSound() {
        if (!this.enabled) return;
        
        const now = this.audioContext.currentTime;
        
        // 播放清脆的提示音
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, now);
        oscillator.frequency.setValueAtTime(1320, now + 0.1);
        
        gainNode.gain.setValueAtTime(this.volume * 0.7, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        oscillator.start(now);
        oscillator.stop(now + 0.2);
    }

    /**
     * 设置音量
     * @param {number} volume - 音量值 (0-1)
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    /**
     * 启用/禁用音效
     * @param {boolean} enabled - 是否启用
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }

    /**
     * 切换音效开关
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

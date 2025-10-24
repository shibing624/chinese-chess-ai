// UI 渲染模块

/**
 * 棋盘渲染器
 */
export class BoardRenderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.cellSize = 60;
        this.padding = 20;
        this.selectedPiece = null;
        this.legalMoves = [];
        this.lastMove = null;
        this.onPieceClick = null;
        this.onMoveClick = null;
        
        this.initBoard();
    }

    /**
     * 初始化棋盘
     */
    initBoard() {
        this.container.innerHTML = '';
        
        // 创建 SVG 网格
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('board-grid');
        svg.setAttribute('width', '520');
        svg.setAttribute('height', '580');
        
        // 绘制横线
        for (let i = 0; i < 10; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', '0');
            line.setAttribute('y1', i * this.cellSize);
            line.setAttribute('x2', 8 * this.cellSize);
            line.setAttribute('y2', i * this.cellSize);
            line.classList.add(i === 0 || i === 9 ? 'board-line-bold' : 'board-line');
            svg.appendChild(line);
        }
        
        // 绘制竖线
        for (let i = 0; i < 9; i++) {
            // 上半部分
            const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line1.setAttribute('x1', i * this.cellSize);
            line1.setAttribute('y1', '0');
            line1.setAttribute('x2', i * this.cellSize);
            line1.setAttribute('y2', 4 * this.cellSize);
            line1.classList.add(i === 0 || i === 8 ? 'board-line-bold' : 'board-line');
            svg.appendChild(line1);
            
            // 下半部分
            const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line2.setAttribute('x1', i * this.cellSize);
            line2.setAttribute('y1', 5 * this.cellSize);
            line2.setAttribute('x2', i * this.cellSize);
            line2.setAttribute('y2', 9 * this.cellSize);
            line2.classList.add(i === 0 || i === 8 ? 'board-line-bold' : 'board-line');
            svg.appendChild(line2);
        }
        
        // 绘制九宫格斜线
        // 上方九宫格
        const diag1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        diag1.setAttribute('x1', 3 * this.cellSize);
        diag1.setAttribute('y1', '0');
        diag1.setAttribute('x2', 5 * this.cellSize);
        diag1.setAttribute('y2', 2 * this.cellSize);
        diag1.classList.add('board-line');
        svg.appendChild(diag1);
        
        const diag2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        diag2.setAttribute('x1', 5 * this.cellSize);
        diag2.setAttribute('y1', '0');
        diag2.setAttribute('x2', 3 * this.cellSize);
        diag2.setAttribute('y2', 2 * this.cellSize);
        diag2.classList.add('board-line');
        svg.appendChild(diag2);
        
        // 下方九宫格
        const diag3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        diag3.setAttribute('x1', 3 * this.cellSize);
        diag3.setAttribute('y1', 7 * this.cellSize);
        diag3.setAttribute('x2', 5 * this.cellSize);
        diag3.setAttribute('y2', 9 * this.cellSize);
        diag3.classList.add('board-line');
        svg.appendChild(diag3);
        
        const diag4 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        diag4.setAttribute('x1', 5 * this.cellSize);
        diag4.setAttribute('y1', 7 * this.cellSize);
        diag4.setAttribute('x2', 3 * this.cellSize);
        diag4.setAttribute('y2', 9 * this.cellSize);
        diag4.classList.add('board-line');
        svg.appendChild(diag4);
        
        this.container.appendChild(svg);
        
        // 添加河界文字
        this.addRiverText();
    }

    /**
     * 添加河界文字
     */
    addRiverText() {
        const riverText1 = document.createElement('div');
        riverText1.classList.add('river-text');
        riverText1.textContent = '楚河';
        riverText1.style.left = '120px';
        riverText1.style.top = '265px';
        this.container.appendChild(riverText1);
        
        const riverText2 = document.createElement('div');
        riverText2.classList.add('river-text');
        riverText2.textContent = '汉界';
        riverText2.style.left = '320px';
        riverText2.style.top = '265px';
        this.container.appendChild(riverText2);
    }

    /**
     * 渲染棋盘状态
     */
    render(board, chess) {
        // 清除旧的棋子和标记
        const oldPieces = this.container.querySelectorAll('.chess-piece, .move-hint, .last-move-from, .last-move-to');
        oldPieces.forEach(el => el.remove());
        
        // 渲染最后一步移动标记
        if (this.lastMove) {
            this.renderLastMove(this.lastMove);
        }
        
        // 渲染棋子
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                const piece = board[y][x];
                if (piece) {
                    this.renderPiece(piece, x, y, chess);
                }
            }
        }
        
        // 渲染可移动位置
        if (this.selectedPiece && this.legalMoves.length > 0) {
            this.renderLegalMoves(this.legalMoves, board);
        }
    }

    /**
     * 渲染棋子
     */
    renderPiece(piece, x, y, chess) {
        const pieceEl = document.createElement('div');
        pieceEl.classList.add('chess-piece');
        
        const isRed = piece === piece.toUpperCase();
        pieceEl.classList.add(isRed ? 'red' : 'black');
        
        // 设置棋子文字
        const pieceNames = {
            'K': '帅', 'k': '将',
            'A': '仕', 'a': '士',
            'B': '相', 'b': '象',
            'N': '马', 'n': '马',
            'R': '车', 'r': '车',
            'C': '炮', 'c': '炮',
            'P': '兵', 'p': '卒'
        };
        
        pieceEl.textContent = pieceNames[piece] || piece;
        
        // 设置位置
        const left = this.padding + x * this.cellSize;
        const top = this.padding + y * this.cellSize;
        pieceEl.style.left = left + 'px';
        pieceEl.style.top = top + 'px';
        
        // 设置数据属性
        pieceEl.dataset.x = x;
        pieceEl.dataset.y = y;
        pieceEl.dataset.piece = piece;
        
        // 检查是否为选中的棋子
        if (this.selectedPiece && this.selectedPiece.x === x && this.selectedPiece.y === y) {
            pieceEl.classList.add('selected');
        }
        
        // 移除disabled类，不虚化对方棋子
        // if (chess && !chess.isCurrentPlayerPiece(piece)) {
        //     pieceEl.classList.add('disabled');
        // }
        
        // 添加点击事件
        pieceEl.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.onPieceClick) {
                this.onPieceClick(x, y, piece);
            }
        });
        
        this.container.appendChild(pieceEl);
    }

    /**
     * 渲染可移动位置
     */
    renderLegalMoves(moves, board) {
        for (const move of moves) {
            const hintEl = document.createElement('div');
            hintEl.classList.add('move-hint');
            
            const targetPiece = board[move.y][move.x];
            if (targetPiece) {
                hintEl.classList.add('capture');
            }
            
            const left = this.padding + move.x * this.cellSize;
            const top = this.padding + move.y * this.cellSize;
            hintEl.style.left = left + 'px';
            hintEl.style.top = top + 'px';
            
            hintEl.dataset.x = move.x;
            hintEl.dataset.y = move.y;
            
            hintEl.addEventListener('click', (e) => {
                e.stopPropagation();
                if (this.onMoveClick) {
                    this.onMoveClick(move.x, move.y);
                }
            });
            
            this.container.appendChild(hintEl);
        }
    }

    /**
     * 渲染最后一步移动 - 增强视觉效果
     */
    renderLastMove(move) {
        const fromEl = document.createElement('div');
        fromEl.classList.add('last-move-from');
        fromEl.style.left = (this.padding + move.from.x * this.cellSize) + 'px';
        fromEl.style.top = (this.padding + move.from.y * this.cellSize) + 'px';
        this.container.appendChild(fromEl);
        
        const toEl = document.createElement('div');
        toEl.classList.add('last-move-to');
        toEl.style.left = (this.padding + move.to.x * this.cellSize) + 'px';
        toEl.style.top = (this.padding + move.to.y * this.cellSize) + 'px';
        this.container.appendChild(toEl);
    }

    /**
     * 设置选中的棋子
     */
    setSelectedPiece(x, y) {
        this.selectedPiece = x !== null ? {x, y} : null;
    }

    /**
     * 设置可移动位置
     */
    setLegalMoves(moves) {
        this.legalMoves = moves;
    }

    /**
     * 设置最后一步移动
     */
    setLastMove(move) {
        this.lastMove = move;
    }

    /**
     * 清除选择
     */
    clearSelection() {
        this.selectedPiece = null;
        this.legalMoves = [];
    }
}

/**
 * 游戏信息显示器
 */
export class GameInfoDisplay {
    constructor() {
        this.currentTurnEl = document.getElementById('currentTurn');
        this.moveCountEl = document.getElementById('moveCount');
        this.gameStatusEl = document.getElementById('gameStatus');
        this.moveHistoryEl = document.getElementById('moveHistory');
        this.aiThinkingEl = document.getElementById('aiThinking');
        this.redTimerEl = document.getElementById('redTimer');
        this.blackTimerEl = document.getElementById('blackTimer');
    }

    /**
     * 更新当前回合
     */
    updateCurrentTurn(player) {
        this.currentTurnEl.textContent = player === 'red' ? '红方' : '黑方';
        this.currentTurnEl.className = player === 'red' ? 'font-bold text-red-600' : 'font-bold text-gray-800';
    }

    /**
     * 更新回合数
     */
    updateMoveCount(count) {
        this.moveCountEl.textContent = count;
    }

    /**
     * 更新游戏状态
     */
    updateGameStatus(status) {
        this.gameStatusEl.textContent = status;
    }

    /**
     * 添加走法历史
     */
    addMoveToHistory(moveNumber, moveText, isRed) {
        const moveItem = document.createElement('div');
        moveItem.classList.add('move-item');
        
        const moveNumberSpan = document.createElement('span');
        moveNumberSpan.className = 'font-bold text-gray-700';
        moveNumberSpan.textContent = `${moveNumber}. `;
        
        const moveTextSpan = document.createElement('span');
        moveTextSpan.className = isRed ? 'text-red-600' : 'text-gray-800';
        moveTextSpan.textContent = moveText;
        
        moveItem.appendChild(moveNumberSpan);
        moveItem.appendChild(moveTextSpan);
        
        this.moveHistoryEl.appendChild(moveItem);
        this.moveHistoryEl.scrollTop = this.moveHistoryEl.scrollHeight;
    }

    /**
     * 清空走法历史
     */
    clearMoveHistory() {
        this.moveHistoryEl.innerHTML = '';
    }

    /**
     * 更新 AI 思考
     */
    updateAIThinking(text) {
        this.aiThinkingEl.textContent = text;
    }

    /**
     * 更新计时器
     */
    updateTimer(player, time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        const timeText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (player === 'red') {
            this.redTimerEl.textContent = timeText;
        } else {
            this.blackTimerEl.textContent = timeText;
        }
    }
}

/**
 * 游戏结束弹窗
 */
export class GameOverModal {
    constructor() {
        this.modal = document.getElementById('gameOverModal');
        this.icon = document.getElementById('gameOverIcon');
        this.title = document.getElementById('gameOverTitle');
        this.message = document.getElementById('gameOverMessage');
        this.closeBtn = document.getElementById('closeModalBtn');
    }

    /**
     * 显示弹窗
     */
    show(winner) {
        if (winner === 'red') {
            this.icon.textContent = '🎉';
            this.title.textContent = '恭喜获胜！';
            this.message.textContent = '红方获得胜利';
        } else if (winner === 'black') {
            this.icon.textContent = '😔';
            this.title.textContent = '遗憾落败';
            this.message.textContent = '黑方（AI）获得胜利';
        } else {
            this.icon.textContent = '🤝';
            this.title.textContent = '和棋';
            this.message.textContent = '双方平局';
        }
        
        this.modal.classList.remove('hidden');
        this.modal.classList.add('flex');
    }

    /**
     * 隐藏弹窗
     */
    hide() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
    }

    /**
     * 设置关闭回调
     */
    onClose(callback) {
        this.closeBtn.addEventListener('click', callback);
    }
}
// 中国象棋游戏逻辑模块

/**
 * 中国象棋游戏类
 */
export class ChineseChess {
    constructor() {
        this.board = this.initBoard();
        this.currentPlayer = 'red'; // 'red' or 'black'
        this.selectedPiece = null;
        this.gameOver = false;
        this.winner = null;
        this.moveHistory = []; // 添加移动历史记录
    }

    /**
     * 初始化棋盘
     */
    initBoard() {
        const board = Array(10).fill(null).map(() => Array(9).fill(null));
        
        // 黑方棋子（上方）
        board[0][0] = 'r'; board[0][8] = 'r'; // 车
        board[0][1] = 'n'; board[0][7] = 'n'; // 马
        board[0][2] = 'b'; board[0][6] = 'b'; // 象
        board[0][3] = 'a'; board[0][5] = 'a'; // 士
        board[0][4] = 'k'; // 将
        board[2][1] = 'c'; board[2][7] = 'c'; // 炮
        board[3][0] = 'p'; board[3][2] = 'p'; board[3][4] = 'p'; 
        board[3][6] = 'p'; board[3][8] = 'p'; // 卒
        
        // 红方棋子（下方）
        board[9][0] = 'R'; board[9][8] = 'R'; // 车
        board[9][1] = 'N'; board[9][7] = 'N'; // 马
        board[9][2] = 'B'; board[9][6] = 'B'; // 相
        board[9][3] = 'A'; board[9][5] = 'A'; // 仕
        board[9][4] = 'K'; // 帅
        board[7][1] = 'C'; board[7][7] = 'C'; // 炮
        board[6][0] = 'P'; board[6][2] = 'P'; board[6][4] = 'P'; 
        board[6][6] = 'P'; board[6][8] = 'P'; // 兵
        
        return board;
    }

    /**
     * 获取指定位置的棋子
     */
    getPiece(x, y) {
        if (x < 0 || x >= 9 || y < 0 || y >= 10) return null;
        return this.board[y][x];
    }

    /**
     * 判断棋子是否为红方
     */
    isRed(piece) {
        return piece === piece.toUpperCase();
    }

    /**
     * 判断是否为当前玩家的棋子
     */
    isCurrentPlayerPiece(piece) {
        if (!piece) return false;
        return (this.currentPlayer === 'red' && this.isRed(piece)) ||
               (this.currentPlayer === 'black' && !this.isRed(piece));
    }

    /**
     * 获取所有合法移动
     */
    getLegalMoves(x, y) {
        const piece = this.getPiece(x, y);
        if (!piece) return [];
        
        const pieceType = piece.toUpperCase();
        const isRed = this.isRed(piece);
        
        let moves = [];
        
        switch (pieceType) {
            case 'K': // 帅/将
                moves = this.getKingMoves(x, y, isRed);
                break;
            case 'A': // 仕/士
                moves = this.getAdvisorMoves(x, y, isRed);
                break;
            case 'B': // 相/象
                moves = this.getBishopMoves(x, y, isRed);
                break;
            case 'N': // 马
                moves = this.getKnightMoves(x, y, isRed);
                break;
            case 'R': // 车
                moves = this.getRookMoves(x, y, isRed);
                break;
            case 'C': // 炮
                moves = this.getCannonMoves(x, y, isRed);
                break;
            case 'P': // 兵/卒
                moves = this.getPawnMoves(x, y, isRed);
                break;
        }
        
        return moves;
    }

    /**
     * 帅/将的移动规则
     */
    getKingMoves(x, y, isRed) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        // 九宫格范围
        const minX = 3, maxX = 5;
        const minY = isRed ? 7 : 0;
        const maxY = isRed ? 9 : 2;
        
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            
            if (newX >= minX && newX <= maxX && newY >= minY && newY <= maxY) {
                const target = this.getPiece(newX, newY);
                if (!target || this.isRed(target) !== isRed) {
                    moves.push({x: newX, y: newY});
                }
            }
        }
        
        // 检查对面照将
        const enemyKingPos = this.findEnemyKing(isRed);
        if (enemyKingPos && enemyKingPos.x === x) {
            let blocked = false;
            const startY = Math.min(y, enemyKingPos.y) + 1;
            const endY = Math.max(y, enemyKingPos.y);
            
            for (let checkY = startY; checkY < endY; checkY++) {
                if (this.getPiece(x, checkY)) {
                    blocked = true;
                    break;
                }
            }
            
            if (!blocked) {
                moves.push({x: enemyKingPos.x, y: enemyKingPos.y});
            }
        }
        
        return moves;
    }

    /**
     * 仕/士的移动规则
     */
    getAdvisorMoves(x, y, isRed) {
        const moves = [];
        const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
        
        const minX = 3, maxX = 5;
        const minY = isRed ? 7 : 0;
        const maxY = isRed ? 9 : 2;
        
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            
            if (newX >= minX && newX <= maxX && newY >= minY && newY <= maxY) {
                const target = this.getPiece(newX, newY);
                if (!target || this.isRed(target) !== isRed) {
                    moves.push({x: newX, y: newY});
                }
            }
        }
        
        return moves;
    }

    /**
     * 相/象的移动规则
     */
    getBishopMoves(x, y, isRed) {
        const moves = [];
        const directions = [[2, 2], [2, -2], [-2, 2], [-2, -2]];
        
        // 不能过河
        const maxY = isRed ? 9 : 4;
        const minY = isRed ? 5 : 0;
        
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            
            // 检查塞象眼
            const blockX = x + dx / 2;
            const blockY = y + dy / 2;
            
            if (newX >= 0 && newX < 9 && newY >= minY && newY <= maxY) {
                if (!this.getPiece(blockX, blockY)) {
                    const target = this.getPiece(newX, newY);
                    if (!target || this.isRed(target) !== isRed) {
                        moves.push({x: newX, y: newY});
                    }
                }
            }
        }
        
        return moves;
    }

    /**
     * 马的移动规则
     */
    getKnightMoves(x, y, isRed) {
        const moves = [];
        const directions = [
            [1, 2, 0, 1], [2, 1, 1, 0],
            [2, -1, 1, 0], [1, -2, 0, -1],
            [-1, -2, 0, -1], [-2, -1, -1, 0],
            [-2, 1, -1, 0], [-1, 2, 0, 1]
        ];
        
        for (const [dx, dy, blockX, blockY] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            
            // 检查蹩马腿
            if (!this.getPiece(x + blockX, y + blockY)) {
                if (newX >= 0 && newX < 9 && newY >= 0 && newY < 10) {
                    const target = this.getPiece(newX, newY);
                    if (!target || this.isRed(target) !== isRed) {
                        moves.push({x: newX, y: newY});
                    }
                }
            }
        }
        
        return moves;
    }

    /**
     * 车的移动规则
     */
    getRookMoves(x, y, isRed) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        for (const [dx, dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;
            
            while (newX >= 0 && newX < 9 && newY >= 0 && newY < 10) {
                const target = this.getPiece(newX, newY);
                
                if (!target) {
                    moves.push({x: newX, y: newY});
                } else {
                    if (this.isRed(target) !== isRed) {
                        moves.push({x: newX, y: newY});
                    }
                    break;
                }
                
                newX += dx;
                newY += dy;
            }
        }
        
        return moves;
    }

    /**
     * 炮的移动规则
     */
    getCannonMoves(x, y, isRed) {
        const moves = [];
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        
        for (const [dx, dy] of directions) {
            let newX = x + dx;
            let newY = y + dy;
            let jumped = false;
            
            while (newX >= 0 && newX < 9 && newY >= 0 && newY < 10) {
                const target = this.getPiece(newX, newY);
                
                if (!jumped) {
                    if (!target) {
                        moves.push({x: newX, y: newY});
                    } else {
                        jumped = true;
                    }
                } else {
                    if (target) {
                        if (this.isRed(target) !== isRed) {
                            moves.push({x: newX, y: newY});
                        }
                        break;
                    }
                }
                
                newX += dx;
                newY += dy;
            }
        }
        
        return moves;
    }

    /**
     * 兵/卒的移动规则
     */
    getPawnMoves(x, y, isRed) {
        const moves = [];
        
        // 是否过河
        const crossed = isRed ? y < 5 : y > 4;
        
        // 向前移动
        const forwardY = isRed ? y - 1 : y + 1;
        if (forwardY >= 0 && forwardY < 10) {
            const target = this.getPiece(x, forwardY);
            if (!target || this.isRed(target) !== isRed) {
                moves.push({x, y: forwardY});
            }
        }
        
        // 过河后可以左右移动
        if (crossed) {
            const leftX = x - 1;
            const rightX = x + 1;
            
            if (leftX >= 0) {
                const target = this.getPiece(leftX, y);
                if (!target || this.isRed(target) !== isRed) {
                    moves.push({x: leftX, y});
                }
            }
            
            if (rightX < 9) {
                const target = this.getPiece(rightX, y);
                if (!target || this.isRed(target) !== isRed) {
                    moves.push({x: rightX, y});
                }
            }
        }
        
        return moves;
    }

    /**
     * 查找敌方将/帅
     */
    findEnemyKing(isRed) {
        const enemyKing = isRed ? 'k' : 'K';
        
        for (let y = 0; y < 10; y++) {
            for (let x = 0; x < 9; x++) {
                if (this.board[y][x] === enemyKing) {
                    return {x, y};
                }
            }
        }
        
        return null;
    }

    /**
     * 执行移动
     */
    makeMove(fromX, fromY, toX, toY) {
        const piece = this.getPiece(fromX, fromY);
        const captured = this.getPiece(toX, toY);
        
        // 保存移动历史
        this.moveHistory.push({
            piece,
            captured,
            from: {x: fromX, y: fromY},
            to: {x: toX, y: toY},
            currentPlayer: this.currentPlayer
        });
        
        this.board[toY][toX] = piece;
        this.board[fromY][fromX] = null;
        
        // 切换玩家
        this.currentPlayer = this.currentPlayer === 'red' ? 'black' : 'red';
        
        // 检查是否将军或将死（在切换玩家后检查）
        if (captured && captured.toUpperCase() === 'K') {
            this.gameOver = true;
            // 获胜者是执行移动的玩家（即切换前的玩家）
            this.winner = this.currentPlayer === 'red' ? 'black' : 'red';
        }
        
        return {
            piece,
            captured,
            from: {x: fromX, y: fromY},
            to: {x: toX, y: toY},
            isRed: this.isRed(piece),
            currentPlayer: this.currentPlayer === 'red' ? 'black' : 'red' // 保存移动前的玩家
        };
    }

    /**
     * 撤销移动 - 悔棋功能（撤销两步：AI和玩家各一步）
     */
    undoMove() {
        // 至少需要两步才能悔棋
        if (this.moveHistory.length < 2) {
            console.log('悔棋失败：棋步不足');
            return null;
        }
        
        console.log('开始悔棋，当前棋步数:', this.moveHistory.length);
        
        // 撤销最后两步（AI的一步 + 玩家的一步）
        const moves = [];
        
        // 撤销第一步（最近的一步，通常是AI的）
        const lastMove = this.moveHistory.pop();
        if (lastMove) {
            const {piece, captured, from, to} = lastMove;
            this.board[from.y][from.x] = piece;
            this.board[to.y][to.x] = captured || null;
            moves.push(lastMove);
            console.log('撤销第一步:', lastMove);
        }
        
        // 撤销第二步（玩家的一步）
        const secondLastMove = this.moveHistory.pop();
        if (secondLastMove) {
            const {piece, captured, from, to} = secondLastMove;
            this.board[from.y][from.x] = piece;
            this.board[to.y][to.x] = captured || null;
            moves.push(secondLastMove);
            console.log('撤销第二步:', secondLastMove);
        }
        
        // 切换回红方（玩家）
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.winner = null;
        
        console.log('悔棋完成，当前玩家:', this.currentPlayer);
        console.log('剩余棋步数:', this.moveHistory.length);
        
        return moves;
    }

    /**
     * 撤销单步移动 - 供AI搜索使用
     * 只撤销一步棋，不修改moveHistory
     */
    undoSingleMove(moveResult) {
        if (!moveResult) return;
        
        const {piece, captured, from, to, currentPlayer} = moveResult;
        
        // 恢复棋盘状态
        this.board[from.y][from.x] = piece;
        this.board[to.y][to.x] = captured || null;
        
        // 恢复玩家
        this.currentPlayer = currentPlayer;
        
        // 恢复游戏状态
        this.gameOver = false;
        this.winner = null;
        
        // 从历史记录中移除（因为这是搜索过程，不是真实走法）
        if (this.moveHistory.length > 0) {
            const lastInHistory = this.moveHistory[this.moveHistory.length - 1];
            if (lastInHistory.from.x === from.x && lastInHistory.from.y === from.y &&
                lastInHistory.to.x === to.x && lastInHistory.to.y === to.y) {
                this.moveHistory.pop();
            }
        }
    }

    /**
     * 重置游戏
     */
    reset() {
        this.board = this.initBoard();
        this.currentPlayer = 'red';
        this.selectedPiece = null;
        this.gameOver = false;
        this.winner = null;
        this.moveHistory = []; // 清空移动历史
    }

    /**
     * 获取棋盘副本
     */
    getBoardCopy() {
        return this.board.map(row => [...row]);
    }
}
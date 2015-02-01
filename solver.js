var _ = require('underscore');
var fs = require('fs');
var colors = require('colors');

var displayBoard = function(b) {
    for (var i = 0; i < 9; i++) {
        var line = [];
        for (var c = 0; c < 9; c++) {
            var cell = b[i][c];
            if (cell.number) {
                var s = ''+cell.number;
                if (cell.initial) {
                    s = s.green;
                }
                if (cell.red) {
                    s = s.red;
                }
                line.push(s);
            } else {
                //console.log(b[i][c]);
                line.push(' ');
            }
        }
        console.log(line.join('  '));
    };
}

var board = [];
var checkRow = function(cell) {
    var row = board[cell.row];
    var number = cell.number;
    _.each(row, function(c) {
        c.remove(number);
    });
    //console.log(row);
};
var checkCol = function(cell) {
    var list = [];
    for(var i = 0; i < 9; i++) {
        list.push(board[i][cell.col]);
    }
    var number = cell.number;
    _.each(list, function(c) {
        c.remove(number);
    });
}

var checkBox = function(cell) {
    var startRow = Math.floor(cell.row / 3) * 3;
    var startCol = Math.floor(cell.col / 3) * 3;
    var number = cell.number;
    //console.log("For cell", cell.row, cell.col);
    for(var r = 0; r < 3; r++) {
        for(var c = 0; c < 3; c++) {
            //console.log(startRow+r, startCol+c);
            board[startRow+r][startCol+c].remove(number);
        }
    }
}

var makeCell = function(row, col, number) {

    var object = {
        number: number,
        possible: [1,2,3,4,5,6,7,8,9],
        row:row,
        col:col,
        initial: false,
        red: false
    }
    object.markInitial = function() {
        object.initial = true;
    };
    object.markRed = function() {
        object.red = true;
    };
    object.fill = function(n) {
        object.number = n;
        object.possible = [];
        displayBoard(board);
        console.log('=================');
        // Check row column and box
        //displayBoard(board);
        //console.log('=================');
        checkRow(object);
        //displayBoard(board);
        //console.log('=================');
        checkCol(object);
        //displayBoard(board);
        //console.log('=================');
        checkBox(object);
    };
    object.isFilled = function() {
        if (object.number) {
            return true;
        }
        return false;
    };
    object.remove = function(n) {
        object.possible = _.without(object.possible, n);
        if (object.possible.length === 1) {
            //console.log(object);
            object.fill(object.possible[0]);
        }
        //console.log(object.possible, n);
    }
    return object;

}

for (var i = 0; i < 9; i++) {
    board[i] = [];
    for (var c = 0; c < 9; c++) {
        board[i].push(makeCell(i, c, null));
    }
};

var string = fs.readFileSync('puzzle.txt').toString();
var parse = function(string) {
    var b = [];
    var lines = string.split('\n');
    _.each(lines, function(line) {
        var l = [];
        var cells = line.split('');
        _.each(cells, function(cell) {
            var number = null;
            if (cell != 'x') {
                number = parseInt(cell);
            }
            l.push(number);
        });
        b.push(l);
    });
    return b;
}

var populateBoard = function(b, a) {
    _.each(a, function(line, row) {
        _.each(line, function(n, col) {
            var cell = b[row][col];
            if (n) {
                cell.markInitial();
                cell.fill(n);
            }
        });
    });
}
var b2 = parse(string);
populateBoard(board, b2);
displayBoard(board);

var getUnsolvedCell = function(board) {
    for(var x = 0; x < 9; x++) {
        for(var y = 0; y < 9; y++) {
            var filled = board[x][y].isFilled();
            if (!filled) {
                return board[x][y];
            }
        }
    }
    return false;
}

// If the board is still unsolved
while(true) {
    var unsolvedCell = getUnsolvedCell(board);
    if (!unsolvedCell) return;
    var number = _.sample(unsolvedCell.possible);
    var number = unsolvedCell.possible[0];
    unsolvedCell.markRed();
    unsolvedCell.fill(number);
}

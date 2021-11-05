Setup:
    npm run setup
    npm start
    localhost:8080 / 127.0.0.1:8080

How to play:
    1)press start
    2)click on a letter to select it
    3)click elsewhere (ie: on the board) to move the letter
    4)when your turn is finished, click "player x end turn"
    5)if you make a mistake, dont worry! just press reset
    6)your score will be calculated and the next player may take their turn
    7)the game ends when there are no tiles left

other info:
    Blue box is player 1's score
    Red box is player 2's score
    the other box indicates whether a move is valid or not
    its all client side (right now) so dont refresh lol

rationale:
    Used clicking instead of dragging so it can potentially work on mobile devices more smoothly
    Used a server for a mostly client based program so that it can be run according to spec and still interfact with csw.txt
        also planning on moving most things to server side

Unfinished so far:
    transfering stuff over to server side instead of abhorrent client side data manipulation
        case in point the 4d array MaRA[]

Future work:
    online multiplayer
        board state is saved between turns to accomodate for this when needed
    custom boards

bugs i know about:
    when resetting your turn, reset tiles have incorrect styling
    after being placed on the board, tiles have incorrect styling
    when extending a word (dust > dusty) program doesnt look at dusty, just ty
    when placing a word underneath another, but not including that word (creating two words), the program does not recognise it. (queue => )
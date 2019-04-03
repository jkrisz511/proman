// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    _appendToElement: function (elementToExtend, textToAppend, prepend = false) {
        // function to append new DOM elements (represented by a string) to an existing DOM element
        let fakeDiv = document.createElement('div');
        fakeDiv.innerHTML = textToAppend.trim();

        for (let childNode of fakeDiv.childNodes) {
            if (prepend) {
                elementToExtend.prependChild(childNode);
            } else {
                elementToExtend.appendChild(childNode);
            }
        }

        return elementToExtend.lastChild;
    },
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardList = '';

        for(let board of boards){
            boardList += `
                <section class="board">
                    <div class="board-header"><span id=${board.id} class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    
                    <div class="board-columns">
                        <div class="board-column">
                            <div class="board-column-title">New</div>
                            <div class="board-column-content">
                            
                            </div>
                        </div>
                        <div class="board-column">
                            <div class="board-column-title">In Progress</div>
                            <div class="board-column-content">
                            
                            </div>
                        </div>
                        <div class="board-column">
                            <div class="board-column-title">Testing</div>
                            <div class="board-column-content">
                            
                            </div>
                        </div>
                        <div class="board-column">
                            <div class="board-column-title">Done</div>
                            <div class="board-column-content">
                            
                            </div>
                        </div>
                    </div>
                </section>
            `;

        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        this._appendToElement(document.querySelector('#boards'), outerHtml);

        //Add new board
        const newBoard = document.querySelector('#create-board')
        newBoard.addEventListener('click', dom.createBoard)

        // Toggle the board
        const buttons = document.querySelectorAll('.board-toggle')
        buttons.forEach(function(currentBtn){
        currentBtn.addEventListener('click', dom.toggleBoard)
        })

        //Edit board title
        dom.editBoard();

    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
    createBoard: function () {
        dataHandler.createNewBoard( function (board) {
            let createdBoard = `<section class="board">
                    <div class="board-header"><span id="" class="board-title">${board.title}</span>
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                    </div>  
                
                        
                        <div class="board-columns">
                            <div class="board-column">
                                <div class="board-column-title">New</div>
                                <div class="board-column-content">
                                
                                </div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">In Progress</div>
                                <div class="board-column-content">
                                
                                </div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">Testing</div>
                                <div class="board-column-content">
                                
                                </div>
                            </div>
                            <div class="board-column">
                                <div class="board-column-title">Done</div>
                                <div class="board-column-content">
                                
                                </div>
                            </div>
                        </div>
                    </section>
            `;

            const outerHtml = `
                <div class="board-container">
                    ${createdBoard}
                </div>
            `;


            dom._appendToElement(document.querySelector('#boards'), outerHtml);

            // Toggle the board
            const buttons = document.querySelectorAll('.board-toggle')
            buttons.forEach(function(currentBtn){
            currentBtn.addEventListener('click', dom.toggleBoard)
            })


            //Edit board title
            dom.editBoard();
        })


    },
    toggleBoard: function () {
          const columnBoardId = this.parentNode.nextElementSibling;
          columnBoardId.classList.toggle("hidden")
    },


    editBoard: function () {
        const boardTitles = document.querySelectorAll('.board-title')
        console.log(boardTitles);
        for (let boardTitle of boardTitles) {
            boardTitle.addEventListener('click', function () {
               dom.renameBoardTitle(boardTitle);
            })
        }
    },
    renameBoardTitle: function (boardTitle) {
         boardTitle.innerHTML = `<input type="text" name="new_title" placeholder="Title" required>`;
         boardTitle.firstElementChild.focus();
         boardTitle.firstElementChild.addEventListener('blur', function () {
            let newTitle = this.value;
            dataHandler.renameBoard(boardTitle.id, newTitle, function () {
                boardTitle.innerHTML = `<span>${newTitle}</span>`;
            });
         });
    }

};


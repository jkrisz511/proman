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
                <section id="board-${board.id}" class="board">
                        <div class="board-header"><span id=${board.id} class="board-title">${board.title}</span>
                            <button class="board-add">Add Card</button>
                            <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                        </div>
                        
                        <div class="board-columns">
                            <div class="col-1 board-column">
                                <div class="board-column-title" id="column-${board.status_id[0]}">${board.status_title[0]}</div>
                            
                            </div>
                            <div class="col-2 board-column">
                                <div class="board-column-title" id="column-${board.status_id[1]}">${board.status_title[1]}</div>
                                
                            </div>
                            <div class="col-3 board-column">
                                <div class="board-column-title" id="column-${board.status_id[2]}">${board.status_title[2]}</div>
                                
                            </div>
                            <div class="col-4 board-column">
                                <div class="board-column-title" id="column-${board.status_id[3]}">${board.status_title[3]}</div>
                                
                            </div>
                        </div>
                    </section>
            `;

            //load cards
            this.loadCards(board.id);
        }

        const outerHtml = `
            <div class="board-container">
                ${boardList}
            </div>
        `;

        this._appendToElement(document.querySelector('#boards'), outerHtml);

        //Add new board
        const newBoard = document.querySelector('#create-board');
        newBoard.addEventListener('click', dom.createBoard);

        // Toggle the board
        const buttons = document.querySelectorAll('.board-toggle');
        buttons.forEach(function(currentBtn){
            currentBtn.addEventListener('click', dom.toggleBoard);
        });

        //Edit board title
        dom.editBoard();

        //Edit column title
        dom.editColumn();

        //Add new card
        const addButtons = document.querySelectorAll('.board-add');

        for (let button of addButtons) {

            button.addEventListener('click', function () {
                let boardIdText = button.closest('.board').getAttribute('id');
                let boardIdNumber = boardIdText.slice(-1);
                dom.createCard(boardIdNumber);
            });
        }

    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards);
            dom.editCard();
        })
    },

    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards) {
            const boardDiv = document.querySelector(`#board-${card['board_id']}`);
            const colDiv = boardDiv.querySelector(`.col-${card["statuses_id"]}`);
            this._appendToElement(colDiv, `
                <div data-card-id="${card.id}" class="card">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title">${card["title"]}</div>
                </div>`
            );
        }

    },

     showCard: function(card) {

            const boardDiv = document.querySelector(`#board-${card['board_id']}`);
            const colDiv = boardDiv.querySelector(`.col-${card["statuses_id"]}`);
            this._appendToElement(colDiv, `
                <div  data-card-id="${card.id}" class="card">
                    <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                    <div class="card-title">${card["title"]}</div>
                </div>`
            );
    },

    // here comes more features
    createBoard: function () {
        dataHandler.createNewBoard( function (board) {
            board = board[0];
            let createdBoard = `
                    <section id="board-${board.id}" class="board">
                        <div class="board-header"><span id=${board.id} class="board-title">${board.title}</span>
                            <button class="board-add">Add Card</button>
                            <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                        </div>
                        
                        <div class="board-columns">
                            <div class="col-1 board-column">
                                <div class="board-column-title" id="column-${board.status_id[0]}">${board.status_title[0]}</div>
                            
                            </div>
                            <div class="col-2 board-column">
                                <div class="board-column-title" id="column-${board.status_id[1]}">${board.status_title[1]}</div>
                                
                            </div>
                            <div class="col-3 board-column">
                                <div class="board-column-title" id="column-${board.status_id[2]}">${board.status_title[2]}</div>
                                
                            </div>
                            <div class="col-4 board-column">
                                <div class="board-column-title" id="column-${board.status_id[3]}">${board.status_title[3]}</div>
                                
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
            const buttons = document.querySelectorAll('.board-toggle');
            buttons.forEach(function(currentBtn){
                currentBtn.addEventListener('click', dom.toggleBoard);
            });


            //Edit board title
            dom.editBoard();

            //Edit column title
            dom.editColumn();

            //Add new card
            const addButtons = document.querySelectorAll('.board-add');
            for (let button of addButtons) {
                button.addEventListener('click', function () {
                    let boardIdText = button.closest('.board').getAttribute('id');
                    console.log(button);
                    let boardIdNumber = boardIdText.slice(-1);
                    console.log(boardIdText);
                    dom.createCard(boardIdNumber);
                });
            }

        });


    },
    toggleBoard: function () {
          const columnBoardId = this.parentNode.nextElementSibling;
          columnBoardId.classList.toggle("hidden");
    },


    editBoard: function () {
        const boardTitles = document.querySelectorAll('.board-title');
        for (let boardTitle of boardTitles) {
            boardTitle.addEventListener('click', dom.renameBoardTitle);
        }
    },
    renameBoardTitle: function (e) {
         let boardTitle = e.currentTarget;
         boardTitle.innerHTML = `<input type="text" name="new_title" placeholder="${boardTitle.textContent}" required>
                                 <button class="board-add">Save</button>`;
         boardTitle.firstElementChild.focus();
         boardTitle.firstElementChild.addEventListener('blur', function () {
            let newTitle = this.value;
            if (newTitle !== '') {
                dataHandler.renameBoard(boardTitle.id, newTitle, function () {
                    boardTitle.innerHTML = `<span>${newTitle}</span>`;
                });
            }

         });
         boardTitle.children[1].addEventListener('click', function () {
            let newTitle = this.value;
            if (newTitle !== '') {
                dataHandler.renameBoard(boardTitle.id, newTitle, function () {
                    boardTitle.innerHTML = `<span>${newTitle}</span>`;
                });
            }
         });
    },

    createCard: function (boardId) {
        dataHandler.createNewCard(boardId, function (card) {
            dom.showCard(card);
            //Edit card title
            dom.editCard();
        })
    },
    editCard: function () {
        console.log('hello');
        const boards = document.querySelectorAll('.board');
        for (let board of boards) {
            const columns = board.querySelectorAll('.board-column');
            for (let column of columns) {
                const cardTitles = column.querySelectorAll('.card-title');

                for (let cardTitle of cardTitles) {
                    console.log(cardTitle);

                    cardTitle.addEventListener('click', dom.renameCardTitle);
                }
            }
        }
    },
    renameCardTitle: function (e) {
         let cardTitle = e.currentTarget;
         cardTitle.innerHTML = `<input type="text" name="new_title" placeholder="${cardTitle.textContent}" required>`;
         cardTitle.firstElementChild.focus();
         cardTitle.firstElementChild.addEventListener('blur', function () {
            let newTitle = this.value;
            console.log(newTitle);
            let cardDataId = cardTitle.closest('.card').getAttribute('data-card-id');

            if (newTitle !== '') {
                dataHandler.renameCard(cardDataId, newTitle, function () {
                    cardTitle.innerHTML = `<span>${newTitle}</span>`;
                });
            }

         });
    },
    editColumn: function () {
        const boards = document.querySelectorAll('.board');
        for (let board of boards) {
            const columnTitles = board.querySelectorAll('.board-column-title');
            for (let columnTitle of columnTitles) {
                columnTitle.addEventListener('click', dom.renameColumnTitle);
            }
        }
    },
    renameColumnTitle: function (e) {
         let columnTitle = e.currentTarget;
         columnTitle.innerHTML = `<input type="text" name="new_title" placeholder="${columnTitle.textContent}" required>`;
         columnTitle.firstElementChild.focus();
         columnTitle.firstElementChild.addEventListener('blur', function () {
            let newTitle = this.value;
            let colId = columnTitle.getAttribute('id').slice(-1);
            if (newTitle !== '') {
                dataHandler.renameColumn(colId, newTitle, function () {
                    columnTitle.innerHTML = `<span>${newTitle}</span>`;
                });
            }

         });
    }
};


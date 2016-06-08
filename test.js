var controller;

$(document).ready(function () {
    'use strict';
/*
    class Field {

        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.snakePartId = 0
        }

        createCell(dataX, dataY) {
            $(`<div class='snakeCellSmall' data-partSnakeId='${this.snakePartId}'></div>`).appendTo("#gameField");
            let snakePart = $(`div[data-partSnakeId=${this.snakePartId}]`);
            snakePart.css({
                'left': `${dataX*25}px`,
                'top': `${dataY*25}px`
            });
            snakePart.on("animationend", function(){
                $(this).css({
                    'height': '25px'
                });
            });
            this.snakePartId++;
        }

        fillBackground () {
            for (let i=0; i<this.height*this.width; i++) {
                $("<div class='fieldBackgroundCell'></div>").appendTo("#gameField");
            }
        }

    }

    var some = new Field(20, 20);
    some.fillBackground();
    some.createCell(0,0);
    let i = 10;
    $('#makePartSnake').click(function () {
        some.createCell(5, i);
        i++


    some.createCell(5,9);
*/


    class Controller {

        constructor () {
            this.amd = false;
            this.nvidia = false;
            this.ati = false
        }

        static drawTable (manufacturerData, manufacturerLiteral) {
            $('h2').text('Сравнительные таблицы графических карт ' + manufacturerLiteral);
            $('#fullDescription').css('display', 'block');
            $('#amdTable').html('');
            $('#nvidiaTable').html('');
            $('#atiTable').html('');
            let table = new Table(manufacturerLiteral, manufacturerData.cardsData, config.legend[manufacturerLiteral], config.breakCards[manufacturerLiteral]);
            table.createTable();
            let selector = `#${manufacturerLiteral}Table`;
            $(selector).html(table.tableHTML);
        }

        checkDrawTable (manufacturerData, manufacturerLiteral, ...uselessLiterals) {
            if (!this[manufacturerLiteral]) {
                Controller.drawTable(manufacturerData, manufacturerLiteral);
                uselessLiterals.forEach( (manufacturer) => {
                    this[manufacturer]  = false
                })
            }
        }

        drawAmdTable () {
            this.checkDrawTable(amd, 'amd', 'nvidia', 'ati')
        }
        drawNvidiaTable () {
            this.checkDrawTable(nvidia, 'nvidia', 'amd', 'ati')
        }
        drawAtiTable () {
            this.checkDrawTable(ati, 'ati', 'nvidia', 'amd')
        }
    }

    class Config {

        constructor (breakCards, options) {
            this.rawHTML = {};
            this.newCardsData = {};
            this.legend = {};
            this.breakCards = breakCards;
            this.description = ``;
            this.options = options
        }

        static getConfigPartViaAjax (uri) {
            return new Promise ( (resolve) => {
                    $.get(uri, (data) => {
                        resolve(data)
                    });
            });
        }


        setConfigPart (name, data, type) {
            if (type) {
                Object.defineProperty(this[type], name, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: data
                })
            } else {
                this[name] = data
            }
        }

        defineAllConfig () {
            let urls = [];
            this.options.forEach( (option) => {
                urls.push(option.path)
            });
            return Promise.all(urls.map(Config.getConfigPartViaAjax))
                .then( (data) => {
                    for (let i=0; i<this.options.length; i++) {
                        let name = this.options[i].name;
                        let type = this.options[i].type;
                        this.setConfigPart(name, data[i], type)
                    }
                })
        }

    }


    class Parse {
        constructor (html) {
            this.html = html;
            this.cardsHTML = [];
            this.cardsData = []
        }

        removeSuperscript () {
            let regExp = /<sup>.+?<\/sup>/g;
            this.html = this.html.replace(regExp, '');
        }

        splitOnCards () {
            let regExp = /<tr[\s\S]+?<\/tr>/g;
            this.cardsHTML = this.html.match(regExp);
            this.deleteLegend(0)
        }

        deleteLegend (index) {
            let regExp = /<th.+?<\/th>/g;
            for (let i=index; i<this.cardsHTML.length; i++) {
                if (this.cardsHTML[i].match(regExp)) {
                    this.cardsHTML.splice(i, 1);
                    this.deleteLegend(i);
                    break
                }
            }
        }


        static splitOnCells (tableRow) {
            let regExp = /<td[^>]*>(.+?)<\/td>/g;
            let cells = [];
            let regExpResult;
            while ((regExpResult = regExp.exec(tableRow)) !== null) {
                cells.push(regExpResult[1])
            }
            cells.push('-');
            cells.push('-');
            return Parse.deleteBreaks(cells);
        }

        static deleteBreaks (row) {
            let regExp = /<br>/;
            for (let i=0; i<row.length; i++) {
                if (row[i].match(regExp)) {
                    let splitData = row[i].split(regExp);
                    row.splice(i, 1, splitData)
                }
            }
            return row
        }

        transformBasicData () {
            this.removeSuperscript();
            this.splitOnCards();
            this.saveData()
        }

    }


    class ATI extends Parse {

        saveData () {
            for (let i=0; i<this.cardsHTML.length; i++) {
                this.cardsData.push(Parse.splitOnCells(this.cardsHTML[i]))
            }
        }


    }

    class AMD extends Parse{

        splitOnCards () {
            super.splitOnCards();
            let self = this;
            let regExp = /rowspan="([\d])"/;
            for (let i=0; i<self.cardsHTML.length; i++) {
                let result;
                if (result = self.cardsHTML[i].match(regExp)) {
                    let rowsNumber = parseInt(result[1]);
                    let rows = [self.cardsHTML[i]];
                    for (let j = 1; j < rowsNumber; j++) {
                        rows.push(self.cardsHTML[i + j])
                    }
                    self.cardsHTML.splice(i, rowsNumber, rows);
                }
            }
        }

        saveData () {
            this.cardsHTML.forEach( (row) => {
                if (typeof row === 'string') {
                    this.cardsData.push(Parse.splitOnCells(row))
                } else {
                    let cellsWithoutSpanLogic = [];
                    for (let i=0; i<row.length; i++) {
                        cellsWithoutSpanLogic.push(Parse.splitOnCells(row[i]))
                    }
                    let spanCells = AMD.findMultipleSpans(row[0]);
                    for (let i=0; i<cellsWithoutSpanLogic[0].length-2; i++) {
                        if (!spanCells[i]) {
                            let cellData = [cellsWithoutSpanLogic[0][i]];
                            for (let j=1; j<cellsWithoutSpanLogic.length; j++) {
                                cellData.push(cellsWithoutSpanLogic[j][0]);
                                cellsWithoutSpanLogic[j].shift()
                            }
                            cellsWithoutSpanLogic[0][i] = cellData
                        }
                    }
                    this.cardsData.push(cellsWithoutSpanLogic[0])
                }
            })
        }

        static findMultipleSpans (row) {
            let regExp = /<td(?: align="left")?(?: rowspan="([\d])")?>.*?<\/td>/g;
            let regExpResult;
            let spans = [];
            while ((regExpResult = regExp.exec(row)) !== null) {
                    spans.push(regExpResult[1])
            }
            return spans
        }

    }

    class Nvidia extends AMD{

    }

    class Table {

        constructor (name, cardsData, legend, breakCards) {
            this.name = name;
            this.legend = legend;
            this.breakCards = breakCards;
            this.cardsData = cardsData;
            this.tableHTML = ``
        }

        createTable () {
            let cardNumber = 0;
            this.tableHTML += '<table border="0" cellpadding="2" cellspacing="1" align="center"><tbody>';
            this.tableHTML += this.legend;
            this.cardsData.forEach( (videoCard) => {
                cardNumber++;
                let lastCardInTablePart = this.checkBreakCard(videoCard[0]);
                let backgroundColor = 'style="background-color:#';
                if (cardNumber % 2 === 0) {
                    backgroundColor += 'eeeeee"'
                } else {
                    backgroundColor += 'fafafa"'
                }
                let row = `<tr align="center" ${backgroundColor}>`;
                for (let j=0; j<videoCard.length; j++) {
                    let openingTag = '<td>';
                    if (j===0) {
                        openingTag = '<td align="left">'
                    }
                    if (typeof videoCard[j] === 'string') {
                        row += `${openingTag}${videoCard[j]}</td>`
                    } else {
                        let data = `${openingTag}`;
                        for (let i=0; i<videoCard[j].length; i++) {
                            data += videoCard[j][i];
                            if (i+1 !== videoCard[j].length) {
                                data += '<br>'
                            }
                        }
                        data += `</td>`;
                        row += data
                    }
                }
                row += '</tr>';
                this.tableHTML += row;
                if (lastCardInTablePart) {
                    this.tableHTML += this.legend
                }
            });
            this.tableHTML += this.legend;
            this.tableHTML += '</tbody></table>'
        }

        checkBreakCard (videoCardAlias) {
            var breakCard = false;
            var alias = ``;
            if (Array.isArray(videoCardAlias)) {
                alias = videoCardAlias[0]
            } else {
                alias = videoCardAlias
            }
            this.breakCards.forEach( (lastCard) => {
                if (alias.search(lastCard) !== -1) {
                    breakCard = true;
                }
            });
            return breakCard
        }

    }

    class CardsEdit {

        static createCard (options) {
            let cardData = [options.name, options.releaseDate, options.core, options.memoryVolume, options.cardInterface, options.coreClock, options.memoryType, options.memoryEffectiveClock, options.memoryBus, options.MBW, options.configCore, options.pxFillRate, options.txFillRate, options.FP32, options.FP64, options.TDP, options.dx9, options.dx10];
            for (let i=0; i<cardData.length; i++) {
                if (typeof cardData[i] === 'number') {
                    cardData[i] = cardData[i].toString()
                }
            }
            if (options.manufacturer === 'nvidia') {
                cardData.splice(6,0, '-')
            }
            return cardData
        }

        static addCards (cardsDataObject, newCardsString) {
            let pureCardsData = JSON.parse(newCardsString);
            pureCardsData.forEach( (newVideoCard) => {
                let cardData = CardsEdit.createCard(newVideoCard);
                let insertAfterCardIndex = CardsEdit.findCardIndexByName(cardsDataObject, newVideoCard.insertAfter);
                cardsDataObject.splice(insertAfterCardIndex, 0, cardData)
            })
        }

        static editCards (cardsDataObject, changingOptions) {
            changingOptions.forEach ( (change) => {
                let cardNumber = CardsEdit.findCardIndexByName(cardsDataObject, change[0]);
                cardsDataObject[cardNumber][change[1]] = change[2]
            })
        }

        static addFps (cardsDataObject, manufacturer, cardsAndFps) {
            cardsAndFps.forEach( (change) => {
                let cardNumber = CardsEdit.findCardIndexByName(cardsDataObject, change[0]);
                let dx9Position = 16;
                let dx10Position = 17;
                if (manufacturer==='nvidia') {
                    dx9Position++;
                    dx10Position++;
                }
                cardsDataObject[cardNumber][dx9Position] = change[1].toString();
                cardsDataObject[cardNumber][dx10Position] = change[2].toString();
            })
        }

        static findCardIndexByName (list, searchingCard) {
            let bestCard;
            for (let i=0; i<list.length; i++) {
                let possibleCardName = list[i][0];
                if (Array.isArray(possibleCardName)) {
                    let cardNameString = '';
                    possibleCardName.forEach( (tableRow) => {
                        cardNameString += tableRow
                    });
                    possibleCardName = cardNameString
                }
                possibleCardName = CardsEdit.deleteParentheses(possibleCardName);
                let searchingCardName = CardsEdit.deleteParentheses(searchingCard);

                if (possibleCardName.search(searchingCardName) !== -1) {
                    if (!bestCard) {
                        bestCard = {
                            index: i,
                            possibleNameLength: possibleCardName.length
                        }
                    } else if (possibleCardName.length < bestCard.possibleNameLength) {
                        bestCard.index = i;
                        bestCard.possibleNameLength = possibleCardName.length
                    }
                }

            }
            if (bestCard) {
                return bestCard.index
            } else {
                console.log(searchingCardName);
                console.log(list);
                throw new Error ('There is no such card in whole list')
            }
        }

        static deleteParentheses (string) {
            let regExp = /\(|\)/g;
            return (string.replace(regExp, '-'))
        }



    }


    let options = [{
        path: 'config/rawHTML/amd.txt',
        name: 'amd',
        type: 'rawHTML'
    }, {
        path: 'config/rawHTML/nvidia.txt',
        name: 'nvidia',
        type: 'rawHTML'
    }, {
        path: 'config/rawHTML/ati.txt',
        name: 'ati',
        type: 'rawHTML'
    }, {
        path: 'config/legend/amd.txt',
        name: 'amd',
        type: 'legend'
    }, {
        path: 'config/legend/nvidia.txt',
        name: 'nvidia',
        type: 'legend'
    }, {
        path: 'config/legend/ati.txt',
        name: 'ati',
        type: 'legend'
    }, {
        path: 'config/rawDescription.txt',
        name: 'description'
    }, {
        path: 'config/newCards/amd.txt',
        name: 'amd',
        type: 'newCardsData'
    }, {
        path: 'config/newCards/nvidia.txt',
        name: 'nvidia',
        type: 'newCardsData'
    }];
    let breakCards = {
        amd: ['R5 330', 'R7 240', 'HD 7350', 'HD 6350', 'HD 5450', 'HD 4350', 'HD 3430'],
        nvidia: ['950', '710', '605', '510', '405', '310', '205', 'G100', '9300 GE'],
        ati:  ['X1050', 'X300 SE', '9500 Pro']
    };

    controller = new Controller();
    let ati, amd, nvidia;

    let config = new Config(breakCards, options);
    config.defineAllConfig()
        .then( () => {
            ati = new ATI(config.rawHTML.ati);
            ati.transformBasicData();


            amd = new AMD(config.rawHTML.amd);
            amd.transformBasicData();
            nvidia = new Nvidia(config.rawHTML.nvidia);
            nvidia.transformBasicData();





            CardsEdit.addCards(amd.cardsData, config.newCardsData.amd);
            CardsEdit.addCards(nvidia.cardsData, config.newCardsData.nvidia);


            let changedProperties = [['R9 380', 17, '800']];
            CardsEdit.editCards(amd.cardsData, changedProperties);

            let addingFps = [['R9 Fury X', 247, 183], ['R9 Nano', 226, 169], ['R9 Fury', 240, 174], ['390X', 220, 167], ['390', 206, 158], ['380X', 161, 114], ['380', 146, 105], ['370', 94.5, 73.8], ['360', 80.1, 62], ['290X', 213, 160], ['290', 198, 149], ['280X', 141, 101], ['280', 125, 89.6],
                 ['285', 142, 102], ['270X', 115, 83], ['270', 103, 75], ['260X', 85.9, 63], ['265', 88.9, 69.2], ['250', 37.3, 27], ['250X', 52.9, 38.8], ['240', 24.9, 18.7], ['7970', 140, 103], ['7950', 118, 84.7], ['7870', 113, 80.9], ['7850', 85.6, 65.9]
                , ['7790', 84.9, 63.7], ['7770', 55.3, 40.3], ['7750', 36.2, 28.1], ['7670', 23.1, 17.7], ['7570', 19.5, 15.5], ['7470/7450', '8.5<br>6.64', '5.51<br>4.7'], ['7350', 5, 3.78], ['7950', 118, 84.7], ['7950', 118, 84.7], ['7950', 118, 84.7], ['7950', 118, 84.7], ['7950', 118, 84.7]];
            CardsEdit.addFps(amd.cardsData, 'amd', addingFps)











        });







});
















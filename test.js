'use strict';
var controller;



class Controller {

    constructor() {
        this.amd = false;
        this.nvidia = false;
        this.ati = false
    }

    static drawTable(manufacturerData, manufacturerLiteral) {
        $('h2').text('Сравнительные таблицы графических карт ' + manufacturerLiteral);
        $('#fullDescription').css('display', 'block');
        $('#amdTable').html('');
        $('#nvidiaTable').html('');
        $('#atiTable').html('');
        let table = new Table(manufacturerLiteral, manufacturerData.cardsData, configData.legend[manufacturerLiteral], configData.breakCards[manufacturerLiteral]);
        table.createTable();
        let selector = `#${manufacturerLiteral}Table`;
        $(selector).html(table.tableHTML);
    }

    checkDrawTable(manufacturerData, manufacturerLiteral, ...uselessLiterals) {
        if (!this[manufacturerLiteral]) {
            Controller.drawTable(manufacturerData, manufacturerLiteral);
            uselessLiterals.forEach((manufacturer) => {
                this[manufacturer] = false
            })
        }
    }

    drawAmdTable() {
        this.checkDrawTable(amd, 'amd', 'nvidia', 'ati')
    }

    drawNvidiaTable() {
        this.checkDrawTable(nvidia, 'nvidia', 'amd', 'ati')
    }

    drawAtiTable() {
        this.checkDrawTable(ati, 'ati', 'nvidia', 'amd')
    }
}

class Config {

    constructor(breakCards, options) {
        this.legend = {};
        this.oldCards = {};
        this.breakCards = breakCards;
        this.options = options
    }

    static getConfigPartViaAjax(uri) {
        return new Promise((resolve) => {
            $.get(uri, (data) => {
                resolve(data)
            });
        });
    }


    setConfigPart(name, data, type) {
        let self  = this;
            Object.defineProperty(self[type], name, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: data
            })
    }

    defineAllConfig() {



        let urls = [];
        this.options.forEach((option) => {
            urls.push(option.path)
        });
        return Promise.all(urls.map(Config.getConfigPartViaAjax))
            .then((data) => {
                for (let i = 0; i < this.options.length; i++) {
                    let name = this.options[i].name;
                    let type = this.options[i].type;
                    this.setConfigPart(name, data[i], type)
                }
            })



    }

}





class Table {

    constructor(name, cardsData, legend, breakCards) {
        this.name = name;
        this.legend = legend;
        this.breakCards = breakCards;
        this.cardsData = cardsData;
        this.tableHTML = ``
    }

    createTable() {
        let cardNumber = 0;
        this.tableHTML += '<table border="0" cellpadding="2" cellspacing="1" align="center"><tbody>';
        this.tableHTML += this.legend;
        this.cardsData.forEach((videoCard) => {
            cardNumber++;
            let lastCardInTablePart = this.checkBreakCard(videoCard[0]);
            let backgroundColor = 'style="background-color:#';
            if (cardNumber % 2 === 0) {
                backgroundColor += 'eeeeee"'
            } else {
                backgroundColor += 'fafafa"'
            }
            let row = `<tr align="center" ${backgroundColor}>`;
            for (let j = 0; j < videoCard.length; j++) {
                if (Table.isUrl(videoCard[j])) continue;
                let openingTag = '<td>';
                if (j === 0) {
                    openingTag = '<td align="left">'
                }
                if (typeof videoCard[j] === 'string') {
                    row += `${openingTag}${videoCard[j]}</td>`
                } else {
                    let data = `${openingTag}`;
                    for (let i = 0; i < videoCard[j].length; i++) {
                        data += videoCard[j][i];
                        if (i + 1 !== videoCard[j].length) {
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

    static isUrl (data) {
        if ((typeof data === 'string') && (data.match(/http/))) {
            return true
        }
    }

    checkBreakCard(videoCardAlias) {
        var breakCard = false;
        var alias = ``;
        if (Array.isArray(videoCardAlias)) {
            alias = videoCardAlias[0]
        } else {
            alias = videoCardAlias
        }
        this.breakCards.forEach((lastCard) => {
            if (alias.search(lastCard) !== -1) {
                breakCard = true;
            }
        });
        return breakCard
    }

}




    let options = [{
        path: 'config/oldCards/amd.txt',
        name: 'amd',
        type: 'oldCards'
    }, {
        path: 'config/oldCards/nvidia.txt',
        name: 'nvidia',
        type: 'oldCards'
    }, {
        path: 'config/oldCards/ati.txt',
        name: 'ati',
        type: 'oldCards'
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
    }];
    let breakCards = {
        amd: ['R5 330', 'R7 240', 'HD 7350', 'HD 6350', 'HD 5450', 'HD 4350', 'HD 3430'],
        nvidia: ['950', '710', '605', '510', '405', '310', '205', 'G100', '9300 GE'],
        ati:  ['X1050', 'X300 SE', '9500 Pro']
    };

    controller = new Controller();
    let [ati, nvidia, amd] = [{}, {}, {}];

    let configData = new Config(breakCards, options);
    configData.defineAllConfig()
        .then( () => {
            amd.cardsData = JSON.parse(configData.oldCards.amd);
            nvidia.cardsData = JSON.parse(configData.oldCards.nvidia);
            ati.cardsData = JSON.parse(configData.oldCards.ati);
        });




class Parse {

    constructor (html) {
        this.html = html;
        this.heading = ``;
        this.dx9 = ``;
        this.dx10 = ``
    }

    findHeading () {
        let regExp = /<thead>[\s\S]*?Splatting[\s\S]*?<\/thead>/g;
        this.heading = this.html.match(regExp)[0];
    }

    findFPS () {
        let regExp = /([\d]+(\.[\d]+)?)<span class="tc-units"> fps/g;
        let regExpResult;
        let fps = [];
        while ((regExpResult = regExp.exec(this.heading)) !== null) {
            fps.push(regExpResult[1])
        }
        this.dx9 = fps[0];
        this.dx10 = fps[1]
    }

}




class SubDomainAjax {

    constructor (url) {
        this.url = url;
    }

    getHTML () {
        return new Promise ( (resolve) => {
            $.post( "/getPageHTML", { pageUri: this.url} )
                .done( data => {
                    resolve (data)
                });
        });
    }

}

/*let nvidia1080 = new SubDomainAjax('https://webproxy.stealthy.co/browse.php?u=http%3A%2F%2Fgpu.userbenchmark.com%2FNvidia-GTX-780-Ti%2FRating%2F2165&b=28');
nvidia1080.getHTML()
    .then( (receivedHtml) => {
        let parse = new Parse(receivedHtml);
        parse.findHeading();
        parse.findFPS();
        console.log(`length in symboles of html is ${receivedHtml.length}`);
        console.log(`length in symboles of heading is ${parse.heading.length}`);
        console.log(`dx9 fps is ${parse.dx9}`);
        console.log(`dx10 fps is ${parse.dx10}`);
    });
*/




let results = [];

function fps (name, url) {
    return new Promise( (resolve, reject) => {
        let ajax = new SubDomainAjax(url);
        ajax.getHTML()
            .then( (result) => {
                let parse = new Parse(result);
                parse.findHeading();
                parse.findFPS();
                let card = {
                    name: name,
                    dx9: parse.dx9,
                    dx10: parse.dx10
                };
                results.push(card);
                console.log('data retrieved');
                resolve ('success')
            }, error => {
                reject (error)
            })
    })
}

function findFPS () {
    counts++;
    if (counts>5) {
        return
    }
    nvidia.cardsData.forEach( (card) => {
        if (Table.isUrl(card[card.length-1])) {
            console.log('find some url in cardData');
            fps(card[0], card[card.length-1])
        }
    })
}












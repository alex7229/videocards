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
        let table = new Table(manufacturerLiteral, manufacturerData.cardsData, config.legend[manufacturerLiteral], config.breakCards[manufacturerLiteral]);
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


let rawHTML = ``;
(function setRawHTML () {
    rawHTML = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"><head><script type="text/javascript" src="/javax.faces.resource/jsf.js.jsf?ln=javax.faces"></script>
	<meta property="fb:app_id" content="210090749109390" />
	
	<title>UserBenchmark: Nvidia GTX 950 </title>
	<meta http-equiv="content-type" content="text/html; charset=UTF-8" />

	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
	<link rel="stylesheet" href="http://www.userbenchmark.com/resources/userbenchmark.css?1465343856485a" type="text/css" /><!--[if lt IE 9]>      <script src="/resources/js/html5_shiv.js"></script>    <![endif]-->



	<link rel="icon" href="/favicon.ico" type="image/x-icon" />
		<script type="text/javascript">
		  var _gaq = _gaq || [];
		  var pluginUrl = '//www.google-analytics.com/plugins/ga/inpage_linkid.js';
	      _gaq.push(['_require', 'inpage_linkid', pluginUrl]);	  
		  _gaq.push(['_setAccount', 'UA-31122923-1']);
		  _gaq.push(['_setDomainName', 'userbenchmark.com']);	  
		  _gaq.push(['_trackPageview']);
		
		  (function() {
		    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
		  })();
		</script>
			<link rel="canonical" href="http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510" />

		<meta property="og:title" content="UserBenchmark: Nvidia GTX 950 " />
		<meta property="og:url" content="http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510" />
		<meta property="og:description" />

		<meta property="og:image" content="http://i.imgur.com/6PLL0Su.jpg" />
		<meta property="og:type" content="article" />
		<meta property="og:site_name" content="UserBenchmark" />
	
	<meta property="og:image" content="http://www.userbenchmark.com/resources/img/wri/bench-speed/bench-speed-150.png" />

	
	<style type="text/css">
		.table-edit td > input{
			width:100%;
		}
		.tab-link:hover{
			text-decoration:none;
			color:white;
			background:#337ab7;
		}
	</style></head>

<div id="pagetophash" class="anchorable"></div>





<script>
function progressChangeLoc(aNewLoc)
{
	MHAjaxStart();
	setTimeout(function(){$('input:checkbox').prop('checked', false);window.location = aNewLoc;}, 50);
}

function dlClick(evt,theMsg)
{//retired in favour of jquery version 
    guiLogMessage(theMsg);
    setTimeout('window.location = "' + evt.target.href + '"', 600);
}

function guiLogMessage(theMsg)
{
	sendJSON({fn:'log',MSG:theMsg});
}

function sendJSON(aArray)
{
	document.getElementById('navForm:ajaxJSON').value=JSON.stringify(aArray);
	document.getElementById('navForm:sendJSON').click();
}

//$(document).ready(function(){});
</script>


<body>
<div class="lightbox fancyfont"><span>Thank You</span></div>
<form id="navForm" name="navForm" method="post" action="/pages/product.jsf?product_id=3510" onsubmit="detailsSearchNaviation( $(this).find('.acomptarget').attr('href'));return false;" style="margin-bottom: 0px;">
<input type="hidden" name="navForm" value="navForm" />
<input id="navForm:ajaxJSON" type="hidden" name="navForm:ajaxJSON" /><a id="navForm:sendJSON" href="#" onclick="mojarra.ab(this,event,'action','navForm:ajaxJSON','@none');return false"></a>

<div class="top-menu pagebounds container-fluid">
    <div class="top-menu-upper headergrad">

	    <img id="ajaxRight" src="http://www.userbenchmark.com/resources/img/loading-transp.png" style="position:absolute;display:none;height:15px;width:128px;top:45px;right:30%;" height="15" width="128" /> 
    
	    <div class="">
	    	<div class="top-menu-left"> 
	    		<a style="height:40px;padding-left:0;border-radius:0;font-size:32px;line-height:36px;" class="fastinslowout" href="http://www.userbenchmark.com" tabindex="-1">UserBenchmark</a>
	                <a href="http://www.userbenchmark.com/UKR-User/User?id=112" tabindex="-1">
	                <i class="fa fa-user fa-lg ambertext"></i> UKR-User <i class="flag flag-ua"></i></a> 
					<select class="prcloc-sel" title="Price currency">
							<option value="us" selected="selected">us</option>
							<option value="uk">uk</option>
							<option value="ca">ca</option>
							<option value="es">es</option>
							<option value="fr">fr</option>
							<option value="de">de</option>
							<option value="it">it</option>
					</select>


	    	</div>

	    	<div class="top-menu-right row" style="height:25px;width:50%">
	            <div class="col-xs-9 col-xs-offset-3 top-menu-search-w "><input id="navForm:searchInput" type="text" name="navForm:searchInput" autocomplete="off" value="" class="top-menu-search-input mhautoselonfocus form-control" />
	  	            <i class="fa fa-search" style="position:absolute;top:14px;right:25px;"></i><a href="/Search?" onclick="detailsSearchNaviation(this.href);return false;" style="display:none;" class="acomptarget"></a>					
  	            </div>
  	            
	    	</div>
	    </div>
	</div>

	<div class="top-menu-lower">

	    	<div class="top-menu-left">
				
				<a class="fastinslowout " href="http://cpu.userbenchmark.com">CPU</a>
				<a class="fastinslowout " href="http://gpu.userbenchmark.com">GPU</a>
				<a class="fastinslowout " href="http://ssd.userbenchmark.com">SSD</a>
				<a class="fastinslowout " href="http://hdd.userbenchmark.com">HDD</a>
				<a class="fastinslowout " href="http://ram.userbenchmark.com">RAM</a>
				<a class="fastinslowout " href="http://usb.userbenchmark.com">USB</a>
				<span style="margin-lefts:184px;color:white;display:inline" class="toptext">Please vote and link to us!</span>
	    	</div>
			
	    	<div class="top-menu-right">
				<a class="fastinslowout " href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-970-vs-Group-/2577vs10">COMPARE</a>
				<a class="fastinslowout " href="http://www.userbenchmark.com/PCBuilder">BUILD</a>
				<a class="fastinslowout " href="/Software">TEST</a>

	    	</div>

	</div>
</div><input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="7968604625407084085:-737178726882250487" autocomplete="off" />
</form>

<div class="container-fluid pagebounds pagecontainer">

	<div style="background-color:white;">
<form id="ratingDialogForm" name="ratingDialogForm" method="post" action="/pages/product.jsf?product_id=3510" style="margin:0;">
<input type="hidden" name="ratingDialogForm" value="ratingDialogForm" />
<input id="ratingDialogForm:hinputid" type="hidden" name="ratingDialogForm:hinputid" /><a id="ratingDialogForm:ratdidpopup" href="#" onclick="mojarra.ab(this,event,'action','ratingDialogForm:hinputid','notForm:userNot @form',{'onevent':popRModal});return false"></a>

<script>

function popRModal(event)
{
	if (event.status == "success") $('#ratingDialogForm #myRatingModal').modal('show');
}

function popRatingDialog(optmap)
{
	var combined = {};
    combined['fn'] = 'pop';
    for (var attrname in optmap) { combined[attrname] = optmap[attrname];}
	document.getElementById('ratingDialogForm:hinputid').value=JSON.stringify(combined);
	document.getElementById('ratingDialogForm:ratdidpopup').click();
}
</script><span id="ratingDialogForm:myRatingModalComponentWrapper">
	<div id="myRatingModal" class="modal fade" style="display: none;">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<img style="height:36px;float:left;margin-right:10px;" />
					<button type="button" class="close" data-dismiss="modal">×</button>
					<h4 style="white-space:nowrap;overflow:hidden;line-height:36px;" class="modal-title"> </h4>
				</div>
				
				<div class="modal-body">
					<div class="form-group">
						<label class="control-label">Your rating</label><select id="ratingDialogForm:starRatingSelect" name="ratingDialogForm:starRatingSelect" class="form-control" size="1">	<option value="10">Outstanding (10)</option>
	<option value="9.9">Outstanding (9.9)</option>
	<option value="9.8">Outstanding (9.8)</option>
	<option value="9.7">Outstanding (9.7)</option>
	<option value="9.6">Outstanding (9.6)</option>
	<option value="9.5">Outstanding (9.5)</option>
	<option value="9.4">Outstanding (9.4)</option>
	<option value="9.3">Outstanding (9.3)</option>
	<option value="9.2">Outstanding (9.2)</option>
	<option value="9.1">Outstanding (9.1)</option>
	<option value="9">Excellent (9)</option>
	<option value="8.9">Excellent (8.9)</option>
	<option value="8.8">Excellent (8.8)</option>
	<option value="8.7">Excellent (8.7)</option>
	<option value="8.6">Excellent (8.6)</option>
	<option value="8.5">Excellent (8.5)</option>
	<option value="8.4">Excellent (8.4)</option>
	<option value="8.3">Excellent (8.3)</option>
	<option value="8.2">Excellent (8.2)</option>
	<option value="8.1">Excellent (8.1)</option>
	<option value="8">Very good (8)</option>
	<option value="7.9">Very good (7.9)</option>
	<option value="7.8">Very good (7.8)</option>
	<option value="7.7">Very good (7.7)</option>
	<option value="7.6">Very good (7.6)</option>
	<option value="7.5">Very good (7.5)</option>
	<option value="7.4">Very good (7.4)</option>
	<option value="7.3">Very good (7.3)</option>
	<option value="7.2">Very good (7.2)</option>
	<option value="7.1">Very good (7.1)</option>
	<option value="7">Good (7)</option>
	<option value="6.9">Good (6.9)</option>
	<option value="6.8">Good (6.8)</option>
	<option value="6.7">Good (6.7)</option>
	<option value="6.6">Good (6.6)</option>
	<option value="6.5">Good (6.5)</option>
	<option value="6.4">Good (6.4)</option>
	<option value="6.3">Good (6.3)</option>
	<option value="6.2">Good (6.2)</option>
	<option value="6.1">Good (6.1)</option>
	<option value="6">Above average (6)</option>
	<option value="5.9">Above average (5.9)</option>
	<option value="5.8">Above average (5.8)</option>
	<option value="5.7">Above average (5.7)</option>
	<option value="5.6">Above average (5.6)</option>
	<option value="5.5">Above average (5.5)</option>
	<option value="5.4">Above average (5.4)</option>
	<option value="5.3">Above average (5.3)</option>
	<option value="5.2">Above average (5.2)</option>
	<option value="5.1">Above average (5.1)</option>
	<option value="5">Average (5)</option>
	<option value="4.9">Average (4.9)</option>
	<option value="4.8">Average (4.8)</option>
	<option value="4.7">Average (4.7)</option>
	<option value="4.6">Average (4.6)</option>
	<option value="4.5">Average (4.5)</option>
	<option value="4.4">Average (4.4)</option>
	<option value="4.3">Average (4.3)</option>
	<option value="4.2">Average (4.2)</option>
	<option value="4.1">Average (4.1)</option>
	<option value="4">Below average (4)</option>
	<option value="3.9">Below average (3.9)</option>
	<option value="3.8">Below average (3.8)</option>
	<option value="3.7">Below average (3.7)</option>
	<option value="3.6">Below average (3.6)</option>
	<option value="3.5">Below average (3.5)</option>
	<option value="3.4">Below average (3.4)</option>
	<option value="3.3">Below average (3.3)</option>
	<option value="3.2">Below average (3.2)</option>
	<option value="3.1">Below average (3.1)</option>
	<option value="3">Poor (3)</option>
	<option value="2.9">Poor (2.9)</option>
	<option value="2.8">Poor (2.8)</option>
	<option value="2.7">Poor (2.7)</option>
	<option value="2.6">Poor (2.6)</option>
	<option value="2.5">Poor (2.5)</option>
	<option value="2.4">Poor (2.4)</option>
	<option value="2.3">Poor (2.3)</option>
	<option value="2.2">Poor (2.2)</option>
	<option value="2.1">Poor (2.1)</option>
	<option value="2">Very Poor (2)</option>
	<option value="1.9">Very Poor (1.9)</option>
	<option value="1.8">Very Poor (1.8)</option>
	<option value="1.7">Very Poor (1.7)</option>
	<option value="1.6">Very Poor (1.6)</option>
	<option value="1.5">Very Poor (1.5)</option>
	<option value="1.4">Very Poor (1.4)</option>
	<option value="1.3">Very Poor (1.3)</option>
	<option value="1.2">Very Poor (1.2)</option>
	<option value="1.1">Very Poor (1.1)</option>
	<option value="1">Terrible (1)</option>
	<option value="0.9">Terrible (0.9)</option>
	<option value="0.8">Terrible (0.8)</option>
	<option value="0.7">Terrible (0.7)</option>
	<option value="0.6">Terrible (0.6)</option>
	<option value="0.5">Terrible (0.5)</option>
	<option value="0.4">Terrible (0.4)</option>
	<option value="0.3">Terrible (0.3)</option>
	<option value="0.2">Terrible (0.2)</option>
	<option value="0.1">Terrible (0.1)</option>
	<option value="0" selected="selected">Terrible (0)</option>
</select>
					</div>
					<div class="form-group">
						<label class="control-label">Your comment <a class="dropdown" href="javascript:void(0)" onclick="( $('#ratingDialogForm\\:inputcommentbox').outerHeight()==82)?$('#ratingDialogForm\\:inputcommentbox').animate({height:420}):$('#ratingDialogForm\\:inputcommentbox').animate({height:82}); "><span class="caret"></span></a></label><textarea id="ratingDialogForm:inputcommentbox" name="ratingDialogForm:inputcommentbox" class="medp form-control" style="height:82px;"></textarea>
					</div>
				</div>
		
		
				<div class="modal-footer">
						<div style="float:right"><input type="submit" name="ratingDialogForm:j_idt162" value="Submit" class="btn btn-primary" onclick="mojarra.jsfcljs(document.getElementById('ratingDialogForm'),{'ratingDialogForm:j_idt162':'ratingDialogForm:j_idt162','PRIDMP':'0'},'');return false" />
							<a href="#" class="btn btn-default" data-dismiss="modal">Close</a>
						</div>
		        </div>
			</div>
		</div>
	</div></span><input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="7968604625407084085:-737178726882250487" autocomplete="off" />
</form>
<form id="wikiLinkDialogForm" name="wikiLinkDialogForm" method="post" action="/pages/product.jsf?product_id=3510" style="margin:0;">
<input type="hidden" name="wikiLinkDialogForm" value="wikiLinkDialogForm" />
<input id="wikiLinkDialogForm:hinputwid" type="hidden" name="wikiLinkDialogForm:hinputwid" /><a id="wikiLinkDialogForm:wikididpopup" href="#" onclick="mojarra.ab(this,event,'action','wikiLinkDialogForm:hinputwid','notForm:userNot @form',{'onevent':popWModal});return false"></a>

<script>
function popWModal(event)
{
	if (event.status == "success") $('#wikiLinkDialogForm #myWikiLinkModal').modal('show');	
}

function popWikiDialog(optmap)
{
	var combined = {};
    combined['fn'] = 'pop';
    for (var attrname in optmap) { combined[attrname] = optmap[attrname];}
	document.getElementById('wikiLinkDialogForm:hinputwid').value=JSON.stringify(combined);
	document.getElementById('wikiLinkDialogForm:wikididpopup').click();
}
</script><span id="wikiLinkDialogForm:myWikiLinkModalComponentWrapper">
	<div id="myWikiLinkModal" class="modal fade" style="display: none">
		<div class="modal-dialog">
			<div class="modal-content">
		
				<div class="modal-header">
					<img style="height:36px;float:left;margin-right:10px;" />
					<button type="button" class="close" data-dismiss="modal">×</button>
					<h4 style="white-space:nowrap;overflow:hidden;line-height:36px;" class="modal-title"> </h4>
				</div>
	
	
				<div class="modal-body form-horizontal">
					<div class="container-fluid">
						<div class="form-group">
							<div class="col-sm-10 col-sm-offset-2">
								<h4 class="form-control-static">Share a related link</h4>
							</div>
						</div>
		
						<div class="form-group">
							<label class="col-sm-2 control-label">Link Type</label>
							<div class="col-sm-4"><select name="wikiLinkDialogForm:j_idt170" class="form-control" size="1">	<option value="Deal">Deal</option>
	<option value="Discussion">Discussion</option>
	<option value="Tutorial">Tutorial</option>
	<option value="Review">Review</option>
	<option value="Info">Info</option>
	<option value="Suggestion">Suggestion</option>
	<option value="Amusement">Amusement</option>
	<option value="Comment">Comment</option>
	<option value="Image">Image</option>
</select>
							</div>
						</div>
		
						<div class="form-group">
							<label class="col-sm-2 control-label">Link</label>
							<div class="col-sm-10"><input type="text" name="wikiLinkDialogForm:j_idt181" class="form-control" />
							</div>
						</div>
		
						<div class="form-group">
							<label class="col-sm-2 control-label">Description</label>
							<div class="col-sm-10"><textarea name="wikiLinkDialogForm:j_idt183" class="form-control" style="height:120px;"></textarea>
							</div>
						</div>
					</div>
				</div>
		
				<div class="modal-footer">
					<div style="float:right"><input type="submit" name="wikiLinkDialogForm:j_idt185" value="Submit" class="btn btn-primary" onclick="mojarra.jsfcljs(document.getElementById('wikiLinkDialogForm'),{'wikiLinkDialogForm:j_idt185':'wikiLinkDialogForm:j_idt185','PRIDMP':'0','WKIDMP':'0'},'');return false" />
						<a href="#" class="btn btn-default" data-dismiss="modal">Close</a>
					</div>
		        </div>
		        
			</div>
		</div>
	</div></span><input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="7968604625407084085:-737178726882250487" autocomplete="off" />
</form>



<div class="fancyfont"> 

	<div class="row be-lb-page-top-banner">
		<div class="be-lb"><!--PUB topLB--><script type="text/javascript">
 var googletag = googletag || {};
 googletag.cmd = googletag.cmd || [];
 (function() {
     var gads = document.createElement("script");
     gads.async = true;
     gads.type = "text/javascript";
     var useSSL = "https:" == document.location.protocol;
     gads.src = (useSSL ? "https:" : "http:") + "//www.googletagservices.com/tag/js/gpt.js";
     var node =document.getElementsByTagName("script")[0];
     node.parentNode.insertBefore(gads, node);
 })();
</script>

<div id='div-pg-ad-1461540013-3'>
  <script type='text/javascript'>
        googletag.cmd.push(function() { googletag.pubads().display('/8095840/1085.userbenchmark.com_desktop_728x90top', [728, 90], 'div-pg-ad-1461540013-3'); });
  </script>
</div>
		<div class="be-int text-center " style="display:none;border:transparent;background:transparent;padding:4px;height:100%;border-radius:4px;">
			<img class="pull-right" style="width:82px;height:71px;margin-right:3%;border-bottom:1px solid #CC8400;" src="http://www.userbenchmark.com/resources/img/wri/creatives/assets/flame.gif" />
			<img class="pull-left" style="width:82px;height:71px;margin-left:3%; border-bottom:1px solid #CC8400;" src="http://www.userbenchmark.com/resources/img/wri/creatives/assets/flame.gif" />
			<div style="font-size:24px;line-height:44px;margin-top:-3px">Today's hottest 
				<div class="btn-group btn-group-sm" style="vertical-align:-17%">
																				<a class="btn btn-default" onclick="onValidateChecksAndSetMerchants(this);">Amazon <i class="fa fa-check-square-o" style="width:1em;"></i></a>
																				<a class="btn btn-default extramutedtext" onclick="onValidateChecksAndSetMerchants(this);">Ebay <i class="fa fa-square-o" style="width:1em;"></i></a><a class="btn btn-default extramutedtext" onclick="onValidateChecksAndSetMerchants(this);">Newegg <i class="fa fa-square-o" style="width:1em;"></i></a>
				</div> deals <i class="fa fa-external-link fa-sm ambertext"></i>
			</div>
			<div>
				<div class="btn-group btn-group-justified btn-group-sm" style="margin-top:2px;width:58%;margin-left:21%">
						<a class="btn ambertext btn-default" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotCPUAmazon/lbMultiA/0">CPU</a>
						<a class="btn ambertext btn-default" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotGPUAmazon/lbMultiA/0">GPU</a>
						<a class="btn ambertext btn-default" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotSSDAmazon/lbMultiA/0">SSD</a>
						<a class="btn ambertext btn-default" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotHDDAmazon/lbMultiA/0">HDD</a>
						<a class="btn ambertext btn-default" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotUSBAmazon/lbMultiA/0">USB</a>
						<a class="btn ambertext btn-default" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotRAMAmazon/lbMultiA/0">RAM</a>
						<a class="btn ambertext btn-default" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotWWWAmazon/lbMultiA/0">MBD</a>
				</div>
			</div>
		</div>			
		</div>
	</div>
	
	
	
	<div class="pg-head-block row"><span class="pg-head-slink">
	<div class="h5 box-thumb-link-wrapper"><a style="text-decoration:none;padding:7px;" class="blacktext boxthumb btn-block" href="/Software"><img style="width:41px;height:41px;float:left;margin-right:7px;" class="lazynonseq" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/wri/bench-speed/bench-speed-60t-loop.gif" />TEST<br />YOUR GPU</a></div></span>
		<span class="pg-head-slink">
	<div class="h5 box-thumb-link-wrapper"><a style="text-decoration:none;padding:7px" class="blacktext boxthumb btn-block" href="http://www.userbenchmark.com/PCBuilder/Custom/S0-M33835vsS0-M"><img style="width:41px;height:41px;float:left;margin-right:7px;" class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/CB_41.png" />ADD TO PC<br />BUILD</a></div></span><a class="pg-head-imglink bglink" title="GPU Home" href="http://gpu.userbenchmark.com"><img class="lazy img-responsive" data-original="http://www.userbenchmark.com/resources/img/icons/GPU_128.png" src="http://www.userbenchmark.com/resources/img/loading-transp.png" /></a>			
		<h3 class="pg-head-toption"><a href="/Search?searchTerm=Brand:Nvidia" rel="nofollow" class="nodec">Nvidia</a> <span class="pg-head-toption-post"></span></h3>
		<h1 class="pg-head-title"><a class="stealthlink" href="http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510">GTX 950</a></h1>
	</div>
	
	<div style="margin-top:-20px;margin-bottom:10px;">
		<ul class="stickyTarget toclinks">
		  <li><a class="snava stickyOnly strong" href="#pagetophash"><span class="inlink orangetext">▲</span> Nvidia GTX 950</a></li>
		  <li></li>
		  <li><a href="#Benchmarks" class="snava">BENCHMARKS (3,913)</a></li>
		  	<li><a href="#MarketShare" class="snava">MKT SHARE (1.2%)</a></li>
		  <li><a href="#Build" class="snava">BEST BUILD</a></li>
		  <li></li>
		  <li><a class="snava" href="#Comments">COMMENTS (5)</a></li>
		  <li class="snava"><a class='nodec navtrack strong ambertext' data-navtrack='PRCNAVL' href='http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510#Prices' title='Live Amazon price'><span class='nowrap'>BUY • $140</span></a></li>
		  <li style="float:right"><a class="snava snava-right btn btn-default" href="javascript:void(0)" onclick="showMarkupDialog()" title="Copy summary markup or text"><i class="fa fa-copy fa-lg ambertext"></i> Copy <i class="fa fa-code"></i> <i class="fa fa-reddit-alien"></i></a></li>
		</ul> 
	</div>
<form id="j_idt286" name="j_idt286" method="post" action="/pages/product.jsf" enctype="application/x-www-form-urlencoded">
<input type="hidden" name="j_idt286" value="j_idt286" />



<div style="clear:both;"></div>
<div class="row hovertarget" style="margin-top:35px;">
	
	<div class="col-xs-4">
		<div class="row hovertarget">

<div style="min-height:140px;">
	<div style="position:relative;" class="hovertargetnear showchildspnonhover">
		<div style="left:15px;width:58px;font-size:36px;;" class="ptajaxwrap"><a id="j_idt286:j_idt291" href="#" style="display:block;padding:12px;" title="Vote up" onclick="jsf.util.chain(this,event,'fMSG(event,\'Thank You\')','mojarra.ab(this,event,\'action\',\'@form\',\'notForm:userNot ratingDialogForm:myRatingModalComponentWrapper @form\',{\'VPIDMP\':\'3510\',\'VMP\':\'1\',\'VRDMP\':\'true\'})');return false" class="mharrow mharrow-like lightgraytext bglink">▲
					</a>
				
				
				<a href="http://www.userbenchmark.com/Faq/How-is-the-user-rating-calculated/46" class="blacktext fancyfont ptlink ptlink-large" title="User rating faq »"><span class="ptscore">65</span><span class="ptcnt" title="Total votes">7,293</span></a><a id="j_idt286:j_idt300" href="#" style="display:block;padding:12px;" title="Vote down" onclick="jsf.util.chain(this,event,'fMSG(event,\'Thank You\')','mojarra.ab(this,event,\'action\',\'@form\',\'notForm:userNot ratingDialogForm:myRatingModalComponentWrapper @form\',{\'VPIDMP\':\'3510\',\'VMP\':\'-1\',\'VRDMP\':\'true\'})');return false" class="mharrow mharrow-dislike lightgraytext bglink">▼
					</a>
		</div><span style="display:block;min-height:284px;">
			<img style="padding:2px 0px;left:23px;max-width:65%;min-height:136px;max-height:280px;" class="lazy mhajaxstatus ptimg" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/6PLL0Su.jpg" /></span>
			<div style="text-align:center;margin-top:15px;margin-left:40px;">
				<div style="display:inline-block" class="btn-group btn-group-lg">
						<a class="btn btn-default-3d disabled" href="http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510">950</a>
						<a class="btn btn-default-3d " href="http://gpu.userbenchmark.com/Nvidia-GTX-960/Rating/3165">960</a>
				</div>
			</div>
		
	</div>
</div>
		</div>
	</div>
	<div class="col-xs-4 col-collapsible">
		<div style="max-width:94%">
			<a style="color:#333" class="nodec lightblacktext" href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Group-/3510vs10"><span class='gc-sum-o'><span class='gc-sum-i fastinslowout'>Effective Speed <span class='sharpredtext'>-92%</span><span class='gc-sum-desc mhelipsis'>Effective 3D Speed -92%</span></span></span><span class='gc-sum-o'><span class='gc-sum-i fastinslowout'>Value & Sentiment <span class='sharpgreentext'>+7% <i class='fa fa-check'></i></span><span class='gc-sum-desc mhelipsis'>User Rating -26%, Market Share -88%, Price 150%, Value -8%</span></span></span><span class='gc-sum-o'><span class='gc-sum-i fastinslowout'>Average User Bench <span class='sharpredtext'>-92%</span><span class='gc-sum-desc mhelipsis'>Parallax -132%, MRender -65%, Gravity -83%, Splatting -89%</span></span></span><span class='gc-sum-o'><span class='gc-sum-i fastinslowout'>Peak Overclocked Bench <span class='sharpredtext'>-95%</span><span class='gc-sum-desc mhelipsis'>Parallax -133%, MRender -68%, Gravity -85%, Splatting -92%</span></span></span><span class='gc-sum-o'><span class='gc-sum-i fastinslowout'>Nice To Haves <span class='sharpredtext'>-51%</span><span class='gc-sum-desc mhelipsis'>Lighting -105%, Reflection -91%, Lighting -83%, Reflection -87%, Age 113%</span></span></span>
			</a>
		</div>
	</div>
		<div class="col-xs-4" style="position:relative;">
			<div class="fancyfont strong" style="position:absolute;top:-27px;left:20px;"><a href="/" class="btn btn-default-3d btn-xs strong">Market Leaders <span class="fa fa-trophy ambertext"></span></a>

			</div>
			<div class="vsstyle" style="position:absolute;top:34%;left:-6%;">VS</div>

<div style="margin-bottom:-10px;overflow:auto;"><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-970/3510vs2577" onclick="fMSG(event,'Please Vote')" title="Nvidia GTX 970" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/UZWxbxR.jpg" /> </a><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-980-Ti/3510vs3439" onclick="fMSG(event,'Please Vote')" title="Nvidia GTX 980 Ti" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/BBPBJSJ.jpg" /> </a><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-380/3510vs3482" onclick="fMSG(event,'Please Vote')" title="AMD R9 380" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/7X3sPRj.jpg" /> </a><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-390/3510vs3481" onclick="fMSG(event,'Please Vote')" title="AMD R9 390" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/7X3sPRj.jpg" /> </a><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-290X/3510vs2166" onclick="fMSG(event,'Please Vote')" title="AMD R9 290X" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/eEHmR8H.jpg" /> </a><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-980/3510vs2576" onclick="fMSG(event,'Please Vote')" title="Nvidia GTX 980" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/01tfwGH.jpg" /> </a><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-280X/3510vs2192" onclick="fMSG(event,'Please Vote')" title="AMD R9 280X" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/Zgqzw3U.jpg" /> </a><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-960/3510vs3165" onclick="fMSG(event,'Please Vote')" title="Nvidia GTX 960" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/HL9jmks.jpg" /> </a><a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-290/3510vs2171" onclick="fMSG(event,'Please Vote')" title="AMD R9 290" class="productgrid productgrid-hvr"> <img class="productgrid-img productgrid-img-hvr lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/eEHmR8H.jpg" /> </a>
</div>
<div class="clear"></div>				
		</div>
</div><input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="7968604625407084085:-737178726882250487" autocomplete="off" />
</form>
</div>
	<div id="Benchmarks" class="anchorable"></div>
	<div class="chapt-m-t">
		<div class="row" style="overflow:hidden">
			<div class="col-xs-8">
			<h2 class="conclusion" style="margin-bottom:5px;"><i class="fa fa-clock-o ambertext"></i> Average Bench: 43% - 44<sup style="text-transform:none">th</sup> / <a class="nodec" title="See all" href="/Comparison">506</a><a href="http://gpu.userbenchmark.com/Faq/What-is-the-effective-GPU-speed-index/82" title="A measure of 3D gaming GPU performance. »"><i class="fa fa-question-circle falink"></i></a></h2>
			</div>
			<div class="col-xs-4">
				<div class="mc-select" style="floats:right;margin-right:12px;margin-bottom:5px;"><div id="select_compare" data-placeholder="COMPARE ALTERNATIVES" style="width:100%"></div></div>
			</div>
		</div>
		<div class="mutedtext" style="overflow:hidden;height:23px;">
			<span class="tallp lightblacktext">Based on 3,913 User Benchmarks.</span> 
			Device: 10DE 1402 Model: NVIDIA GeForce GTX 950
		</div>
			<div class="row para-m-t">
				<div class="col-xs-8">
					<p class="tallp fl-dc two-cols">The GTX 950 is Nvidia's latest Maxwell card which is based on a GTX 960 but with 25% fewer CUDA cores and 25% fewer texture units. Comparing the <a href='/Compare/Nvidia-GTX-960-vs-Nvidia-GTX-950/3165vs3510'>GTX 960 and 950</a> shows that, as expected, <a href='/Faq/What-is-the-effective-GPU-speed-index/82' title='Faq'>effective speed</a> has been reduced by 25%. The GTX 950 is positioned above GTX 750 Ti which is Nvidia's energy efficient mass market GPU. Comparing the <a href='/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-750-Ti/3510vs2187'>750 Ti and 950</a> shows that 950 is nearly 50% faster but it's also priced 50% higher so the 950 doesn't offer improved value for money. Gaming performance for the GTX 950 at resolutions up to 1080p  on high/ultra settings will be satisfactory most of the time. That said, the GTX 950 is priced on the high side ($160). At present the GTX 960 ($171) offers 25% better performance for just 7% more money. See a current list of the best value graphics cards <a href='/Explore/Best-Value/20'>here</a>. <sup>[<i><span class="mutedtext">Aug '15</span> <a title="Author's profile" href="http://www.userbenchmark.com/GPUPro/User?id=29">GPUPro</a></i>]</sup></p>
				</div>
				<div class="col-xs-4" style="margin-bottom:-18px">
					<div class="be-mr" style="background:white;"><!--SOV topMR--><script type="text/javascript" src="http://ap.lijit.com/www/delivery/fpi.js?z=312388&u=userbenchmark&width=300&height=250"></script>
	
	
	<a class="be-int navtrack" style="display:none" data-navtrack="NAVIA_buildMR" href="http://www.userbenchmark.com/PCBuilder">
		<img class="be-img" data-src="http://www.userbenchmark.com/resources/img/wri/creatives/buildMR.png" />
	</a>
					</div>
<div class="be-caption">ADVERTISEMENT<i title="UserBenchmark is a small company of hardcore geeks. We are dedicated to providing our visitors with top notch hardware research on tens of thousands of PC components. We use advertising as a source of income for the site. We hope you do not find these adverts intrusive. If you have any feedback please contact us using the email link or feedback button at the bottom of this page. Thank you." class="fa fa-info-circle falink"></i></div>
				</div>
			</div>
	</div>

	<div class="row chapt-m-t">
		<div class="col-xs-8 v-center">



<div class="sb-wrapper " title="Distribution of user benchmark scores">
	<div class="sb">
		
		<div class="sb-sect-wrapper"><div style="border-radius:10px 0 0 10px;width:41.42%" class="sb-sect sprbg"></div><div style="width:41.42%" class="sb-sect spybg"></div><div style="border-radius:0 10px 10px 0;width:17.16%" class="sb-sect spgbg"></div></div>
		
		<span class="sb-maxima" style="left:8%"><span style="margin-left:-100px">Worst: <a href="/UserRun/1172468" title="See system details" class="strong bglink">8%</a></span></span><span class="sb-maxima sb-maxima-avg" style="left:30.0%"><span style="margin-left:-80px;">Average: <span style="background:white;padding:1px;border-radius:20px;opacity:.8;color:black;">43%</span></span></span>
		
		
		<span class="sb-maxima" style="left:52%;"><span style="margin-left:10px">Best: <a href="/UserRun/1204706" title="See system details" class="strong bglink">52%</a></span></span>
			<div class="sb-pt sb-ani-h0" style="left:52%;height:2%" title="52.2%"></div>
			<div class="sb-pt sb-ani-h0" style="left:51%;height:2%" title="50.9%"></div>
			<div class="sb-pt sb-ani-h0" style="left:50%;height:2%" title="49.6%"></div>
			<div class="sb-pt sb-ani-h0" style="left:49%;height:2%" title="48.8%"></div>
			<div class="sb-pt sb-ani-h0" style="left:48%;height:9%" title="48.4%"></div>
			<div class="sb-pt sb-ani-h0" style="left:47%;height:21%" title="47.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:46%;height:27%" title="46.3%"></div>
			<div class="sb-pt sb-ani-h0" style="left:45%;height:63%" title="45.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:44%;height:80%" title="44.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:43%;height:95%" title="43.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:42%;height:100%" title="42.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:41%;height:85%" title="41.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:40%;height:55%" title="40.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:39%;height:38%" title="39.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:38%;height:22%" title="38.3%"></div>
			<div class="sb-pt sb-ani-h0" style="left:37%;height:12%" title="37.2%"></div>
			<div class="sb-pt sb-ani-h0" style="left:36%;height:7%" title="35.7%"></div>
			<div class="sb-pt sb-ani-h0" style="left:35%;height:4%" title="35.4%"></div>
			<div class="sb-pt sb-ani-h0" style="left:34%;height:2%" title="34.5%"></div>
			<div class="sb-pt sb-ani-h0" style="left:31%;height:2%" title="30.9%"></div>
			<div class="sb-pt sb-ani-h0" style="left:15%;height:1%" title="15.0%"></div>
			<div class="sb-pt sb-ani-h0" style="left:12%;height:2%" title="12.2%"></div>
			<div class="sb-pt sb-ani-h0" style="left:11%;height:2%" title="11.2%"></div>
			<div class="sb-pt sb-ani-h0" style="left:8%;height:1%" title="8.0%"></div>
		
	</div>
</div>
		</div><div class="col-xs-4 text-center v-center">
				<h4 class="conclusion" style="margin-top:20px;" title="User builds that include this GPU the most">Popular systems with this GPU<span><i class="fa fa-info-circle falink"></i></span></h4>
	<ul class="list-unstyled medp vtallul" style="overflow:hidden;">
			<li><a class="nodec" href="/System/MSI-970-GAMING-MS-7693/6269">MSI 970 GAMING (MS-7693) (65)</a></li>
			<li><a class="nodec" href="/System/Gigabyte-GA-78LMT-USB3-60/11240">Gigabyte GA-78LMT-USB3 6.0 (55)</a></li>
			<li><a class="nodec" href="/System/Asus-M5A97-R20/837">Asus M5A97 R2.0 (45)</a></li>
			<li><a class="nodec" href="/System/Asus-M5A78L-MUSB3/3287">Asus M5A78L-M/USB3 (40)</a></li>
			<li><a class="nodec" href="/System/Gigabyte-GA-970A-DS3P/1255">Gigabyte GA-970A-DS3P (38)</a></li>
	</ul>
		</div>
	</div>
	<div class="row medp chapt-m-t">
		
		<div class="col-xs-4"><h4>Below average average bench</h4>The Nvidia GTX 950 averaged 57.0% lower than the peak scores attained by the <a href='http://gpu.userbenchmark.com' title='Best user rated GPUs'>group leaders</a>. This isn't a great result which indicates that there are much faster alternatives on the <a href='http://gpu.userbenchmark.com/Comparison' title='All GPUs'>comparison list</a>.<h4>Strengths</h4><div title='A measure of a GPUs ability to compute and render an NBody particle system...»'>Avg. NBody particle system (Galaxy) 96.3<span class='tc-units'>fps</span></span><a href='http://gpu.userbenchmark.com/Faq/What-is-the-Gravity-NBody-GPU-benchmark/88'><i class='fa fa-question-circle falink'></i></a></div><div title='A DX10 measure of a GPUs render target array and geometry shading performance...»'>Avg. Render target array GShader (Sphere) 76.7<span class='tc-units'>fps</span></span><a href='http://gpu.userbenchmark.com/Faq/What-is-the-MRender-GPU-benchmark/87'><i class='fa fa-question-circle falink'></i></a></div>
			<div style="margin-top:10px;">
				<a class="nodec btn btn-warning" href="/Software">See where your GPU ranks →</a>
			</div>
		</div>
		
		<div class="col-xs-4"><h4>Average consistency</h4>The range of scores (best-worst) for the Nvidia GTX 950 is 44.3%. This is a relatively wide range which indicates that the Nvidia GTX 950 performs inconsistently under varying real world conditions.<h4>Weaknesses</h4><div title='A measure of a GPUs ability to render high dynamic range graphics...»'>Avg. High dynamic range lighting (Teapot) 88<span class='tc-units'>fps</span></span><a href='http://gpu.userbenchmark.com/Faq/What-is-the-reflection-HDR-GPU-benchmark/85'><i class='fa fa-question-circle falink'></i></a></div><div title='A measure of a GPUs ability to render complex (LDPRT) lighting effects...»'>Avg. Locally-deformable PRT (Bat) 109<span class='tc-units'>fps</span></span><a href='http://gpu.userbenchmark.com/Faq/What-is-the-lighting-LDPRT-benchmark/84'><i class='fa fa-question-circle falink'></i></a></div>
		</div>
		
		<div class="col-xs-4">
			<div class="be-mr"><!--AMA highMR--><script type="text/javascript" language="javascript" src="//c.amazon-adsystem.com/aax2/getads.js"></script>
<script type="text/javascript" language="javascript">
//<![CDATA[
aax_getad_mpb({
  "slot_uuid":"2d812913-d2b3-4e3b-88f3-ae53aee11b2c"
});
//]]>
</script><a class='be-int navtrack' data-navtrack='NAVIA_softwareAltMR' style='display:none' href='http://www.userbenchmark.com/Software'><img class='be-img' data-src='http://www.userbenchmark.com/resources/img/wri/creatives/softwareAltMR.png'></img></a>
			</div>
<div class="be-caption">ADVERTISEMENT<i title="UserBenchmark is a small company of hardcore geeks. We are dedicated to providing our visitors with top notch hardware research on tens of thousands of PC components. We use advertising as a source of income for the site. We hope you do not find these adverts intrusive. If you have any feedback please contact us using the email link or feedback button at the bottom of this page. Thank you." class="fa fa-info-circle falink"></i></div>
		</div>
	</div><span id="componentTableId0">
	 
	<table style="margin-bottom:20px;background-image:linear-gradient(to left, #f6f6f6 0%, white 60%);border-radius:10px;" class="para-m-t uc-table table-no-border ">
		<thead>
			<tr>
				

<td style="text-align:left;">
<div class="pull-right">
	<h2 class="h1" style="margin-top:22px;color:#333;"><i class="fa fa-clock-o ambertext"></i> Average Bench<a href="http://gpu.userbenchmark.com/Faq/What-is-the-effective-GPU-speed-index/82" title="A measure of 3D gaming GPU performance. »"><i class="fa fa-question-circle falink"></i></a></h2>
	<span class="">(Based on 3,913 samples)</span>
</div>
</td>

<td>
	<div class="uc-score uc-score-large"><a href="/Comparison" title="Comparison List (506)" class="nodec"><span class="uc-score-cap lightblacktext">Rank 44</span>43<span style="font-size:14px">%</span></a></div>
</td>
		<td style="vertical-align:bottom">
			<table class="mcs-table">
				<thead>
					<tr>
						<th class="opc-5" title="5th percentile">Min</th>
						<th>Avg</th>
						<th class="opc-5" title="95th percentile">Max</th>
					</tr>
				</thead>
				<tbody>
						<tr>
							<td class="opc-5 redtext">94.5</td>
							<td class="mcs-hl-col" title="6.3%">Lighting <span class="">109</span></td>
							<td class="opc-5 redtext">123</td>
						</tr>
						<tr>
							<td class="opc-5 redtext">77.9</td>
							<td class="mcs-hl-col" title="5.0%">Reflection <span class="">88</span></td>
							<td class="opc-5 redtext">96.9</td>
						</tr>
						<tr>
							<td class="opc-5 lightblacktext">79</td>
							<td class="mcs-hl-col" title="69.8%">Parallax <span class="">97.6</span></td>
							<td class="opc-5 greentext">111</td>
						</tr>
					<tr style="border-top:1px solid black;border-bottom:1px solid black;">
						<td colspan="3" class="mcs-caption prbg">27<span class="tc-units">%</span> <span class="graytext">98.2<span class="tc-units"> fps</span></span></td>
					</tr>
				</tbody>
			</table>
		</td>
		<td style="vertical-align:bottom">
			<table class="mcs-table">
				<thead>
					<tr>
						<th class="opc-5" title="5th percentile">Min</th>
						<th>Avg</th>
						<th class="opc-5" title="95th percentile">Max</th>
					</tr>
				</thead>
				<tbody>
						<tr>
							<td class="opc-5 greentext">71.4</td>
							<td class="mcs-hl-col" title="71.9%">MRender <span class="">76.7</span></td>
							<td class="opc-5 greentext">83.1</td>
						</tr>
						<tr>
							<td class="opc-5 greentext">87.6</td>
							<td class="mcs-hl-col" title="73.5%">Gravity <span class="">96.3</span></td>
							<td class="opc-5 greentext">106</td>
						</tr>
						<tr>
							<td class="opc-5 redtext">67.9</td>
							<td class="mcs-hl-col" title="31.8%">Splatting <span class="">75.1</span></td>
							<td class="opc-5 redtext">82.4</td>
						</tr>
					<tr style="border-top:1px solid black;border-bottom:1px solid black;">
						<td colspan="3" class="mcs-caption pybg">59.1<span class="tc-units">%</span> <span class="graytext">82.7<span class="tc-units"> fps</span></span></td>
					</tr>
				</tbody>
			</table>
		</td></tr>
			<tr>
				<th style="text-align:left;padding-left:10px;width:45%;">User Benchmarks
				
				</th>
				<th style="width:8%;background:#eaeaea;">Bench<a href="http://www.userbenchmark.com/Faq/What-is-UBM-Effective-Speed/95" title="Real world speed relative to the best alternatives... »"><i class="fa fa-question-circle fa-lg falink"></i></a></th>
						<th>3D DX9<a href="http://gpu.userbenchmark.com/Faq/What-are-the-DX09-GPU-tests/90" title="A suite of DirectX 9 3D graphics benchmarks... »"><i class="fa fa-question-circle fa-lg falink"></i></a></th>
						<th>3D DX10<a href="http://gpu.userbenchmark.com/Faq/What-are-the-DX10-GPU-tests/91" title="A suite of DirectX 10 3D graphics benchmarks... »"><i class="fa fa-question-circle fa-lg falink"></i></a></th>
						<th>3D DX11<a href="http://gpu.userbenchmark.com/Faq/What-are-the-DX11-GPU-tests/92" title="A suite of DirectX 11 3D graphics benchmarks... »"><i class="fa fa-question-circle fa-lg falink"></i></a></th>
			</tr>
		</thead>
		<tbody><tr><td colspan="5" style="padding:0;padding-top:5px;padding-bottom:5px;;"><span class="mutedtext pull-right" style="font-size:12px;margin-right:5px">The <a href="http://gpu.userbenchmark.com/Comparison">fastest GPU</a> (mainstream) averages a speed of 100%</span></td></tr>
					<tr>


<td>
	<div class="c1rd-cont">
		<div style="color:#777;font-size:14px;font-weight:bold;">BLR-User, 08 Jun '16</div>
		<div><a style="font-size:12px;font-weight:bold;" href="http://www.userbenchmark.com/UserRun/1212541">Full Test Report</a></div>
		
		<div class="gap-m-t"><a href="http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510#Prices">Asus(1043 8554)</a></div>
		<div>Driver: nvd3dumx.dll Ver. 10.18.13.6191</div>
		<div> </div>
		<div style="font-size:12px;font-weight:bold;"></div>
		
		
	</div>
</td>
<td><div class="uc-score"><a href="http://www.userbenchmark.com/UserRun/1212541" title="System Details" class="nodec lightblacktext"><span class="uc-score-cap">Average</span>
		50.9<span style="font-size:14px">%</span></a>
</div></td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="7.1%">Lighting 123</div>
				<div class="" title="5.9%">Reflection 103</div>
				<div class="" title="81.4%">Parallax 114</div>
		</div>
		<div class="uc-caption"><div class="uc-rag spybg"></div>32% 114<span class="tc-units"> fps</span></div>
	</td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="90.6%">MRender 96.6</div>
				<div class="" title="83.9%">Gravity 110</div>
				<div class="" title="36.4%">Splatting 85.9</div>
		</div>
		<div class="uc-caption"><div class="uc-rag spgbg"></div>70% 97.5<span class="tc-units"> fps</span></div>
	</td></tr>
					<tr>


<td>
	<div class="c1rd-cont">
		<div style="color:#777;font-size:14px;font-weight:bold;">FRA-User, 08 Jun '16</div>
		<div><a style="font-size:12px;font-weight:bold;" href="http://www.userbenchmark.com/UserRun/1211430">Full Test Report</a></div>
		
		<div class="gap-m-t"><a href="http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510#Prices">Zotac(19DA 1376)</a></div>
		<div>Driver: nvd3dumx.dll Ver. 10.18.13.6839</div>
		<div> </div>
		<div style="font-size:12px;font-weight:bold;"></div>
		
		
	</div>
</td>
<td><div class="uc-score"><a href="http://www.userbenchmark.com/UserRun/1211430" title="System Details" class="nodec lightblacktext"><span class="uc-score-cap">Below average</span>
		44<span style="font-size:14px">%</span></a>
</div></td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="6.5%">Lighting 114</div>
				<div class="" title="5%">Reflection 87.8</div>
				<div class="" title="72.5%">Parallax 101</div>
		</div>
		<div class="uc-caption"><div class="uc-rag sprbg"></div>28% 101<span class="tc-units"> fps</span></div>
	</td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="73.4%">MRender 78.3</div>
				<div class="" title="74.4%">Gravity 97.6</div>
				<div class="" title="31.8%">Splatting 75.1</div>
		</div>
		<div class="uc-caption"><div class="uc-rag spybg"></div>60% 83.7<span class="tc-units"> fps</span></div>
	</td></tr>
					<tr>


<td>
	<div class="c1rd-cont">
		<div style="color:#777;font-size:14px;font-weight:bold;">AUS-User, 08 Jun '16</div>
		<div><a style="font-size:12px;font-weight:bold;" href="http://www.userbenchmark.com/UserRun/1212565">Full Test Report</a></div>
		
		<div class="gap-m-t"><span>Gigabyte(1458 36C3) 2GB</span></div>
		<div>Driver: nvd3dumx.dll Ver. 10.18.13.6839</div>
		<div> </div>
		<div style="font-size:12px;font-weight:bold;"></div>
		
		
	</div>
</td>
<td><div class="uc-score"><a href="http://www.userbenchmark.com/UserRun/1212565" title="System Details" class="nodec lightblacktext"><span class="uc-score-cap">Below average</span>
		43.8<span style="font-size:14px">%</span></a>
</div></td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="6%">Lighting 105</div>
				<div class="" title="4.9%">Reflection 86.3</div>
				<div class="" title="76.6%">Parallax 107</div>
		</div>
		<div class="uc-caption"><div class="uc-rag sprbg"></div>29% 99.4<span class="tc-units"> fps</span></div>
	</td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="73.5%">MRender 78.4</div>
				<div class="" title="71.2%">Gravity 93.3</div>
				<div class="" title="30.7%">Splatting 72.5</div>
		</div>
		<div class="uc-caption"><div class="uc-rag spybg"></div>58% 81.4<span class="tc-units"> fps</span></div>
	</td></tr>
					<tr>


<td>
	<div class="c1rd-cont">
		<div style="color:#777;font-size:14px;font-weight:bold;">CAN-User, 08 Jun '16</div>
		<div><a style="font-size:12px;font-weight:bold;" href="http://www.userbenchmark.com/UserRun/1211232">Full Test Report</a></div>
		
		<div class="gap-m-t"><a href="http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510#Prices">EVGA(3842 2957)</a></div>
		<div>Driver: nvd3dumx.dll Ver. 10.18.13.6839</div>
		<div> </div>
		<div style="font-size:12px;font-weight:bold;"></div>
		
		
	</div>
</td>
<td><div class="uc-score"><a href="http://www.userbenchmark.com/UserRun/1211232" title="System Details" class="nodec lightblacktext"><span class="uc-score-cap">Below average</span>
		42.6<span style="font-size:14px">%</span></a>
</div></td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="5.5%">Lighting 96.4</div>
				<div class="" title="4.9%">Reflection 85.9</div>
				<div class="" title="69.2%">Parallax 96.8</div>
		</div>
		<div class="uc-caption"><div class="uc-rag sprbg"></div>26% 93<span class="tc-units"> fps</span></div>
	</td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="68.8%">MRender 73.4</div>
				<div class="" title="73.9%">Gravity 96.9</div>
				<div class="" title="33.1%">Splatting 78.2</div>
		</div>
		<div class="uc-caption"><div class="uc-rag spybg"></div>59% 82.8<span class="tc-units"> fps</span></div>
	</td></tr>
					<tr>


<td>
	<div class="c1rd-cont">
		<div style="color:#777;font-size:14px;font-weight:bold;">USA-User, 08 Jun '16</div>
		<div><a style="font-size:12px;font-weight:bold;" href="http://www.userbenchmark.com/UserRun/1211740">Full Test Report</a></div>
		
		<div class="gap-m-t"><span>Asus(1043 8581) 2GB</span></div>
		<div>Driver: nvd3dumx.dll Ver. 10.18.13.6822</div>
		<div> </div>
		<div style="font-size:12px;font-weight:bold;"></div>
		
		
	</div>
</td>
<td><div class="uc-score"><a href="http://www.userbenchmark.com/UserRun/1211740" title="System Details" class="nodec lightblacktext"><span class="uc-score-cap">Below average</span>
		40.4<span style="font-size:14px">%</span></a>
</div></td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="5.5%">Lighting 96.8</div>
				<div class="" title="4.7%">Reflection 81.4</div>
				<div class="" title="64.5%">Parallax 90.2</div>
		</div>
		<div class="uc-caption"><div class="uc-rag sprbg"></div>25% 89.5<span class="tc-units"> fps</span></div>
	</td>
	<td>
		<div class="uc-catbar-text">
				<div class="" title="72.1%">MRender 76.9</div>
				<div class="" title="66.6%">Gravity 87.3</div>
				<div class="" title="28.9%">Splatting 68.2</div>
		</div>
		<div class="uc-caption"><div class="uc-rag spybg"></div>56% 77.5<span class="tc-units"> fps</span></div>
	</td></tr>
		</tbody>
	</table></span><div class="h2"><a class="bglink pull-right" href="http://gpu.userbenchmark.com/SpeedTest/33835/NVIDIA-GeForce-GTX-950">3908 MORE »</a></div>

<div class="sect-m-t"></div>
<div id="MarketShare" class="anchorable"></div>
	
	<div style="margin-bottom:2px">
	<h2 class="conclusion"><i class="fa fa-line-chart ambertext"></i> Market Share <a class="nodec navtrack" data-navtrack="MKTSHARE_SECT_LINK" href="/">(See Leaders)</a></h2>
	<p class="tallp">The number of benchmark samples for this model as a percentage of all <span class='autoCountUp'>1,183,460</span> GPUs tested.</p>
	</div>

<div class="row" style="margin:15px 0">
	<div class="col-xs-12">
		<div id="marketShareChartHolder">
			<div style="height:280px">
		    	<canvas id="marketShareChartCanvas"></canvas>
		    </div>
	    	<div id="marketSharelegendDiv" class="line-m-t"></div>
		</div>
	</div>
</div>
	<div class="sect-m-t">
		<div id="Prices" class="anchorable"></div>
	
	<div style="margin-bottom:2px">
	<h2 class="conclusion"><i class="fa fa-shopping-cart ambertext"></i> Popular Cards</h2>
	<p class="tallp">Based on statistics from 3,913 user benchmarks.</p>
	</div>



		<table class="table table-spacious medp table-v-center">
			<thead>
				<tr>
					<th>Hardware Id</th>
					<th>Samples</th>
					<th>Bench ± SD</th>
					<th>Model / Price</th>
				</tr>
			
			</thead>
			<tbody>
					<tr>
						<td><span class="lightblacktext">Asus(1043 8554)
								</span>
						</td>
						<td>12%</td>
						<td>44% ± 2%</td>
						<td>
								<div style="border-top:0px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										Asus GTX 950 2GB STRIX GAMING<div class="ambertext tinyp">STRIX-GTX950-DC2OC-2GD5-GAMING</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/Asus-GTX-950-2GB-STRIX-GAMING/27120"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/Asus-GTX-950-2GB-STRIX-GAMING/27120">$159.81<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/Asus-GTX-950-2GB-STRIX-GAMING/27111"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/Asus-GTX-950-2GB-STRIX-GAMING/27111">$169.99<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/Asus-GTX-950-2GB-STRIX-GAMING/27113"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/Asus-GTX-950-2GB-STRIX-GAMING/27113">$173.98<i title="Hot price"></i></a><span class="prccapt semi-strong">28 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/OutletPCUS/Asus-GTX-950-2GB-STRIX-GAMING/27112"><img src="/resources/img/merchant/outletpc.png" alt="OutletPCUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/OutletPCUS/Asus-GTX-950-2GB-STRIX-GAMING/27112">$194.88<i title="Hot price"></i></a><span class="prccapt semi-strong">18 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on OutletPCUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">MSI(1462 3208)
								</span>
						</td>
						<td>10%</td>
						<td>43% ± 5%</td>
						<td>
								<div style="border-top:0px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										MSI GTX 950 2GB GAMING<div class="ambertext tinyp">GTX 950 GAMING 2G</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/BHPhotoUS/MSI-GTX-950-2GB-GAMING/27141"><img src="/resources/img/merchant/bhphoto.png" alt="BHPhotoUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/BHPhotoUS/MSI-GTX-950-2GB-GAMING/27141">$159.99<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on BHPhotoUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/MSI-GTX-950-2GB-GAMING/27142"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/MSI-GTX-950-2GB-GAMING/27142">$162.98<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/MSI-GTX-950-2GB-GAMING/27144"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/MSI-GTX-950-2GB-GAMING/27144">$168.50<i title="Hot price"></i></a><span class="prccapt semi-strong">28 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/MSI-GTX-950-2GB-GAMING/27150"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/MSI-GTX-950-2GB-GAMING/27150">$168.93<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/OutletPCUS/MSI-GTX-950-2GB-GAMING/27143"><img src="/resources/img/merchant/outletpc.png" alt="OutletPCUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/OutletPCUS/MSI-GTX-950-2GB-GAMING/27143">$179.89<i title="Hot price"></i></a><span class="prccapt semi-strong">18 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on OutletPCUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Gigabyte(1458 36C5)
								</span>
						</td>
						<td>9%</td>
						<td>43% ± 2%</td>
						<td>
								<div style="border-top:0px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										Gigabyte GTX 950 2GB Windforce<div class="ambertext tinyp">GV-N950WF2OC-2GD</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/Gigabyte-GTX-950-2GB-Windforce/27134"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/Gigabyte-GTX-950-2GB-Windforce/27134">$159.99<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/Gigabyte-GTX-950-2GB-Windforce/27126"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/Gigabyte-GTX-950-2GB-Windforce/27126">$163.98<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/OutletPCUS/Gigabyte-GTX-950-2GB-Windforce/27127"><img src="/resources/img/merchant/outletpc.png" alt="OutletPCUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/OutletPCUS/Gigabyte-GTX-950-2GB-Windforce/27127">$167.83<i title="Hot price"></i></a><span class="prccapt semi-strong">1 month ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on OutletPCUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/Gigabyte-GTX-950-2GB-Windforce/27128"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/Gigabyte-GTX-950-2GB-Windforce/27128">$174.73<i title="Hot price"></i></a><span class="prccapt semi-strong">28 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 2951)
								</span>
						</td>
						<td>9%</td>
						<td>45% ± 2%</td>
						<td>
								<div style="border-top:0px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										EVGA GTX 950 2GB SC<div class="ambertext tinyp">02G-P4-2951-KR</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/EVGA-GTX-950-2GB-SC/14248"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/EVGA-GTX-950-2GB-SC/14248">$139.99<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/BHPhotoUS/EVGA-GTX-950-2GB-SC/24940"><img src="/resources/img/merchant/bhphoto.png" alt="BHPhotoUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/BHPhotoUS/EVGA-GTX-950-2GB-SC/24940">$155.99<i title="Hot price"></i></a><span class="prccapt semi-strong">1 month ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on BHPhotoUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/OutletPCUS/EVGA-GTX-950-2GB-SC/24941"><img src="/resources/img/merchant/outletpc.png" alt="OutletPCUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/OutletPCUS/EVGA-GTX-950-2GB-SC/24941">$157.83<i title="Hot price"></i></a><span class="prccapt semi-strong">18 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on OutletPCUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/EVGA-GTX-950-2GB-SC/20211"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/EVGA-GTX-950-2GB-SC/20211">$159.98<i title="Hot price"></i></a><span class="prccapt semi-strong">33 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/EVGA-GTX-950-2GB-SC/16628"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/EVGA-GTX-950-2GB-SC/16628">$159.99<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Gigabyte(1458 36C3)
								</span>
						</td>
						<td>7%</td>
						<td>42% ± 2%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">MSI(1462 8C92)
								</span>
						</td>
						<td>7%</td>
						<td>41% ± 6%</td>
						<td>
								<div style="border-top:0px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										MSI GTX 950 2GB OC<div class="ambertext tinyp">GTX 950 2GD5 OC</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/MSI-GTX-950-2GB-OC/28796"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/MSI-GTX-950-2GB-OC/28796">$158.16<i title="Hot price"></i></a><span class="prccapt semi-strong">27 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/MSI-GTX-950-2GB-OC/28803"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/MSI-GTX-950-2GB-OC/28803">$180.00<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 2956)
								</span>
						</td>
						<td>6%</td>
						<td>43% ± 6%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 2957)
								</span>
						</td>
						<td>4%</td>
						<td>43% ± 7%</td>
						<td>
								<div style="border-top:0px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										EVGA GTX 950 2GB SSC ACX<div class="ambertext tinyp">02G-P4-2957-KR</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/EVGA-GTX-950-2GB-SSC-ACX/24376"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/EVGA-GTX-950-2GB-SSC-ACX/24376">$154.99<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/EVGA-GTX-950-2GB-SSC-ACX/24382"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/EVGA-GTX-950-2GB-SSC-ACX/24382">$169.00<i title="Hot price"></i></a><span class="prccapt semi-strong">29 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/EVGA-GTX-950-2GB-SSC-ACX/24388"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/EVGA-GTX-950-2GB-SSC-ACX/24388">$173.98<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/OutletPCUS/EVGA-GTX-950-2GB-SSC-ACX/24943"><img src="/resources/img/merchant/outletpc.png" alt="OutletPCUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/OutletPCUS/EVGA-GTX-950-2GB-SSC-ACX/24943">$177.84<i title="Hot price"></i></a><span class="prccapt semi-strong">18 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on OutletPCUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 2958)
								</span>
						</td>
						<td>3%</td>
						<td>45% ± 1%</td>
						<td>
								<div style="border-top:0px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										EVGA GeForce GTX 950 2GB ACX 2.0<div class="ambertext tinyp">02G-P4-2958-KR</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/EVGA-GeForce-GTX-950-2GB-ACX-20/14261"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/EVGA-GeForce-GTX-950-2GB-ACX-20/14261">$164.99<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/EVGA-GeForce-GTX-950-2GB-ACX-20/23620"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/EVGA-GeForce-GTX-950-2GB-ACX-20/23620">$179.23<i title="Hot price"></i></a><span class="prccapt semi-strong">30 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/OutletPCUS/EVGA-GeForce-GTX-950-2GB-ACX-20/24942"><img src="/resources/img/merchant/outletpc.png" alt="OutletPCUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/OutletPCUS/EVGA-GeForce-GTX-950-2GB-ACX-20/24942">$180.83<i title="Hot price"></i></a><span class="prccapt semi-strong">18 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on OutletPCUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/EVGA-GeForce-GTX-950-2GB-ACX-20/16629"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/EVGA-GeForce-GTX-950-2GB-ACX-20/16629">$183.98<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Zotac(19DA 1376)
								</span>
						</td>
						<td>3%</td>
						<td>43% ± 1%</td>
						<td>
								<div style="border-top:0px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										Zotac GTX 950 2GB<div class="ambertext tinyp">ZT-90601-10L</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/Zotac-GTX-950-2GB/20198"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/Zotac-GTX-950-2GB/20198">$151.57<i title="Hot price"></i></a><span class="prccapt semi-strong">33 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/Zotac-GTX-950-2GB/14210"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/Zotac-GTX-950-2GB/14210">$152.99<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/Zotac-GTX-950-2GB/16625"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/Zotac-GTX-950-2GB/16625">$152.99<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
								<div style="border-top:1px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										Zotac GTX 950 2GB OC<div class="ambertext tinyp">ZT-90602-10M</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/Zotac-GTX-950-2GB-OC/20203"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/Zotac-GTX-950-2GB-OC/20203">$148.98<i title="Hot price"></i></a><span class="prccapt semi-strong">33 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/Zotac-GTX-950-2GB-OC/16626"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/Zotac-GTX-950-2GB-OC/16626">$148.98<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/Zotac-GTX-950-2GB-OC/14219"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/Zotac-GTX-950-2GB-OC/14219">$168.69<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
								<div style="border-top:1px dotted gainsboro">
									<div style="width:45%;display:inline-block;vertical-align:middle;padding:1%">
										Zotac GTX 950 2GB AMP!<div class="ambertext tinyp">ZT-90603-10M</div>
									</div><div style="display:inline-block;vertical-align:middle;width:55%">

	

<table class="table table-no-border" style="font-size:16px;">
	<tbody>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/AmazonUS/Zotac-GTX-950-2GB-AMP-/14228"><img src="/resources/img/merchant/amazonus.png" alt="AmazonUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/AmazonUS/Zotac-GTX-950-2GB-AMP-/14228">$154.99<i title="Hot price"></i></a><span class="prccapt semi-strong">46 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on AmazonUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/NeweggUS/Zotac-GTX-950-2GB-AMP-/16627"><img src="/resources/img/merchant/neweggus.png" alt="NeweggUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/NeweggUS/Zotac-GTX-950-2GB-AMP-/16627">$154.99<i title="Hot price"></i></a><span class="prccapt semi-strong">12 hrs ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on NeweggUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>
			<tr>
				<td style="vertical-align:middle;"><a rel="nofollow" target="_blank" href="http://www.userbenchmark.com/Go/EbayUS/Zotac-GTX-950-2GB-AMP-/20207"><img src="/resources/img/merchant/ebayus.png" alt="EbayUS" /></a></td>
				<td style="vertical-align:middle;"><span class="mutedtext"></span></td>
				<td class="strong" style="text-align:center"><a rel="nofollow" target="_blank" class="bglink vtallp" href="http://www.userbenchmark.com/Go/EbayUS/Zotac-GTX-950-2GB-AMP-/20207">$195.94<i title="Hot price"></i></a><span class="prccapt semi-strong">33 mins ago.<a title="Product prices are accurate as of the time indicated and are subject to change. Any price information displayed on EbayUS at the time of purchase will apply to the purchase of this product."><i class="fa fa-info-circle fa-lg falink falink-light"></i></a></span></td>
			</tr>				
	</tbody>
</table>
									</div>
								</div>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Asus(1043 8569)
								</span>
						</td>
						<td>3%</td>
						<td>42% ± 2%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 2959)
								</span>
						</td>
						<td>3%</td>
						<td>45% ± 1%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Asus(1043 8553)
								</span>
						</td>
						<td>3%</td>
						<td>41% ± 1%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Nvidia(10DE 1139)
								</span>
						</td>
						<td>2%</td>
						<td>42% ± 9%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 1950)
								</span>
						</td>
						<td>2%</td>
						<td>43% ± 5%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Asus(1043 8555)
								</span>
						</td>
						<td>2%</td>
						<td>42% ± 2%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Gigabyte(1458 36C7)
								</span>
						</td>
						<td>2%</td>
						<td>44% ± 4%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Zotac(19DA 2376)
								</span>
						</td>
						<td>2%</td>
						<td>46% ± 4%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Nvidia(10DE 1402)
								</span>
						</td>
						<td>2%</td>
						<td>37% ± 10%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">PNY(196E 139F)
								</span>
						</td>
						<td>2%</td>
						<td>41% ± 1%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Asus(1043 8581)
								</span>
						</td>
						<td>2%</td>
						<td>40% ± 1%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">MSI(1462 320A)
								</span>
						</td>
						<td>1%</td>
						<td>43% ± 2%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Asus(1043 86DC)
								</span>
						</td>
						<td>1%</td>
						<td>42% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 1958)
								</span>
						</td>
						<td>1%</td>
						<td>43% ± 1%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Nvidia(10DE 11A9)
								</span>
						</td>
						<td>0%</td>
						<td>45% ± 1%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Sapphire(174B 3376)
								</span>
						</td>
						<td>0%</td>
						<td>42% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 1955)
								</span>
						</td>
						<td>0%</td>
						<td>40% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 1956)
								</span>
						</td>
						<td>0%</td>
						<td>42% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Gigabyte(1458 36D9)
								</span>
						</td>
						<td>0%</td>
						<td>39% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">EVGA(3842 1953)
								</span>
						</td>
						<td>0%</td>
						<td>39% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Asus(1043 856A)
								</span>
						</td>
						<td>0%</td>
						<td>47% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Gainward(10B0 1402)
								</span>
						</td>
						<td>0%</td>
						<td>41% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">Device(0000 0000)
								</span>
						</td>
						<td>0%</td>
						<td>41% ± 0%</td>
						<td>
						</td>
					</tr>
					<tr>
						<td><span class="lightblacktext">PNY(196E 13A1)
								</span>
						</td>
						<td>0%</td>
						<td>40% ± 0%</td>
						<td>
						</td>
					</tr>
			</tbody>		
		</table>
	</div>
	<a class="btn btn-sm btn-warning btn-outline line-m-t" href="javascript:void(0)" onclick="feedbackDialogAction()"><i class="fa fa-flag-o fa-lg"></i> Send price feedback</a>


<div class="row">
	<div class="col-xs-10">
	<div style="overflow:hidden;" class="fancyfont sect-m-t">
	
	








	<a class="h2 major-heading bglink navtrack" data-navtrack="SW_BAN" href="/Software">
		
			<span class="conclusion"><img class="lazy major-heading-img" data-original="http://www.userbenchmark.com/resources/img/wri/bench-speed/bench-speed-60t-loop.gif" src="http://www.userbenchmark.com/resources/img/loading-transp.png" /> How Fast Is Your GPU? <span class="linktext" style="text-transform:none">(Bench your build)</span></span>
			<span class="tallp lightblacktext " style="display:block;">Size up your PC in less than a minute.</span>
	</a>			
		<p style="margin-bottom:20px;" class="medp fl-dc">Welcome to our freeware PC speed test tool. UserBenchmark will test your PC and compare the results to other users with the same components. You can quickly size up your PC, identify hardware problems and explore the best upgrades.
		</p>
		
		<h4 class="chapt-m-t">UserBenchmark of the month</h4>
		<div class="btn-group btn-group-justified">
			<a class="btn btn-default navtrack" data-navtrack="BOM_BTN_D" href="http://www.userbenchmark.com/UserRun/918950">
				<img style="height:40px;width:40px;margin-right:5px;" src="http://www.userbenchmark.com/resources/img/icons/Desktop_128.png" />
			Desktop</a>
			

			<a class="btn btn-default navtrack" data-navtrack="BOM_BTN_G" href="http://www.userbenchmark.com/UserRun/984076">
				<img style="height:40px;width:40px;margin-right:5px;" src="http://www.userbenchmark.com/resources/img/icons/Gaming_128.png" />
			Gaming</a>
			
			<a class="btn btn-default navtrack" data-navtrack="BOM_BTN_W" href="http://www.userbenchmark.com/UserRun/845248">
				<img style="height:40px;width:40px;margin-right:5px;" src="http://www.userbenchmark.com/resources/img/icons/Workstation_128.png" />
			Workstation</a>
		</div>
		
		<div class="chapt-m-t" style="overflow:auto">
			<div style="float:left;width:60px;font-weight:bold;font-size:12px;">
				<a class="mfam-imglink mfam-imglink-sw" href="http://cpu.userbenchmark.com/Comparison"><img class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/CPU_128.png" />CPU</a>
				<a class="mfam-imglink mfam-imglink-sw" href="http://gpu.userbenchmark.com/Comparison"><img class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/GPU_128.png" />GPU</a>
				<a class="mfam-imglink mfam-imglink-sw" href="http://ssd.userbenchmark.com/Comparison"><img class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/SSD_128.png" />SSD</a>
				<a class="mfam-imglink mfam-imglink-sw" href="http://hdd.userbenchmark.com/Comparison"><img class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/HDD_128.png" />HDD</a>
				<a class="mfam-imglink mfam-imglink-sw" href="http://usb.userbenchmark.com/Comparison"><img class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/USB_128.png" />USB</a>
				<a class="mfam-imglink mfam-imglink-sw" href="http://ram.userbenchmark.com/Comparison"><img class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/RAM_128.png" />RAM</a>
			</div>
			<div></div>
			<div style="margin-left:75px;">
				<h4>How it works</h4>
				<ul class="medp list-unstyled" style="display:inline-block;">
					<li class="db-li-tall">- Download and run UserBenchMark (UBM).</li>
					<li class="db-li-tall">- CPU tests include: integer, floating and string.</li>
					<li class="db-li-tall">- GPU tests include: DX9 and DX10 3D performance.</li>
					<li class="db-li-tall">- Drive tests include: read, write and mixed IO.</li>
					<li class="db-li-tall">- Checks include: 4k Align, NCQ, TRIM, SATA, USB &amp; S.M.A.R.T.</li>
					<li class="db-li-tall">- RAM tests include: single/multi core bandwidth and latency.</li>
					<li class="db-li-tall">- Reports are generated and presented on userbenchmark.com.</li>
					<li class="db-li-tall">- Identify the strongest components in your PC.</li>
					<li class="db-li-tall">- See speed test results from other users.</li>
					<li class="db-li-tall">- Compare your components to the highest voted in class.</li>
					<li class="db-li-tall">- Find the best upgrades.</li>
					<li class="db-li-tall">- Share your opinion by voting.</li>
				</ul>
			</div>
		</div>
	</div>
	</div>
</div>
	<div style="overflow:hidden;" class="fancyfont sect-m-t">

		<div class="row">
			<div class="col-xs-10">
	
	








	<a class="h2 major-heading bglink navtrack" data-navtrack="SD_BAN" href="http://gpu.userbenchmark.com">
		
			<span class="conclusion"><img class="lazy major-heading-img" data-original="http://www.userbenchmark.com/resources/img/icons/CHART_41.png" src="http://www.userbenchmark.com/resources/img/loading-transp.png" /> Graphics Card Rankings <span class="linktext" style="text-transform:none">(Price vs Performance)</span></span>
			<span class="tallp lightblacktext " style="display:block;">June 2016 GPU Rankings.</span>
	</a>
				<p class="medp fl-dc">Welcome to our graphics card comparison. We calculate <a href="/Faq/What-is-the-effective-GPU-speed-index/82" title="What is effective GPU speed?">effective 3D speed</a> which measures performance for recent games. Effective speed is adjusted by cost to yield <a href="/Faq/What-is-the-GPU-value-for-money-rating/83" title="What is the GPU value for money rating?">value for money</a>. Calculated values don't always tell the whole picture so we check them against thousands of individual <a href="/Faq/How-is-the-user-rating-calculated/46" title="How is the user rating calculated?">user ratings</a>. The customizable table below combines these factors and more to bring you the definitive list of top GPUs. Share your opinion by voting. <sup>[<i><a title="Profile" href="http://www.userbenchmark.com/GPUPro/User?id=29">GPUPro</a></i>]</sup></p>
				
			</div>
		</div>

		<div class="line-m-t">
			<div style="width:100%">
				<div style="float:left;margin-right:20px;margin-top:40px;">
					<img class="lazy" style="height:80px;" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/PEbZPTF.jpg?" />
				</div>
				<div style="overflow:hidden">
					<h3 class="line-m-t">Group Test Results</h3>
					<ul class="medp list-unstyled semi-strong">
							<li class="taller"><a class="nodec mhelipsis" href="http://gpu.userbenchmark.com">Best user rated<span class="lightblacktext normal"> - User sentiment trumps benchmarks for this comparison.</span></a></li>
							<li class="taller"><a class="nodec mhelipsis" href="http://gpu.userbenchmark.com/Explore/Fastest/19">Best gaming performance<span class="lightblacktext normal"> - Effective Speed measures performance for modern 3D games.</span></a></li>
							<li class="taller"><a class="nodec mhelipsis" href="http://gpu.userbenchmark.com/Explore/Best-Value/20">Best value for money<span class="lightblacktext normal"> - Value for money is based on 3D gaming performance and price.</span></a></li>
							<li class="taller"><a class="nodec mhelipsis" href="http://gpu.userbenchmark.com/Explore/Raw-Speed/21">Raw speed comparison<span class="lightblacktext normal"> - Raw speed readings.</span></a></li>
					</ul>
				</div>		
			</div>
		</div>
	</div>
	<div class="sect-m-t">
		<div id="Build" class="anchorable"></div>
	
	








	<a class="h2 major-heading bglink navtrack" data-navtrack="MS_BAN" href="http://www.userbenchmark.com/System/MSI-970-GAMING-MS-7693/6269">
		
			<span class="conclusion"><img class="lazy major-heading-img" data-original="http://www.userbenchmark.com/resources/img/icons/MBD_128.png" src="http://www.userbenchmark.com/resources/img/loading-transp.png" /> Typical GTX 950 Build <span class="linktext" style="text-transform:none">(Compare 2951 builds)</span></span>
			<span class="tallp lightblacktext " style="display:block;">See popular component choices, score breakdowns and rankings.</span>
	</a>
		<div style="margin-top:15px;margin-bottom:5px;">
			<h4>Motherboard: MSI 970 GAMING (MS-7693) - <a class='nodec navtrack semi-strong ambertext' data-navtrack='PRCNAVL' href='http://www.userbenchmark.com/System/MSI-970-GAMING-MS-7693/6269#Prices' title='Live Ebay price'><span class='nowrap'>$95</span></a></h4>
		</div>
	</div>


<div class="row">
			<div class="col-xs-3">
				<table class="table ms-table table-no-border">
					<thead><tr>
						<th colspan="2"><a class="h2 graytext nodec normal" title="CPU Home" href="http://cpu.userbenchmark.com"><img class="lic-small lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/CPU_128.png" />CPU</a></th>
					</tr></thead>
					<tbody>
	<tr><td><a style="display:block" class="bglink bglink-border" href="http://cpu.userbenchmark.com/AMD-FX-8350/Rating/1489"><span class='cag-t-w'><span class='cag-t'>FX-8350</span><span class='greentext'>AMD</span><span class='lightblacktext block'>Bench 62%, 15827 samples</span></span></a></td><td class="ms-freq"><a class='nodec navtrack semi-strong ambertext' data-navtrack='PRCNAVL' href='http://cpu.userbenchmark.com/AMD-FX-8350/Rating/1489#Prices' title='Live BHPhoto price'><span class='nowrap'>$160</span></a></td></tr>
					</tbody>
				</table>
			</div>
			<div class="col-xs-3">
				<table class="table ms-table table-no-border">
					<thead><tr>
						<th colspan="2"><a class="h2 graytext nodec normal" title="GPU Home" href="http://gpu.userbenchmark.com"><img class="lic-small lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/GPU_128.png" />GPU</a></th>
					</tr></thead>
					<tbody>
	<tr><td><a style="display:block" class="bglink bglink-border" href="http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510"><span class='cag-t-w'><span class='cag-t'>GTX 950</span><span class='greentext'>Nvidia</span><span class='lightblacktext block'>Bench 43%, 3913 samples</span></span></a></td><td class="ms-freq"><a class='nodec navtrack semi-strong ambertext' data-navtrack='PRCNAVL' href='http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510#Prices' title='Live Amazon price'><span class='nowrap'>$140</span></a></td></tr>
					</tbody>
				</table>
			</div>
			<div class="col-xs-3">
				<table class="table ms-table table-no-border">
					<thead><tr>
						<th colspan="2"><a class="h2 graytext nodec normal" title="SSD Home" href="http://ssd.userbenchmark.com"><img class="lic-small lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/SSD_128.png" />SSD</a></th>
					</tr></thead>
					<tbody>
	<tr><td><a style="display:block" class="bglink bglink-border" href="http://ssd.userbenchmark.com/Samsung-850-Evo-250GB/Rating/2977"><span class='cag-t-w'><span class='cag-t'>850 Evo 250GB</span><span class='greentext'>Samsung</span><span class='lightblacktext block'>Bench 94%, 29268 samples</span></span></a></td><td class="ms-freq"><a class='nodec navtrack semi-strong ambertext' data-navtrack='PRCNAVL' href='http://ssd.userbenchmark.com/Samsung-850-Evo-250GB/Rating/2977#Prices' title='Live Newegg price'><span class='nowrap'>$88</span></a></td></tr>
					</tbody>
				</table>
			</div>
			<div class="col-xs-3">
				<table class="table ms-table table-no-border">
					<thead><tr>
						<th colspan="2"><a class="h2 graytext nodec normal" title="RAM Home" href="http://ram.userbenchmark.com"><img class="lic-small lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/RAM_128.png" />RAM</a></th>
					</tr></thead>
					<tbody>
	<tr><td><a style="display:block" class="bglink bglink-border" href="http://ram.userbenchmark.com/SpeedTest/42962/Kingston-KHX1866C10D38G-2x8GB"><span class='cag-t-w'><span class='cag-t'>Fury DDR3 1866 C10 2x8GB</span><span class='greentext'>HyperX</span><span class='lightblacktext block'>Bench 59%, 2929 samples</span></span></a></td><td class="ms-freq"><a class='nodec navtrack semi-strong ambertext' data-navtrack='PRCNAVL' href='http://ram.userbenchmark.com/SpeedTest/42962/Kingston-KHX1866C10D38G-2x8GB#Prices' title='Live Ebay price'><span class='nowrap'>$41</span></a></td></tr>
					</tbody>
				</table>
			</div>
</div>
	<hr class="invisible" />
<table style="width:100%;margin-bottom:0px;border:1px solid gainsboro;border-radius:5px;background-image:;border-width:0;" class="table-h-center table table-no-border">
		<thead>
			<tr>
				<th style="width:33.33%"></th>
				<th style="width:33.33%"></th>
				<th style="width:33.33%"></th>
			</tr>
		</thead>
		<tfoot>
			<tr><td colspan="3" style="padding-bottom:5px;"></td></tr>
		</tfoot>
	<tbody>
		<tr>
				<td>
					<div class="bsc-img-w">
						<img class="bsc-img" src="http://www.userbenchmark.com/resources/img/icons/Gaming_128.png" alt="Gaming" />
					</div>
					<div class="bsc-w text-left semi-strong">
						<div>Gaming 43%</div>
						<div class="bsc-percbar-w"><div class="bsc-percbar pc-ani-faster spybg" style="width:43%;"></div></div>
						<div class="bsc-c">Speed boat<a href="http://www.userbenchmark.com/Faq/What-are-the-UBM-performance-classifications/93" title="See all classifications »"><i class="fa fa-question-circle falink"></i></a></div>
					</div>
				</td>
				<td>
					<div class="bsc-img-w">
						<img class="bsc-img" src="http://www.userbenchmark.com/resources/img/icons/Desktop_128.png" alt="Desktop" />
					</div>
					<div class="bsc-w text-left semi-strong">
						<div>Desktop 57%</div>
						<div class="bsc-percbar-w"><div class="bsc-percbar pc-ani-faster spybg" style="width:57%;"></div></div>
						<div class="bsc-c">Gunboat<a href="http://www.userbenchmark.com/Faq/What-are-the-UBM-performance-classifications/93" title="See all classifications »"><i class="fa fa-question-circle falink"></i></a></div>
					</div>
				</td>
				<td>
					<div class="bsc-img-w">
						<img class="bsc-img" src="http://www.userbenchmark.com/resources/img/icons/Workstation_128.png" alt="Workstation" />
					</div>
					<div class="bsc-w text-left semi-strong">
						<div>Workstation 44%</div>
						<div class="bsc-percbar-w"><div class="bsc-percbar pc-ani-faster spybg" style="width:44%;"></div></div>
						<div class="bsc-c">Speed boat<a href="http://www.userbenchmark.com/Faq/What-are-the-UBM-performance-classifications/93" title="See all classifications »"><i class="fa fa-question-circle falink"></i></a></div>
					</div>
				</td>
		</tr>
	</tbody>
</table>
	<div style="margin-top:-1px;"></div>

<table class="table table-h-center table-v-center table-no-border no-margin" style="table-layout:fixed;border:1px solid gainsboro;border-width:1px 1px 0;background-image: linear-gradient(to top, #f4f4f4 0%, white 100%);">
	<tbody><tr class="blacktext">
			<td><span class="tallp"><a class="nodec navtrack btn btn-default ambertext semi-strong" data-navtrack="TOTBAR_CB_EDIT" href="http://www.userbenchmark.com/PCBuilder/Custom/S6269-M314.33835.19175.42962vsS6269-M314.33835.19175.42962"><i class="fa fa-pencil-square-o fa-lg"></i> EDIT WITH CUSTOM PC BUILDER</a></span></td>
			<td><span class="tallp">Value: 89% - Excellent<a href="http://www.userbenchmark.com/Faq/What-is-the-UBM-value-for-money-rating/96" title="Component effective speed per unit cost... »"><i class="fa fa-question-circle falink"></i></a></span></td>
		<td><span class="tallp">Total price: $523</span></td>
	</tr></tbody>
</table>
		<h3 class="normal" style="margin-top:35px;">Popular GTX 950 compatible motherboards.</h3>
	<ul class="list-unstyled medp vtallul" style="overflow:hidden;">
			<li><a class="nodec" href="/System/MSI-970-GAMING-MS-7693/6269">MSI 970 GAMING (MS-7693) (65)</a></li>
			<li><a class="nodec" href="/System/Gigabyte-GA-78LMT-USB3-60/11240">Gigabyte GA-78LMT-USB3 6.0 (55)</a></li>
			<li><a class="nodec" href="/System/Asus-M5A97-R20/837">Asus M5A97 R2.0 (45)</a></li>
			<li><a class="nodec" href="/System/Asus-M5A78L-MUSB3/3287">Asus M5A78L-M/USB3 (40)</a></li>
			<li><a class="nodec" href="/System/Gigabyte-GA-970A-DS3P/1255">Gigabyte GA-970A-DS3P (38)</a></li>
	</ul>
<form id="wikiForm" name="wikiForm" method="post" action="/pages/product.jsf" enctype="application/x-www-form-urlencoded" style="margin:0;">
<input type="hidden" name="wikiForm" value="wikiForm" />


<div id="Comments" class="anchorable"></div>
<div class="sect-m-t">
	
	<div style="margin-bottom:2px">
	<h2 class="conclusion"><i class="fa fa-comments-o ambertext"></i> Comments</h2>
	<p class="tallp"></p>
	</div></div>
<div class="row">

<div class="col-xs-8">
	
	<div class="row coloronhover" style="margin-top:15px;margin-bottom:15px;">
		<div class="col-xs-3">
			<span class="pull-right" style="margin-top:-5px;">
<a class="lightblacktext thumbnail-noedge coloronhover" style="display:inline-block;text-decoration:none;font-size:13px;padding-bottom:5px;line-height:15px;" href="http://www.userbenchmark.com/GPUPro/User?id=29" title="View GPUPro's profile">
	
	<span>GPUPro</span><br />
	<span style="display:inline-block;position:relative;margin-left:5px;top:5px;">
		
		<img src="http://i.imgur.com/PEbZPTF.jpg?s=40" class="mhajaxstatus grayscale" alt="Avatar" style="max-width:40px;width:40px;height:40px;" />
	</span>
	<span style="float:left;">level<br /><span style="border-bottom:1px solid darkorange;">823</span>
	</span>
</a></span>
		</div>
		<div class="col-xs-9">
			<div class="page-header">
				<div id="detailsandspecs" class="anchorable"></div>
					<h3 class="lighterblacktext">Official site 
	<a class="lighterblacktext" target="_blank" onmousedown="guiLogMessage('ENAV http://www.geforce.co.uk/hardware/desktop-gpus/geforce-gtx-950/product-images')" href="http://www.geforce.co.uk/hardware/desktop-gpus/geforce-gtx-950/product-images"><img onError="this.style.display = 'none'" style="width:12px;height:12px;vertical-align:middle;margin-right:2px;" src="https://www.google.com/s2/favicons?domain=www.geforce.co.uk" />www.geforce.co.uk/...</a></h3>
			</div>
			<div style="margin-top:-5px;"></div>
			<p class="medp"></p>
			<p style="margin-top:5px;" class="medp mutedtext"><em></em></p>
			<div style="margin-top:10px;"></div>
			<em style="font-size:9px;float:right;color:#999">Added 9 months ago.</em>
		</div>
	</div>
	<div class="row showchildlinkonhover" style="margin-bottom:5px">
		<div class="col-xs-3">
			<span class="pull-right" style="margin-top:-5px;">
<a class="lightblacktext thumbnail-noedge coloronhover" style="display:inline-block;text-decoration:none;font-size:13px;padding-bottom:5px;line-height:15px;" href="http://www.userbenchmark.com/UKR-User/User?id=112" title="View UKR-User's profile">
	
	<span>UKR-User</span><br />
	<span style="display:inline-block;position:relative;margin-left:5px;top:5px;">
		
		<img src="http://www.userbenchmark.com/resources/img/guest.png?s=20" class="mhajaxstatus grayscale" alt="Avatar" style="max-width:20px;width:20px;height:20px;" />
	</span>
	<span style="float:left;">level<br /><span style="border-bottom:1px solid darkorange;">895</span>
	</span>
</a></span><br />
		</div>


		<div class="col-xs-9 fancyfont">
				<h4 style="display:inline;">
					<a href="javascript:void(0)" onclick="popRatingDialog({prid:30163})" title="Edit your rating">Liked (edit your comment)</a>
					<a style="margin-left:5px;" href="javascript:void(0)" onclick="popWikiDialog({prid:30163})" class=" graytext" title="Add a review, price, debate, news or info link">Add link</a>
				</h4>
		    
			<span class="wiki-ts">3 days ago.</span>

			<p style="" class="medp"></p>
			<div style="margin-left:30px;">
			</div>


		</div>
	</div>	

	<div class="row">
		<div class="col-xs-offset-3 col-xs-9">
				<hr class="thin" />
		</div>
	</div>
	<div class="row showchildlinkonhover" style="margin-bottom:5px">
		<div class="col-xs-3">
			<span class="pull-right" style="margin-top:-5px;">
<a class="lightblacktext thumbnail-noedge coloronhover" style="display:inline-block;text-decoration:none;font-size:13px;padding-bottom:5px;line-height:15px;" href="http://www.userbenchmark.com/USA-User/User?id=107" title="View USA-User's profile">
	
	<span>USA-User</span><br />
	<span style="display:inline-block;position:relative;margin-left:5px;top:5px;">
		
		<img src="http://www.whoratesit.com/resources/img/guest.png?s=40" class="mhajaxstatus grayscale" alt="Avatar" style="max-width:40px;width:40px;height:40px;" />
	</span>
	<span style="float:left;">level<br /><span style="border-bottom:1px solid darkorange;">1,148</span>
	</span>
</a></span><br />
		</div>


		<div class="col-xs-9 fancyfont">
				<h4 class="lighterblacktext" style="display:inline;">Poor</h4>
		    
			<span class="wiki-ts">5 hrs ago.</span>

			<p style="" class="medp">HELLUVA video card.
</p>
			<div style="margin-left:30px;">
			</div>


		</div>
	</div>	

	<div class="row">
		<div class="col-xs-offset-3 col-xs-9">
				<hr class="thin" />
		</div>
	</div>
	<div class="row showchildlinkonhover" style="margin-bottom:5px">
		<div class="col-xs-3">
			<span class="pull-right" style="margin-top:-5px;">
<a class="lightblacktext thumbnail-noedge coloronhover" style="display:inline-block;text-decoration:none;font-size:13px;padding-bottom:5px;line-height:15px;" href="http://www.userbenchmark.com/GPUPro/User?id=29" title="View GPUPro's profile">
	
	<span>GPUPro</span><br />
	<span style="display:inline-block;position:relative;margin-left:5px;top:5px;">
		
		<img src="http://i.imgur.com/PEbZPTF.jpg?s=40" class="mhajaxstatus grayscale" alt="Avatar" style="max-width:40px;width:40px;height:40px;" />
	</span>
	<span style="float:left;">level<br /><span style="border-bottom:1px solid darkorange;">823</span>
	</span>
</a></span><br />
		</div>


		<div class="col-xs-9 fancyfont">
				<h4 class="lighterblacktext" style="display:inline;">Above average</h4>
		    
			<span class="wiki-ts">9 months ago.</span>

			<p style="" class="medp"></p>
			<div style="margin-left:30px;">
			</div>


		</div>
	</div>	

	<div class="row">
		<div class="col-xs-offset-3 col-xs-9">
				<hr class="thin" />
		</div>
	</div>
	<div class="row showchildlinkonhover" style="margin-bottom:5px">
		<div class="col-xs-3">
			<span class="pull-right" style="margin-top:-5px;">
<a class="lightblacktext thumbnail-noedge coloronhover" style="display:inline-block;text-decoration:none;font-size:13px;padding-bottom:5px;line-height:15px;" href="http://www.userbenchmark.com/BEL-User/User?id=132" title="View BEL-User's profile">
	
	<span>BEL-User</span><br />
	<span style="display:inline-block;position:relative;margin-left:5px;top:5px;">
		
		<img src="http://www.userbenchmark.com/resources/img/guest.png?s=40" class="mhajaxstatus grayscale" alt="Avatar" style="max-width:40px;width:40px;height:40px;" />
	</span>
	<span style="float:left;">level<br /><span style="border-bottom:1px solid darkorange;">762</span>
	</span>
</a></span><br />
		</div>


		<div class="col-xs-9 fancyfont">
				<h4 class="lighterblacktext" style="display:inline;">Good</h4>
		    
			<span class="wiki-ts">19 hrs ago.</span>

			<p style="" class="medp">good card</p>
			<div style="margin-left:30px;">
			</div>


		</div>
	</div>	

	<div class="row">
		<div class="col-xs-offset-3 col-xs-9">
				<hr class="thin" />
		</div>
	</div>
	<div class="row showchildlinkonhover" style="margin-bottom:5px">
		<div class="col-xs-3">
			<span class="pull-right" style="margin-top:-5px;">
<a class="lightblacktext thumbnail-noedge coloronhover" style="display:inline-block;text-decoration:none;font-size:13px;padding-bottom:5px;line-height:15px;" href="http://www.userbenchmark.com/COL-User/User?id=205" title="View COL-User's profile">
	
	<span>COL-User</span><br />
	<span style="display:inline-block;position:relative;margin-left:5px;top:5px;">
		
		<img src="http://www.userbenchmark.com/resources/img/guest.png?s=40" class="mhajaxstatus grayscale" alt="Avatar" style="max-width:40px;width:40px;height:40px;" />
	</span>
	<span style="float:left;">level<br /><span style="border-bottom:1px solid darkorange;">624</span>
	</span>
</a></span><br />
		</div>


		<div class="col-xs-9 fancyfont">
				<h4 class="lighterblacktext" style="display:inline;">Poor</h4>
		    
			<span class="wiki-ts">5 days ago.</span>

			<p style="" class="medp">excellent gpu with really good price/performance ratio</p>
			<div style="margin-left:30px;">
			</div>


		</div>
	</div>	

	<div class="row">
		<div class="col-xs-offset-3 col-xs-9">
				<hr class="thin" />
		</div>
	</div>
	
	<div style="margin-top:10px;margin-bottom:10px;" class="row hovertarget">
		<div class="col-xs-3">
			<h2 class="textshadow ambertext">Your vote?</h2>
		</div>
		<div class="col-xs-9 hovertargetnear">
			<strong style="font-size:28px;line-height:36px;margin-bottom:5px;"><a href="#" style="text-decoration:none;padding:0 5px;" onclick="jsf.util.chain(this,event,'fMSG(event,\'Thank You\')','mojarra.jsfcljs(document.getElementById(\'wikiForm\'),{\'wikiForm:j_idt1091\':\'wikiForm:j_idt1091\',\'VPIDMP\':\'3510\',\'VMP\':\'1\',\'VRDMP\':\'true\'},\'\')');return false" class="mharrow mharrow-like graytext">▲Like
					</a> 
				<a href="#" style="text-decoration:none;padding:0 5px;" onclick="jsf.util.chain(this,event,'fMSG(event,\'Thank You\')','mojarra.jsfcljs(document.getElementById(\'wikiForm\'),{\'wikiForm:j_idt1097\':\'wikiForm:j_idt1097\',\'VPIDMP\':\'3510\',\'VMP\':\'-1\',\'VRDMP\':\'true\'},\'\')');return false" class="mharrow mharrow-dislike graytext">▼Dislike
					</a>
			</strong>
<p style="margin-bottom:0;font-size:16px;line-height:25px;" class="ambertext fancyfont">You have viewed 12 pages, please contribute.</p>
			<hr class="fat" />
		</div>
	</div>
</div>


<div class="col-xs-4">
		<div class="fancyfont" style="margin-top:65px;margin-bottom:65px;">
			<div style="position:relative;"> 
				<img style="height:80px;width:100%;" class="lazynonseq" data-original="http://www.userbenchmark.com/resources/img/wri/age_curve.png" src="http://www.userbenchmark.com/resources/img/loading-transp.png" />
				<div style="position:absolute;top:-15%;left:35%;border-left:1px solid #666;width:1px;height:110%;"><div style="position:relative"><div style="position:absolute;top:-40px;left:-65px;width:130px;font-weight:bold;text-align:center;">Reaching its Prime<br />Age: 10 months</div></div></div>
			</div>
		</div>
		<h3 class="conclusion">Speed Comparisons</h3>
		<p class="medp">
			 vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-970-vs-Nvidia-GTX-950/2577vs3510">Nvidia GTX 970</a><br /> vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-980-Ti-vs-Nvidia-GTX-950/3439vs3510">Nvidia GTX 980 Ti</a><br /> vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-380/3510vs3482">AMD R9 380</a><br /> vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-390/3510vs3481">AMD R9 390</a><br /> vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-290X/3510vs2166">AMD R9 290X</a><br /> vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-980-vs-Nvidia-GTX-950/2576vs3510">Nvidia GTX 980</a><br /> vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-280X/3510vs2192">AMD R9 280X</a><br /> vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-960-vs-Nvidia-GTX-950/3165vs3510">Nvidia GTX 960</a><br /> vs <a href="http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-290/3510vs2171">AMD R9 290</a><br />
		</p>
	
</div>

</div><input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="7968604625407084085:-737178726882250487" autocomplete="off" />
</form>
<div class="row sect-m-t">
	<div class="col-xs-10">
	
	








	<a class="h2 major-heading bglink navtrack" data-navtrack="MF_BAN" href="http://gpu.userbenchmark.com/Comparison">
		
			<span class="conclusion"><img class="lazy major-heading-img" data-original="http://www.userbenchmark.com/resources/img/icons/GPU_128.png" src="http://www.userbenchmark.com/resources/img/loading-transp.png" /> 506 Graphics Cards <span class="linktext" style="text-transform:none">(Compared)</span></span>
			<span class="tallp lightblacktext " style="display:block;">Thousands of user benchmarks compiled into one comparison list.</span>
	</a>		
		<p style="margin-bottom:20px;" class="medp fl-dc">See how consistently different GPUs perform with varying real world conditions. The charts also illustrate overall performance, popularity and rank.</p>
	</div>
</div>

<div class="row sect-m-t">
	<div class="col-xs-10">
	
	








	<a class="h2 major-heading bglink navtrack" data-navtrack="CB_BAN" href="http://www.userbenchmark.com/PCBuilder">
		
			<span class="conclusion"><img class="lazy major-heading-img" data-original="http://www.userbenchmark.com/resources/img/icons/CB_128.png" src="http://www.userbenchmark.com/resources/img/loading-transp.png" /> Custom PC Builder <span class="linktext" style="text-transform:none">(Start a new build)</span></span>
			<span class="tallp lightblacktext " style="display:block;">Build your perfect PC: compare component prices, popularity, speed and value for money.</span>
	</a>

		<h4>CHOOSE A COMPONENT:</h4>
		<div class="btn-group btn-group-lg">
				<a class="btn btn-default navtrack" href="http://www.userbenchmark.com/PCBuilder?tab=CPU" data-navtrack="CB_BAN_CPU"><img class="lic-med lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/CPU_128.png" /> CPU</a>
				<a class="btn btn-default navtrack" href="http://www.userbenchmark.com/PCBuilder?tab=GPU" data-navtrack="CB_BAN_GPU"><img class="lic-med lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/GPU_128.png" /> GPU</a>
				<a class="btn btn-default navtrack" href="http://www.userbenchmark.com/PCBuilder?tab=SSD" data-navtrack="CB_BAN_SSD"><img class="lic-med lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/SSD_128.png" /> SSD</a>
				<a class="btn btn-default navtrack" href="http://www.userbenchmark.com/PCBuilder?tab=HDD" data-navtrack="CB_BAN_HDD"><img class="lic-med lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/HDD_128.png" /> HDD</a>
				<a class="btn btn-default navtrack" href="http://www.userbenchmark.com/PCBuilder?tab=RAM" data-navtrack="CB_BAN_RAM"><img class="lic-med lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/RAM_128.png" /> RAM</a>
				<a class="btn btn-default navtrack" href="http://www.userbenchmark.com/PCBuilder?tab=MBD" data-navtrack="CB_BAN_MBD"><img class="lic-med lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/MBD_128.png" /> MBD</a>
		</div>
	</div>
</div>
<div class="sect-m-t">
	
	<div style="margin-bottom:2px">
	<h2 class="conclusion"><i class="fa fa-commenting-o ambertext"></i> Frequently Asked Questions</h2>
	<p class="tallp"></p>
	</div>
</div>


<div class="faqtoc"><div class="blacktext h4 conclusion" style="margin-left:0px">Computer Components FAQ</div> 
		<div style="margin-left:0px"><a class="nodec " href="http://www.userbenchmark.com/Faq/What-is-the-UBM-value-for-money-rating/96">What is the UBM value for money rating?</a></div> 
		<div style="margin-left:0px"><a class="nodec " href="http://www.userbenchmark.com/Faq/What-is-UBM-Effective-Speed/95">What is UBM Effective Speed?</a></div> 
		<div style="margin-left:0px"><a class="nodec " href="http://www.userbenchmark.com/Faq/Thunderbolt-speed/30">Thunderbolt speed?</a></div> 
		<div style="margin-left:0px"><a class="nodec " href="http://www.userbenchmark.com/Faq/Are-USB-30-cables-different/21">Are USB 3.0 cables different?</a></div><div class="blacktext h4 conclusion" style="margin-left:30px">Graphics Cards</div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/How-to-force-Optimus-or-Switchable-discrete-GPUs/97">How to force Optimus or Switchable discrete GPUs?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-are-the-UBM-DX11-GPU-tests/92">What are the UBM DX11 GPU tests?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-are-the-UBM-DX10-GPU-tests/91">What are the UBM DX10 GPU tests?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-are-the-UBM-DX09-GPU-tests/90">What are the UBM DX09 GPU tests?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-is-the-Splatting-GPU-benchmark/89">What is the Splatting GPU benchmark?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-is-the-Gravity-NBody-GPU-benchmark/88">What is the Gravity (NBody) GPU benchmark?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-is-the-MRender-GPU-benchmark/87">What is the MRender GPU benchmark?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-is-the-parallax-POM-GPU-benchmark/86">What is the parallax (POM) GPU benchmark?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-is-the-reflection-HDR-GPU-benchmark/85">What is the reflection (HDR) GPU benchmark?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-is-the-lighting-LDPRT-benchmark/84">What is the lighting (LDPRT) benchmark?</a></div> 
		<div style="margin-left:30px"><a class="nodec " href="http://gpu.userbenchmark.com/Faq/What-is-the-GPU-value-for-money-rating/83">What is the GPU value for money rating?</a></div> 
		<div style="margin-left:30px"><a class="nodec bglink-highlight" href="http://gpu.userbenchmark.com/Faq/What-is-the-effective-GPU-speed-index/82">What is the effective GPU speed index?</a></div>
</div>
	<div class="sect-m-t">
	
	<div style="margin-bottom:2px">
	<h2 class="conclusion"><i class="fa fa-star-o ambertext"></i> Best User Rated</h2>
	<p class="tallp"></p>
	</div>
	</div>
	<ul class="list-unstyled">
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/Nvidia-GTX-970/Rating/2577"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/UZWxbxR.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">Nvidia GTX 970</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/Nvidia-GTX-980-Ti/Rating/3439"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/BBPBJSJ.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">Nvidia GTX 980 Ti</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/AMD-R9-380/Rating/3482"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/7X3sPRj.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">AMD R9 380</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/AMD-R9-390/Rating/3481"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/7X3sPRj.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">AMD R9 390</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/AMD-R9-290X/Rating/2166"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/eEHmR8H.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">AMD R9 290X</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/Nvidia-GTX-980/Rating/2576"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/01tfwGH.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">Nvidia GTX 980</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/AMD-R9-280X/Rating/2192"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/Zgqzw3U.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">AMD R9 280X</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/Nvidia-GTX-960/Rating/3165"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/HL9jmks.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">Nvidia GTX 960</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/AMD-R9-290/Rating/2171"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/eEHmR8H.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">AMD R9 290</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/AMD-R9-Fury-X/Rating/3498"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/qvVic5G.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">AMD R9 Fury-X</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/AMD-R9-270X/Rating/2188"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/eEHmR8H.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">AMD R9 270X</span>
	</a>
</li>
<li style="margin-bottom:40px;position:relative" class="col-xs-2">
	<a style="text-align:center;text-decoration:none;font-size:16px;display:block;" class="fancyfont lightblacktext" href="http://gpu.userbenchmark.com/AMD-R9-390X/Rating/3497"> 
		<span style="display:block;height:120px;line-height:120px;">
			 <img src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://i.imgur.com/7X3sPRj.jpg" class="lazynonseq" style="max-height:90%;max-width:75%;padding:5px;vertical-align:bottom;" /> 
		</span>
			<span style="margin-top:15px;display:block;" class="mhelipsis">AMD R9 390X</span>
	</a>
</li>
		
	</ul>
	<div id="markupModal" class="modal fade" role="dialog" tabindex="-1">
	<div class="modal-dialog">
	<div class="modal-content">
		<div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
			<h3 class="modal-title">Copy Markup <small>(Pasteable into forums and deal posts)</small></h3>
			<div class="btn-group btn-group-lg btn-group-justified line-m-t" data-toggle="buttons">
				<label class="btn btn-default active">
					<input type="radio" onchange="markupRadioChanged(this);" value="text" />Text
				</label>
				<label class="btn btn-default">
					<input type="radio" onchange="markupRadioChanged(this);" value="forum" /><i class="fa fa-code"></i> Forum
				</label>
				<label class="btn btn-default">
					<input type="radio" onchange="markupRadioChanged(this);" value="reddit" /><i class="fa fa-reddit-alien"></i> Reddit
				</label>
			</div>			
		</div>
		<div style="height:350px" class="modal-body"><textarea id="modalTextArea" name="modalTextArea" style="width:99%;height:95%;white-space:pre;word-wrap:normal;overflow-x:scroll;" spellcheck="false">[url=http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510]Userbenchmark: Nvidia GTX 950 [/url]
Average Bench: 43% - 44th / 506</textarea><input id="redditMarkupInput" type="hidden" name="redditMarkupInput" value="[Userbenchmark: Nvidia GTX 950 ](http://gpu.userbenchmark.com/Nvidia-GTX-950/Rating/3510)  
Average Bench: 43% - 44th / 506" />
		</div>
	</div>
	</div>
	</div>
	<script>
		var fmarkup = null;
		function markupRadioChanged(radio)
		{
			//if(fmarkup == null)	fmarkup = document.getElementById('modalTextArea').value;
			
			if(radio.value == 'forum')
				document.getElementById('modalTextArea').value = fmarkup;
			else if(radio.value == 'reddit')
				document.getElementById('modalTextArea').value = document.getElementById('redditMarkupInput').value;
			else if(radio.value == 'text')
				document.getElementById('modalTextArea').value = fmarkup.replace(/\[\/?(?:b|i|u|url|quote|code|img|color|size)*?.*?\]/img, '');
			
			document.getElementById('modalTextArea').select();
			
			guiLogMessage('MARKUP_TOGGLE/'+radio.value);
		}
		function showMarkupDialog(msgppend)
		{
			if(fmarkup == null)
			{
				fmarkup = document.getElementById('modalTextArea').value;
				document.getElementById('modalTextArea').value = fmarkup.replace(/\[\/?(?:b|i|u|url|quote|code|img|color|size)*?.*?\]/img, '');
			}
			
			$('#markupModal').modal('show');
			
			setTimeout('document.getElementById(\'modalTextArea\').select()',300);
			guiLogMessage('MARKUP_OPEN'+(!msgppend?'':msgppend));
		}
	</script>
			<span class="tb-soc-links">
				<span style="font-size:40px;line-height:40px;color:#e8e8e8;margin-right:20px;">Share page</span>


<div class="btn-group pull-right center-block btn-group-lg">
	<a class="btn btn-blue" onmousedown="guiLogMessage('FOOTER_SHR_F ')" rel="nofollow" target="_blank" href="https://facebook.com/sharer.php?u=http%3A%2F%2Fgpu.userbenchmark.com%2FNvidia-GTX-950%2FRating%2F3510" title="Share page with friends on Facebook"><i class="fa fa-facebook"></i></a>
	<a class="btn btn-info" onmousedown="guiLogMessage('FOOTER_SHR_T ')" rel="nofollow" target="_blank" href="https://twitter.com/intent/tweet?url=http%3A%2F%2Fgpu.userbenchmark.com%2FNvidia-GTX-950%2FRating%2F3510&amp;via=UserBenchmark&amp;text=PC Benchmarks" title="Share page with followers on Twitter"><i class="fa fa-twitter"></i></a>
	<a class="btn btn-danger" onmousedown="guiLogMessage('FOOTER_SHR_G ')" rel="nofollow" target="_blank" href="https://plus.google.com/share?url=http%3A%2F%2Fgpu.userbenchmark.com%2FNvidia-GTX-950%2FRating%2F3510" title="Share page with followers on Google+"><i class="fa fa-google-plus"></i></a>
</div>
			</span>

	</div>
	
	
</div>

	
	<div class="pagewidth pagebounds container-fluid" style="padding:0">
		<div id="scrnotfooter" style="background:#484848;border-left:10px solid transparent;border-right:10px solid transparent;">
			
			<div class="h0 wheattext text-center" style="padding:40px 0;"><span onclick="window.scrollTo(0, 0);window.open((window.location.href.match('.*\.dev:8080.*')?window.location.href.replace('.userbenchmark.dev:8080','\.userbenchmark\.pre'):window.location.href.replace('\.userbenchmark\.pre','.userbenchmark.dev:8080')))">The</span> <span onclick="window.scrollTo(0, 0);window.open((window.location.href.match('.*\.dev:8080.*')?window.location.href.replace('.userbenchmark.dev:8080','\.userbenchmark\.com'):window.location.href.replace('\.userbenchmark\.com','.userbenchmark.dev:8080')))">Best.</span></div>
			
			<table class="table table-no-border table-super-condensed table-h-center table-th-normal" style="table-layout:fixed;font-size:13px;"><tr><th><a class='ambertext h3 navtrack bglink bglink-gray bglink-iconparent' data-navtrack='SD_FOOTLINK' href='http://cpu.userbenchmark.com'><img class='linkicon lazy' src='http://www.userbenchmark.com/resources/img/loading-transp.png'  data-original='http://www.userbenchmark.com/resources/img/icons/CPU_128.png' />CPU</a></th><th><a class='ambertext h3 navtrack bglink bglink-gray bglink-iconparent' data-navtrack='SD_FOOTLINK' href='http://gpu.userbenchmark.com'><img class='linkicon lazy' src='http://www.userbenchmark.com/resources/img/loading-transp.png'  data-original='http://www.userbenchmark.com/resources/img/icons/GPU_128.png' />GPU</a></th><th><a class='ambertext h3 navtrack bglink bglink-gray bglink-iconparent' data-navtrack='SD_FOOTLINK' href='http://ssd.userbenchmark.com'><img class='linkicon lazy' src='http://www.userbenchmark.com/resources/img/loading-transp.png'  data-original='http://www.userbenchmark.com/resources/img/icons/SSD_128.png' />SSD</a></th></tr><tr><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://cpu.userbenchmark.com/Intel-Core-i7-6700K/Rating/3502'>Intel Core i7-6700K</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://cpu.userbenchmark.com/Intel-Core-i7-6700K/Rating/3502#Prices' title='Hot Ebay price'><span class='nowrap'>$310<i class='fa fa-fire hotprice '></i></span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://gpu.userbenchmark.com/Nvidia-GTX-970/Rating/2577'>Nvidia GTX 970</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://gpu.userbenchmark.com/Nvidia-GTX-970/Rating/2577#Prices' title='Hot Ebay price'><span class='nowrap'>$265<i class='fa fa-fire hotprice '></i></span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://ssd.userbenchmark.com/Samsung-850-Evo-250GB/Rating/2977'>Samsung 850 Evo 250GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://ssd.userbenchmark.com/Samsung-850-Evo-250GB/Rating/2977#Prices' title='Live Newegg price'><span class='nowrap'>$88</span></a></span></td></tr><tr><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://cpu.userbenchmark.com/Intel-Core-i5-6600K/Rating/3503'>Intel Core i5-6600K</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://cpu.userbenchmark.com/Intel-Core-i5-6600K/Rating/3503#Prices' title='Live Amazon price'><span class='nowrap'>$243</span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://gpu.userbenchmark.com/Nvidia-GTX-980-Ti/Rating/3439'>Nvidia GTX 980 Ti</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://gpu.userbenchmark.com/Nvidia-GTX-980-Ti/Rating/3439#Prices' title='Hot Ebay price'><span class='nowrap'>$499<i class='fa fa-fire hotprice '></i></span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://ssd.userbenchmark.com/Samsung-850-Pro-256GB/Rating/2385'>Samsung 850 Pro 256GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://ssd.userbenchmark.com/Samsung-850-Pro-256GB/Rating/2385#Prices' title='Hot Ebay price'><span class='nowrap'>$118<i class='fa fa-fire hotprice '></i></span></a></span></td></tr><tr><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://cpu.userbenchmark.com/Intel-Core-i7-4790K/Rating/2384'>Intel Core i7-4790K</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://cpu.userbenchmark.com/Intel-Core-i7-4790K/Rating/2384#Prices' title='Live Ebay price'><span class='nowrap'>$330</span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://gpu.userbenchmark.com/AMD-R9-380/Rating/3482'>AMD R9 380</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://gpu.userbenchmark.com/AMD-R9-380/Rating/3482#Prices' title='Live Newegg price'><span class='nowrap'>$170</span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://ssd.userbenchmark.com/Samsung-850-Evo-500GB/Rating/3477'>Samsung 850 Evo 500GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://ssd.userbenchmark.com/Samsung-850-Evo-500GB/Rating/3477#Prices' title='Live Newegg price'><span class='nowrap'>$155</span></a></span></td></tr>
			</table>
			
			<table class="table table-no-border table-super-condensed table-h-center table-th-normal head-m-t" style="table-layout:fixed;font-size:13px;"><tr><th><a class='ambertext h3 navtrack bglink bglink-gray bglink-iconparent' data-navtrack='SD_FOOTLINK' href='http://hdd.userbenchmark.com'><img class='linkicon lazy' src='http://www.userbenchmark.com/resources/img/loading-transp.png'  data-original='http://www.userbenchmark.com/resources/img/icons/HDD_128.png' />HDD</a></th><th><a class='ambertext h3 navtrack bglink bglink-gray bglink-iconparent' data-navtrack='SD_FOOTLINK' href='http://ram.userbenchmark.com'><img class='linkicon lazy' src='http://www.userbenchmark.com/resources/img/loading-transp.png'  data-original='http://www.userbenchmark.com/resources/img/icons/RAM_128.png' />RAM</a></th><th><a class='ambertext h3 navtrack bglink bglink-gray bglink-iconparent' data-navtrack='SD_FOOTLINK' href='http://usb.userbenchmark.com'><img class='linkicon lazy' src='http://www.userbenchmark.com/resources/img/loading-transp.png'  data-original='http://www.userbenchmark.com/resources/img/icons/USB_128.png' />USB</a></th></tr><tr><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://hdd.userbenchmark.com/WD-Black-1TB-2013/Rating/1822'>WD Black 1TB (2013)</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://hdd.userbenchmark.com/WD-Black-1TB-2013/Rating/1822#Prices' title='Live Ebay price'><span class='nowrap'>$72</span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://ram.userbenchmark.com/HyperX-Fury-DDR4-2133-C14-2x8GB/Rating/3552'>HyperX Fury DDR4 2133 C14 2x8GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://ram.userbenchmark.com/HyperX-Fury-DDR4-2133-C14-2x8GB/Rating/3552#Prices' title='Hot Newegg price'><span class='nowrap'>$55<i class='fa fa-fire hotprice '></i></span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://usb.userbenchmark.com/SanDisk-Extreme-USB-30-32GB/Rating/1466'>SanDisk Extreme 32GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://usb.userbenchmark.com/SanDisk-Extreme-USB-30-32GB/Rating/1466#Prices' title='Live Ebay price'><span class='nowrap'>$21</span></a></span></td></tr><tr><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://hdd.userbenchmark.com/WD-Blue-1TB-2012/Rating/1779'>WD Blue 1TB (2012)</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://hdd.userbenchmark.com/WD-Blue-1TB-2012/Rating/1779#Prices' title='Live Amazon price'><span class='nowrap'>$50</span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://ram.userbenchmark.com/Corsair-Vengeance-LPX-DDR4-3000-C15-2x8GB/Rating/3546'>Corsair Vengeance LPX DDR4 3000 C15 2x8GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://ram.userbenchmark.com/Corsair-Vengeance-LPX-DDR4-3000-C15-2x8GB/Rating/3546#Prices' title='Hot Newegg price'><span class='nowrap'>$65<i class='fa fa-fire hotprice '></i></span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://usb.userbenchmark.com/SanDisk-Extreme-USB-30-64GB/Rating/1459'>SanDisk Extreme 64GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLFOOTERN' href='http://usb.userbenchmark.com/SanDisk-Extreme-USB-30-64GB/Rating/1459#Prices' title='Live Ebay price'><span class='nowrap'>$30</span></a></span></td></tr><tr><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://hdd.userbenchmark.com/Seagate-Barracuda-720014-1TB/Rating/1849'>Seagate Barracuda 7200.14 1TB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://hdd.userbenchmark.com/Seagate-Barracuda-720014-1TB/Rating/1849#Prices' title='Hot Ebay price'><span class='nowrap'>$45<i class='fa fa-fire hotprice '></i></span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://ram.userbenchmark.com/GSKILL-Trident-Z-DDR4-3200-C16-2x8GB/Rating/3550'>G.SKILL Trident Z DDR4 3200 C16 2x8GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://ram.userbenchmark.com/GSKILL-Trident-Z-DDR4-3200-C16-2x8GB/Rating/3550#Prices' title='Hot Newegg price'><span class='nowrap'>$85<i class='fa fa-fire hotprice '></i></span></a></span></td><td><span class='nowrap'><a class='nodec wheattext navtrack' data-navtrack='PR_FOOTLINK' href='http://usb.userbenchmark.com/SanDisk-Ultra-Fit-USB-30-32GB/Rating/2697'>SanDisk Ultra Fit 32GB</a> <a class='nodec navtrack ambertext' data-navtrack='PRCNAVLHFOOTERN' href='http://usb.userbenchmark.com/SanDisk-Ultra-Fit-USB-30-32GB/Rating/2697#Prices' title='Hot Ebay price'><span class='nowrap'>$9<i class='fa fa-fire hotprice '></i></span></a></span></td></tr>
			</table>
			
			<div class="be-lb head-m-t">
		<div class="be-int text-center wheattext" style="background:#484848;border:1px solid #333;padding:4px;height:100%;border-radius:4px;">
			<img class="pull-right" style="width:82px;height:71px;margin-right:3%;border-bottom:1px solid #CC8400;" src="http://www.userbenchmark.com/resources/img/wri/creatives/assets/flame.gif" />
			<img class="pull-left" style="width:82px;height:71px;margin-left:3%; border-bottom:1px solid #CC8400;" src="http://www.userbenchmark.com/resources/img/wri/creatives/assets/flame.gif" />
			<div style="font-size:24px;line-height:44px;margin-top:-3px">Today's hottest 
				<div class="btn-group btn-group-sm" style="vertical-align:-17%">
																				<a class="btn btn-primary" onclick="onValidateChecksAndSetMerchants(this);">Amazon <i class="fa fa-check-square-o" style="width:1em;"></i></a>
																				<a class="btn btn-primary extramutedtext" onclick="onValidateChecksAndSetMerchants(this);">Ebay <i class="fa fa-square-o" style="width:1em;"></i></a><a class="btn btn-primary extramutedtext" onclick="onValidateChecksAndSetMerchants(this);">Newegg <i class="fa fa-square-o" style="width:1em;"></i></a>
				</div> deals <i class="fa fa-external-link fa-sm ambertext"></i>
			</div>
			<div>
				<div class="btn-group btn-group-justified btn-group-sm" style="margin-top:2px;width:58%;margin-left:21%">
						<a class="btn btn-primary" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotCPUAmazon/lbFMultiA/0">CPU</a>
						<a class="btn btn-primary" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotGPUAmazon/lbFMultiA/0">GPU</a>
						<a class="btn btn-primary" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotSSDAmazon/lbFMultiA/0">SSD</a>
						<a class="btn btn-primary" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotHDDAmazon/lbFMultiA/0">HDD</a>
						<a class="btn btn-primary" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotUSBAmazon/lbFMultiA/0">USB</a>
						<a class="btn btn-primary" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotRAMAmazon/lbFMultiA/0">RAM</a>
						<a class="btn btn-primary" target="_blank" rel="nofollow" onclick="return onNavigateToHotPrice(this);" href="http://www.userbenchmark.com/Go/HotWWWAmazon/lbFMultiA/0">MBD</a>
				</div>
			</div>
		</div>
			</div>
			
			
			<div class="h0" style="padding:60px 0;text-align:center">
				<a class="wheattext nodec bglink bglink-gray" style="overflow:hidden;display:inline-block;padding:10px;line-height:64px;" href="/Software"><img style="width:64px;height:64px;margin-right:10px;float:left;" class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/wri/bench-speed/bench-speed-64t.png" />Test your PC</a>
				<a class="wheattext nodec bglink bglink-gray" style="overflow:hidden;display:inline-block;padding:10px;line-height:64px;margin-left:10%" href="http://www.userbenchmark.com/PCBuilder"><img style="width:64px;height:64px;margin-right:10px;float:left;" class="lazy" src="http://www.userbenchmark.com/resources/img/loading-transp.png" data-original="http://www.userbenchmark.com/resources/img/icons/CB_128.png" />Build a PC</a>
			</div>
		</div>
		
		<div style="background:#333;border-left:10px solid transparent;border-right:10px solid transparent;">
			<div style="text-align:center;padding:15px 0;" class="graytext">
				 <a class="graytext nodec" href="http://www.userbenchmark.com/page/guide">User Guide</a>  •  <a class="graytext nodec" href="http://www.userbenchmark.com/page/about">About</a>  •  <a class="graytext nodec" href="http://www.userbenchmark.com/Faq/Where-are-all-the-FAQs-listed/103">FAQ</a>  •  <a class="graytext nodec" href="mailto:support@userbenchmark.com" title="Please email us, we would love to hear from you.">@Email</a>  •  <a class="graytext nodec" href="http://www.userbenchmark.com/page/privacy">Privacy</a>  •  <a class="graytext nodec" href="http://www.userbenchmark.com/page/developer">Developer</a>
				 <a class="pull-right btn btn-sm btn-warning lightblacktext" style="margin-top:-5px;margin-left:-100%" href="javascript:void(0)" onclick="feedbackDialogAction()"><i class="fa fa-bullhorn fa-lg"></i> Feedback</a>
			</div>
		</div>
<form id="feedbackDialogForm" name="feedbackDialogForm" method="post" action="/pages/product.jsf" enctype="application/x-www-form-urlencoded">
<input type="hidden" name="feedbackDialogForm" value="feedbackDialogForm" />
<input id="feedbackDialogForm:hinputfid" type="hidden" name="feedbackDialogForm:hinputfid" /><a id="feedbackDialogForm:feedbackdidpopup" href="#" onclick="mojarra.ab(this,event,'action','feedbackDialogForm:hinputfid','notForm:userNot @form',{'onevent':showFeedbackModal});return false"></a>

<script>
	function showFeedbackModal(event)
	{
		if (event.status == "success")$('#myFeedbackModal').modal('show');
	}
	
	function feedbackDialogAction(optmap)
	{
		var combined = {};combined['fn'] = 'sfb';
	    for (var attrname in optmap) { combined[attrname] = optmap[attrname];}
		document.getElementById('feedbackDialogForm:hinputfid').value=JSON.stringify(combined);	document.getElementById('feedbackDialogForm:feedbackdidpopup').click();
	}
</script>

<div id="myFeedbackModal" class="modal fade">
	<div class="modal-dialog">
		<div class="modal-content">
	
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal">×</button>
				<h4 style="white-space:nowrap;overflow:hidden;line-height:36px;" class="modal-title">Feedback</h4>
			</div>

			<div class="modal-body"><input type="hidden" name="feedbackDialogForm:j_idt1193" />
				
				<div class="form-group hidden">
					<label class="control-label">Link</label><input type="text" name="feedbackDialogForm:j_idt1195" class="form-control" placeholder="e.g. http://www.geforce.com/hardware/desktop-gpus/geforce-gtx-970" maxlength="255" />
				</div>

				<div class="form-group">
					<label class="control-label">Please enter your feedback here</label><textarea name="feedbackDialogForm:j_idt1197" class="form-control" style="height:120px;" maxlength="1000"></textarea>
				</div>
				
				<div class="form-group ">
					<label class="control-label">Email</label><input type="text" name="feedbackDialogForm:j_idt1199" class="form-control" placeholder="Optionally enter your email if you would like a response" maxlength="255" />
				</div>
			</div>
	
			<div class="modal-footer">
				<div style="float:right"><input id="feedbackDialogForm:j_idt1201" type="submit" name="feedbackDialogForm:j_idt1201" value="Submit" class="btn btn-primary" onclick="jsf.util.chain(this,event,'$(\'#myFeedbackModal\').modal(\'hide\')','mojarra.ab(this,event,\'action\',\'@form\',\'notForm:userNot\')');return false" />
					<a href="#" class="btn btn-default" data-dismiss="modal">Cancel</a>
				</div>
	        </div>
	        
		</div>
	</div>
</div><input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="7968604625407084085:-737178726882250487" autocomplete="off" />
</form>		
	</div>

	<script type="text/javascript" src="http://www.userbenchmark.com/resources/userbenchmark.js?1465343856485"></script>
<form id="notForm" name="notForm" method="post" action="/pages/product.jsf" enctype="application/x-www-form-urlencoded">
<input type="hidden" name="notForm" value="notForm" />
<div id="notForm:userNot"></div><input type="hidden" name="javax.faces.ViewState" id="j_id1:javax.faces.ViewState:0" value="7968604625407084085:-737178726882250487" autocomplete="off" />
</form>

<script>
  	$('.stickyTarget').waypoint('sticky', {
  		offset: 64,
  		stuckClass: 'toclinksstuckclass pagewidth pagebounds container-fluid'
  	});
</script>
	<script>
	
		$("#select_compare").select2(
			$.extend(mcCoreSelect2Options, {
				data:{ results: [{id:'cid10',t:' ** GROUP AVERAGE (9 HIGHEST-VOTED) **',p:' '},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-1080/3510vs3603',t:'1. Nvidia GTX 1080 - 162%',p:'$800'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-980-Ti-vs-Nvidia-GTX-950/3439vs3510',t:'2. Nvidia GTX 980 Ti - 129%',p:'$499'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-Titan-X-vs-Nvidia-GTX-950/3282vs3510',t:'3. Nvidia GTX Titan X - 123%',p:'$1,000'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-Fury-X/3510vs3498',t:'4. AMD R9 Fury-X - 111%',p:'$640'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-Fury/3510vs3509',t:'5. AMD R9 Fury - 104%',p:'$510'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-980-vs-Nvidia-GTX-950/2576vs3510',t:'6. Nvidia GTX 980 - 97.7%',p:'$445'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-Nano/3510vsm58413',t:'7. AMD R9 Nano - 97.2%',p:'$530'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-390X/3510vs3497',t:'8. AMD R9 390X - 93.6%',p:'$400'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-290X/3510vs2166',t:'9. AMD R9 290X - 90.1%',p:'$549'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-780-Ti/3510vs2165',t:'10. Nvidia GTX 780 Ti - 89.7%',p:'$410'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-295X2-CrossFire-Disabled/3510vsm11791',t:'11. AMD R9 295X2 (CrossFire Disabled) - 87.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-390/3510vs3481',t:'12. AMD R9 390 - 87.2%',p:'$290'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-Titan-Black-vs-Nvidia-GTX-950/3158vs3510',t:'13. Nvidia GTX Titan Black - 86.2%',p:'$1,000'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-970-vs-Nvidia-GTX-950/2577vs3510',t:'14. Nvidia GTX 970 - 83.7%',p:'$265'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-290/3510vs2171',t:'15. AMD R9 290 - 83.3%',p:'$399'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-Titan-Z-SLI-Disabled-vs-Nvidia-GTX-950/m17751vs3510',t:'16. Nvidia GTX Titan Z (SLI Disabled) - 79.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-Titan-vs-Nvidia-GTX-950/2191vs3510',t:'17. Nvidia GTX Titan - 79.3%',p:'$1,088'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-780-4GB/3510vsm11282',t:'18. Nvidia GTX 780 4GB - 77.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-780/3510vs2164',t:'19. Nvidia GTX 780 - 76.6%',p:'$329'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K6000-vs-Nvidia-GTX-950/2837vs3510',t:'20. Nvidia Quadro K6000 - 73.7%',p:'$4,000'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-380X/3510vs3532',t:'21. AMD R9 380X - 67.5%',p:'$230'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-980M-vs-Nvidia-GTX-950/m15596vs3510',t:'22. Nvidia GTX 980M - 65.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7970/3510vs2163',t:'23. AMD HD 7970 - 61.5%',p:'$435'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-380/3510vs3482',t:'24. AMD R9 380 - 61.3%',p:'$170'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-280X/3510vs2192',t:'25. AMD R9 280X - 60.4%',p:'$350'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-770/3510vs2174',t:'26. Nvidia GTX 770 - 60.1%',p:'$279'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-285/3510vs3174',t:'27. AMD R9 285 - 59.6%',p:'$189'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7990-CrossFire-Disabled/3510vsm7985',t:'28. AMD HD 7990 (CrossFire Disabled) - 58.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K5200-vs-Nvidia-GTX-950/m20811vs3510',t:'29. Nvidia Quadro K5200 - 56.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-680/3510vs3148',t:'30. Nvidia GTX 680 - 56%',p:'$360'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-280/3510vs2241',t:'31. AMD R9 280 - 53.1%',p:'$185'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-690-SLI-Disabled/3510vsm8241',t:'32. Nvidia GeForce GTX 690 (SLI Disabled) - 52.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-960-vs-Nvidia-GTX-950/3165vs3510',t:'33. Nvidia GTX 960 - 51.4%',p:'$180'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-670/3510vs2181',t:'34. Nvidia GTX 670 - 50.1%',p:'$435'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7950/3510vs2160',t:'35. AMD HD 7950 - 49.9%',p:'$290'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-970M-vs-Nvidia-GTX-950/m17319vs3510',t:'36. Nvidia GTX 970M - 49%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-270X/3510vs2188',t:'37. AMD R9 270X - 48.2%',p:'$277'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-760-Ti-OEM/3510vsm10856',t:'38. Nvidia GTX 760 Ti OEM - 48%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7870/3510vs2161',t:'39. AMD HD 7870 - 46.7%',p:'$203'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-660-Ti/3510vs2183',t:'40. Nvidia GTX 660 Ti - 46.2%',p:'$362'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-760/3510vs2159',t:'41. Nvidia GTX 760 - 46%',p:'$209'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-880M/3510vsm8540',t:'42. Nvidia GTX 880M - 43.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-270/3510vs3149',t:'43. AMD R9 270 - 43.1%',p:'$189'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-FirePro-W7000/3510vs2842',t:'45. AMD FirePro W7000 - 41.7%',p:'$800'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K4200-vs-Nvidia-GTX-950/2838vs3510',t:'46. Nvidia Quadro K4200 - 40.9%',p:'$820'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-580/3510vs3150',t:'47. Nvidia GTX 580 - 40.4%',p:'$450'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-780M/3510vsm7760',t:'48. Nvidia GTX 780M - 40.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R7-370/3510vs3571',t:'49. AMD R7 370 - 40.1%',p:'$125'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-M290/3510vsm31120',t:'50. AMD R9 M290 - 39.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-680MX/3510vsm8956',t:'51. Nvidia GTX 680MX - 37.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R7-265/3510vs3296',t:'52. AMD R7 265 - 37.7%',p:'$149'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K5000-vs-Nvidia-GTX-950/m9098vs3510',t:'53. Nvidia Quadro K5000 - 37.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-775M/3510vsm13797',t:'54. Nvidia GTX 775M - 36.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-660/3510vs2162',t:'55. Nvidia GTX 660 - 36.7%',p:'$170'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-760-192-bit/3510vsm11047',t:'56. Nvidia GTX 760 (192-bit) - 36.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7850/3510vs2182',t:'57. AMD HD 7850 - 36.2%',p:'$174'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-570/3510vs3156',t:'58. Nvidia GTX 570 - 36.1%',p:'$350'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Microsoft-RemoteFX-Graphics-Device---WDDM/3510vsm13438',t:'59. Microsoft RemoteFX Graphics Device - WDDM - 36%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7970M/3510vsm9441',t:'60. AMD Radeon HD 7970M - 35.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-870M/3510vsm10421',t:'61. Nvidia GTX 870M - 35.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7790/3510vsm8622',t:'62. AMD HD 7790 - 35.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-480/3510vs3157',t:'63. Nvidia GTX 480 - 35.1%',p:'$500'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-M290X/3510vsm11722',t:'64. AMD R9 M290X - 35%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R7-260X/3510vs3151',t:'65. AMD R7 260X - 34.8%',p:'$120'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-965M-vs-Nvidia-GTX-950/m24481vs3510',t:'66. Nvidia GTX 965M - 34.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-560-Ti-448-Core-LE/3510vsm8215',t:'67. Nvidia GTX 560 Ti (448 Core LE) - 34.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-6970/3510vsm7712',t:'68. AMD HD 6970 - 33.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R7-360/3510vs3572',t:'69. AMD R7 360 - 33%',p:'$97'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-680M/3510vsm8687',t:'70. Nvidia GTX 680M - 32.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-590-SLI-Disabled/3510vsm8041',t:'71. Nvidia GeForce GTX 590 (SLI Disabled) - 32%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K5100M-vs-Nvidia-GTX-950/m11274vs3510',t:'72. Nvidia Quadro K5100M - 32%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-6990-Crossfire-Disabled/3510vsm7713',t:'73. AMD HD 6990 (Crossfire Disabled) - 31.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-650-Ti-Boost/3510vs2190',t:'74. Nvidia GTX 650 Ti Boost - 31.1%',p:'$140'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-6950/3510vs3152',t:'75. AMD HD 6950 - 30.3%',p:'$290'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-560-Ti/3510vs2180',t:'76. Nvidia GTX 560 Ti - 29.5%',p:'$188'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8950/3510vsm8897',t:'77. AMD Radeon HD 8950 - 28.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-560-Ti-OEM/3510vsm9203',t:'78. Nvidia GTX 560 Ti-OEM - 28.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-FirePro-M6100-FireGL-V/3510vsm10287',t:'79. AMD FirePro M6100 (FireGL V) - 28.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-470/3510vsm7820',t:'80. Nvidia GeForce GTX 470 - 28.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-750-Ti/3510vs2187',t:'81. Nvidia GTX 750 Ti - 27.8%',p:'$110'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-770M/3510vsm7724',t:'82. Nvidia GTX 770M - 26.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K2200-vs-Nvidia-GTX-950/2839vs3510',t:'83. Nvidia Quadro K2200 - 26%',p:'$440'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-960M-vs-Nvidia-GTX-950/m27242vs3510',t:'84. Nvidia GTX 960M - 25.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-650-Ti/3510vs2189',t:'85. Nvidia GTX 650 Ti - 25.5%',p:'$152'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-560/3510vs3155',t:'86. Nvidia GTX 560 - 25.2%',p:'$180'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-5870/3510vsm7681',t:'87. AMD HD 5870 - 25%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-860M/3510vsm8647',t:'88. Nvidia GTX 860M - 24.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K5000M-vs-Nvidia-GTX-950/m11324vs3510',t:'89. Nvidia Quadro K5000M - 24.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-FirePro-V7900-FireGL-V/3510vsm9001',t:'90. AMD FirePro V7900 (FireGL V) - 23.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-750/3510vs3162',t:'91. Nvidia GTX 750 - 23.7%',p:'$120'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7770/3510vsm7710',t:'92. AMD HD 7770 - 23.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-460-v2/3510vsm9101',t:'93. Nvidia GTX 460 v2 - 22.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K4000-vs-Nvidia-GTX-950/m7730vs3510',t:'94. Nvidia Quadro K4000 - 22.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-465/3510vsm8000',t:'95. Nvidia GTX 465 - 22.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R7-250X/3510vsm8719',t:'96. AMD R7 250X - 22.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8760/3510vsm12506',t:'97. AMD Radeon HD 8760 - 22.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-675MX/3510vsm10174',t:'98. Nvidia GTX 675MX - 22.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-6870/3510vsm7744',t:'99. AMD HD 6870 - 22%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-5970-Crossfire-Disabled/3510vsm7906',t:'100. AMD HD 5970 (Crossfire Disabled) - 21.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-460/3510vs2167',t:'101. Nvidia GTX 460 - 21.6%',p:'$203'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-5850/3510vsm7680',t:'102. AMD HD 5850 - 20.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-765M/3510vsm7742',t:'103. Nvidia GTX 765M - 20.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K1200-vs-Nvidia-GTX-950/m28490vs3510',t:'104. Nvidia Quadro K1200 - 20.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-560-SE/3510vsm10488',t:'105. Nvidia GeForce GTX 560 SE - 20.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-850M/3510vsm9138',t:'106. Nvidia GTX 850M - 20.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-555/3510vsm10555',t:'107. Nvidia GeForce GTX 555 - 20.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-5000-vs-Nvidia-GTX-950/m9708vs3510',t:'108. Nvidia Quadro 5000 - 20.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-675M/3510vsm8829',t:'109. Nvidia GTX 675M - 20%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-Iris-Pro-HD-6200-Desktop/3510vsm30277',t:'110. Intel Iris Pro HD 6200 (Desktop) - 19.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K3100M-vs-Nvidia-GTX-950/m8639vs3510',t:'111. Nvidia Quadro K3100M - 19.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K4000M-vs-Nvidia-GTX-950/m8941vs3510',t:'112. Nvidia Quadro K4000M - 19.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-670MX/3510vsm7874',t:'113. Nvidia GTX 670MX - 19.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-485M/3510vsm10025',t:'114. Nvidia GeForce GTX 485M - 19%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-580M/3510vsm7757',t:'115. Nvidia GeForce GTX 580M - 18.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-460-SE/3510vsm7703',t:'116. Nvidia GTX 460 SE - 18.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-670M/3510vsm7956',t:'117. Nvidia GTX 670M - 18.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-5830/3510vsm8247',t:'118. AMD HD 5830 - 17.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-6850/3510vsm7743',t:'119. AMD HD 6850 - 17.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-760M/3510vsm9587',t:'120. Nvidia GTX 760M - 17.5%'},{id:'http://gpu.userbenchmark.com/Compare/Vmware-SVGA-3D-vs-Nvidia-GTX-950/m7772vs3510',t:'121. Vmware SVGA 3D - 16.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7800M/3510vsm10077',t:'122. AMD Radeon HD 7800M - 16.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-645/3510vsm8982',t:'123. Nvidia GeForce GTX 645 - 16.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-FirePro-M5100-FireGL-V/3510vsm12267',t:'124. AMD FirePro M5100 (FireGL V) - 16.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-480M/3510vsm20276',t:'125. Nvidia GeForce GTX 480M - 16.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-550-Ti/3510vs3161',t:'126. Nvidia GTX 550-Ti - 16.1%',p:'$250'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-6790/3510vsm8056',t:'127. AMD HD 6790 - 16%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-570M/3510vsm10161',t:'128. Nvidia GeForce GTX 570M - 15.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-FirePro-M6000/3510vsm7770',t:'129. AMD FirePro M6000 - 15.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K620-vs-Nvidia-GTX-950/2840vs3510',t:'130. Nvidia Quadro K620 - 15.7%',p:'$170'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R7-250E/3510vsm8884',t:'131. AMD R7 250E - 15.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-HD-4890/3510vsm7789',t:'132. ATI HD 4890 - 15.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-6970M/3510vsm8552',t:'133. AMD HD 6970M - 15.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R7-250/3510vsm8217',t:'134. AMD R7 250 - 15.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7750/3510vsm7709',t:'135. AMD HD 7750 - 15.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Asus-EAH6770/3510vsm7880',t:'136. Asus EAH6770 - 15.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R9-M370X/3510vsm30774',t:'137. AMD R9 M370X - 15.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-650/3510vs3154',t:'138. Nvidia GTX 650 - 15.2%',p:'$112'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-5770/3510vsm7752',t:'139. AMD HD 5770 - 15.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6770/3510vsm7704',t:'140. AMD Radeon HD 6770 - 14.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-745-OEM/3510vs2638',t:'141. Nvidia GTX 745 (OEM) - 14.5%',p:'$60'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-755M/3510vsm7727',t:'142. Nvidia GeForce GT 755M - 14.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-4000-vs-Nvidia-GTX-950/m7693vs3510',t:'143. Nvidia Quadro 4000 - 14%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-FirePro-M8900/3510vsm9032',t:'144. AMD FirePro M8900 - 13.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-4000M-vs-Nvidia-GTX-950/m11532vs3510',t:'145. Nvidia Quadro 4000M - 13.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K3000M-vs-Nvidia-GTX-950/m8326vs3510',t:'146. Nvidia Quadro K3000M - 13.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K2000-vs-Nvidia-GTX-950/m8356vs3510',t:'147. Nvidia Quadro K2000 - 13.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-750M/3510vsm7928',t:'148. Nvidia GeForce GT 750M - 13.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTS-450/3510vsm7762',t:'149. Nvidia GeForce GTS 450 - 13.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-Iris-Pro-HD-5200-V1-Mobile-115-GHz/3510vsm8009',t:'150. Intel Iris Pro HD 5200 (V1 Mobile 1.15 GHz) - 13.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-660M/3510vsm7749',t:'151. Nvidia GTX 660M - 13.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-560M/3510vsm7964',t:'152. Nvidia GeForce GTX 560M - 13.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-Iris-Pro-HD-6100-Mobile/3510vsm25925',t:'153. Intel Iris Pro HD 6100 (Mobile) - 12.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-HD-4870/3510vsm7788',t:'154. ATI HD 4870 - 12.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-FirePro-V5800-FireGL-V/3510vsm12336',t:'155. ATI FirePro V5800 (FireGL V) - 12.7%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K2100M-vs-Nvidia-GTX-950/m7811vs3510',t:'156. Nvidia Quadro K2100M - 12.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7700M/3510vsm11261',t:'157. AMD Radeon HD 7700M - 12.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-Iris-Pro-HD-5200-V2-Mobile-12-GHz/3510vsm8190',t:'158. Intel Iris Pro HD 5200 (V2 Mobile 1.2 GHz) - 12.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-FirePro-V5900-FireGL-V/3510vsm10203',t:'159. AMD FirePro V5900 (FireGL V) - 12.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-R7-Graphics/3510vsm8791',t:'160. AMD Radeon R7 Graphics - 12.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7730/3510vsm8038',t:'161. AMD HD 7730 - 12.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Mobility-Radeon-HD-5870/3510vsm8764',t:'162. AMD Mobility Radeon HD 5870 - 12.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-5750/3510vsm7753',t:'163. AMD HD 5750 - 12.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6700/3510vsm9272',t:'164. AMD Radeon HD 6700 - 12%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-745M/3510vsm8211',t:'165. Nvidia GeForce GT 745M - 11.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4770/3510vsm8796',t:'166. ATI Radeon HD 4770 - 11.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-840M/3510vsm8643',t:'167. Nvidia GeForce 840M - 11.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4850/3510vsm7790',t:'168. ATI Radeon HD 4850 - 11.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-285/3510vsm7733',t:'169. Nvidia GeForce GTX 285 - 11.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-640/3510vsm7731',t:'170. Nvidia GeForce GT 640 - 11.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-460M/3510vsm8234',t:'171. Nvidia GeForce GTX 460M - 11.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-650M/3510vsm7754',t:'172. Nvidia GeForce GT 650M - 11.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8570/3510vsm9843',t:'173. AMD Radeon HD 8570 - 11.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-6000-Mobile/3510vsm24946',t:'174. Intel HD 6000 (Mobile) - 11.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-2000-vs-Nvidia-GTX-950/m7708vs3510',t:'175. Nvidia Quadro 2000 - 11.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8650G/3510vsm7910',t:'176. AMD Radeon HD 8650G - 11.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4850-X2/3510vsm11246',t:'177. ATI Radeon HD 4850-X2 - 11.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-275/3510vs3261',t:'178. Nvidia GTX 275 - 11%',p:'$250'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-530-Desktop-Skylake/3510vsm33102',t:'179. Intel HD 530 (Desktop Skylake) - 10.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-545/3510vsm9908',t:'180. Nvidia GeForce GT 545 - 10.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4800/3510vsm8124',t:'181. ATI Radeon HD 4800 - 10.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-3000M-vs-Nvidia-GTX-950/m8172vs3510',t:'182. Nvidia Quadro 3000M - 10.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-280/3510vsm8413',t:'183. Nvidia GeForce GTX 280 - 10.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-R7-240/3510vsm8608',t:'184. AMD R7 240 - 10.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-295-SLI-Disabled/3510vsm7987',t:'185. Nvidia GeForce GTX 295 (SLI Disabled) - 10.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-740M/3510vsm7671',t:'186. Nvidia GeForce GT 740M - 9.88%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-5800-vs-Nvidia-GTX-950/m10447vs3510',t:'187. Nvidia Quadro FX 5800 - 9.69%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K2000M-vs-Nvidia-GTX-950/m8574vs3510',t:'188. Nvidia Quadro K2000M - 9.59%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K1100M-vs-Nvidia-GTX-950/m10244vs3510',t:'189. Nvidia Quadro K1100M - 9.55%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Mobility-Radeon-HD-5850/3510vsm8789',t:'190. AMD Mobility Radeon HD 5850 - 9.5%'},{id:'http://gpu.userbenchmark.com/Compare/Parallels-Display-Adapter-WDDM-vs-Nvidia-GTX-950/m7878vs3510',t:'191. Parallels Display Adapter (WDDM) - 9.48%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-635/3510vsm8246',t:'192. Nvidia GeForce GT 635 - 9.43%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GTX-260/3510vs3160',t:'193. Nvidia GTX 260 - 9.39%',p:'$250'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7670/3510vsm8206',t:'194. AMD Radeon HD 7670 - 9.32%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-FirePro-M7740/3510vsm8759',t:'195. ATI FirePro M7740 - 9.31%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon--HD-6770M/3510vsm7746',t:'196. AMD Radeon  HD 6770M - 9.28%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-830M/3510vsm25102',t:'197. Nvidia GeForce 830M - 9.19%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6670/3510vsm7738',t:'198. AMD Radeon HD 6670 - 9.08%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-640M/3510vsm8030',t:'199. Nvidia GeForce GT 640M - 8.88%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9800-GTX/3510vsm8342',t:'200. Nvidia GeForce 9800 GTX - 8.76%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-Iris-Pro-HD-5100-Mobile-11-GHz/3510vsm8813',t:'201. Intel Iris Pro HD 5100 (Mobile 1.1 GHz) - 8.76%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-FirePro-V4800-FireGL-V/3510vsm9332',t:'202. ATI FirePro V4800 (FireGL V) - 8.75%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-5670/3510vsm8110',t:'203. AMD Radeon HD 5670 - 8.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-445M/3510vsm17578',t:'204. Nvidia GeForce GT 445M - 8.59%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-2000M-vs-Nvidia-GTX-950/m7776vs3510',t:'205. Nvidia Quadro 2000M - 8.52%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6700M/3510vsm7769',t:'206. AMD Radeon HD 6700M - 8.51%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8670D/3510vsm8025',t:'207. AMD Radeon HD 8670D - 8.49%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTS-250/3510vsm7741',t:'208. Nvidia GeForce GTS 250 - 8.41%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7660D/3510vsm7929',t:'209. AMD Radeon HD 7660D - 8.32%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-Graphics-P4600/3510vsm18483',t:'210. Intel HD Graphics P4600 - 8.32%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-3800-vs-Nvidia-GTX-950/m7804vs3510',t:'211. Nvidia Quadro FX 3800 - 8.29%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-4600-Desktop-125-GHz/3510vs2168',t:'212. Intel HD 4600 (Desktop 1.25 GHz) - 8.24%',p:'$15'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-730/3510vsm12582',t:'213. Nvidia GeForce GT 730 - 8.23%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-555M/3510vsm8224',t:'214. Nvidia GeForce GT 555M - 8.16%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8800-GTS-512/3510vsm8016',t:'215. Nvidia GeForce 8800 GTS-512 - 8.09%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7570/3510vsm9639',t:'216. AMD Radeon HD 7570 - 7.98%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7660G/3510vsm8022',t:'217. AMD Radeon HD 7660G - 7.93%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6730M/3510vsm9168',t:'218. AMD Radeon HD 6730M - 7.88%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-5500-Mobile-095-GHz/3510vsm16570',t:'219. Intel HD 5500 (Mobile 0.95 GHz) - 7.85%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTS-240/3510vsm8940',t:'220. Nvidia GeForce GTS 240 - 7.84%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6750M/3510vsm7834',t:'221. AMD Radeon HD 6750M - 7.79%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-3870/3510vsm7879',t:'222. ATI Radeon HD 3870 - 7.62%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-285M/3510vsm10715',t:'223. Nvidia GeForce GTX 285M - 7.54%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-5000-Mobile-1011-GHz/3510vsm8536',t:'224. Intel HD 5000 (Mobile 1.0/1.1 GHz) - 7.49%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8800-GT/3510vsm7722',t:'225. Nvidia GeForce 8800 GT - 7.33%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-280M/3510vsm13363',t:'226. Nvidia GeForce GTX 280M - 7.31%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-4600-Mobile-115-GHz/3510vsm7676',t:'227. Intel HD 4600 (Mobile 1.15 GHz) - 7.29%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6570/3510vsm8207',t:'228. AMD Radeon HD 6570 - 7.26%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-3800M-vs-Nvidia-GTX-950/m9394vs3510',t:'229. Nvidia Quadro FX 3800M - 7.09%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-3800/3510vsm8529',t:'230. ATI Radeon HD 3800 - 6.91%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8800-GTX/3510vsm9271',t:'231. Nvidia GeForce 8800 GTX - 6.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7670M/3510vsm7810',t:'232. AMD Radeon HD 7670M - 6.73%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9800-GT/3510vsm7716',t:'233. Nvidia GeForce 9800 GT - 6.71%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-440/3510vsm7783',t:'234. Nvidia GeForce GT 440 - 6.65%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-5570/3510vsm7686',t:'235. AMD Radeon HD 5570 - 6.59%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7600M/3510vsm9552',t:'236. AMD Radeon HD 7600M - 6.53%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-820M/3510vsm9527',t:'237. Nvidia GeForce 820M - 6.48%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8570D/3510vsm9112',t:'238. AMD Radeon HD 8570D - 6.42%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6630M/3510vsm9654',t:'239. AMD Radeon HD 6630M - 6.41%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Mobility-Radeon-HD-5730/3510vsm9994',t:'240. AMD Mobility Radeon HD 5730 - 6.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-3700M-vs-Nvidia-GTX-950/m10184vs3510',t:'241. Nvidia Quadro FX 3700M - 6.39%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8800-GS/3510vsm7976',t:'242. Nvidia GeForce 8800 GS - 6.36%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8610G/3510vsm8531',t:'244. AMD Radeon HD 8610G - 6.35%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K600-vs-Nvidia-GTX-950/m8080vs3510',t:'244. Nvidia Quadro K600 - 6.35%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-NVS-5400M-vs-Nvidia-GTX-950/m7907vs3510',t:'245. Nvidia NVS 5400M - 6.34%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-630/3510vsm7766',t:'246. Nvidia GeForce GT 630 - 6.22%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7560D/3510vsm8826',t:'247. AMD Radeon HD 7560D - 6.18%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9600-GT/3510vsm7677',t:'248. Nvidia GeForce 9600 GT - 6.15%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-2800M-vs-Nvidia-GTX-950/m8137vs3510',t:'249. Nvidia Quadro FX 2800M - 6.12%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-710M/3510vsm10751',t:'250. Nvidia GeForce 710M - 6.09%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-K1000M-vs-Nvidia-GTX-950/m7800vs3510',t:'251. Nvidia Quadro K1000M - 6.05%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8550G/3510vsm7799',t:'252. AMD Radeon HD 8550G - 6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7650M/3510vsm10887',t:'253. AMD Radeon HD 7650M - 5.98%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6550D/3510vsm9223',t:'254. AMD Radeon HD 6550D - 5.97%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-3700-vs-Nvidia-GTX-950/m10901vs3510',t:'255. Nvidia Quadro FX 3700 - 5.92%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-3870-X2-Crossfire-Disabled/3510vsm10185',t:'256. ATI Mobility Radeon HD 3870-X2 (Crossfire Disabled) - 5.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-4400-Desktop-115-GHz/3510vsm8064',t:'257. Intel HD 4400 (Desktop 1.15 GHz) - 5.89%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-4400-Mobile-1011-GHz/3510vsm7668',t:'258. Intel HD 4400 (Mobile 1.0/1.1 GHz) - 5.87%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT620M/3510vsm13398',t:'259. Nvidia GeForce GT620M - 5.86%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-550M/3510vsm8663',t:'260. Nvidia GeForce GT 550M - 5.81%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTS-360M/3510vsm9128',t:'261. Nvidia GeForce GTS 360M - 5.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-530/3510vsm8407',t:'262. Nvidia GeForce GT 530 - 5.79%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-635M/3510vsm8120',t:'263. Nvidia GeForce GT 635M - 5.71%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTX-260M/3510vsm7979',t:'264. Nvidia GeForce GTX 260M - 5.68%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-P4000-Server-125-GHz/3510vsm8592',t:'265. Intel HD P4000 (Server 1.25 GHz) - 5.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-NVS-5200M-vs-Nvidia-GTX-950/m7691vs3510',t:'266. Nvidia NVS 5200M - 5.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-NVS-510-vs-Nvidia-GTX-950/m10074vs3510',t:'267. Nvidia NVS 510 - 5.66%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8800-GTS/3510vsm7808',t:'268. Nvidia GeForce 8800 GTS - 5.64%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-4670/3510vsm7888',t:'269. ATI Mobility Radeon HD 4670 - 5.63%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-240/3510vsm7947',t:'270. Nvidia GeForce GT 240 - 5.61%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7500M/3510vsm8602',t:'271. AMD Radeon HD 7500M - 5.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-630M/3510vsm7814',t:'272. Nvidia GeForce GT 630M - 5.59%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-600-vs-Nvidia-GTX-950/m8084vs3510',t:'273. Nvidia Quadro 600 - 5.57%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-430/3510vsm7745',t:'274. Nvidia GeForce GT 430 - 5.54%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7640G/3510vsm7903',t:'275. AMD Radeon HD 7640G - 5.51%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-4000-Desktop-115-GHz/3510vs2169',t:'276. Intel HD 4000 (Desktop 1.15 GHz) - 5.5%',p:'$15'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-4600-vs-Nvidia-GTX-950/m8232vs3510',t:'277. Nvidia Quadro FX 4600 - 5.45%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4670/3510vsm8077',t:'278. ATI Radeon HD 4670 - 5.45%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-720M/3510vsm7921',t:'279. Nvidia GeForce GT 720M - 5.45%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-Core-M-HD-5300/3510vsm16575',t:'280. Intel Core M HD 5300 - 5.44%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-1000M-vs-Nvidia-GTX-950/m7836vs3510',t:'281. Nvidia Quadro 1000M - 5.41%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9800M-GTS/3510vsm12939',t:'282. Nvidia GeForce 9800M GTS - 5.41%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6500M/3510vsm7936',t:'283. AMD Radeon HD 6500M - 5.36%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-435M/3510vsm8260',t:'284. Nvidia GeForce GT 435M - 5.32%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-1800-vs-Nvidia-GTX-950/m7957vs3510',t:'285. Nvidia Quadro FX 1800 - 5.3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-540M/3510vsm8006',t:'286. Nvidia GeForce GT 540M - 5.22%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8510G/3510vsm9309',t:'287. AMD Radeon HD 8510G - 5.18%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-5500/3510vsm8853',t:'288. AMD Radeon HD 5500 - 5.08%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-230/3510vsm8245',t:'289. Nvidia GeForce GT 230 - 5.03%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT625M/3510vsm25295',t:'290. Nvidia GeForce GT625M - 5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9800M-GS/3510vsm9719',t:'291. Nvidia GeForce 9800M-GS - 4.99%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7610M/3510vsm11031',t:'292. AMD Radeon HD 7610M - 4.93%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-4000-Mobile-125-GHz/3510vsm7653',t:'293. Intel HD 4000 (Mobile 1.25 GHz) - 4.84%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-320/3510vsm11866',t:'294. Nvidia GeForce GT 320 - 4.76%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7600G/3510vsm12867',t:'295. AMD Radeon HD 7600G - 4.71%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-425M/3510vsm7792',t:'296. Nvidia GeForce GT 425M - 4.68%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-335M/3510vsm10735',t:'297. Nvidia GeForce GT 335M - 4.68%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8470D/3510vsm9693',t:'298. AMD Radeon HD 8470D - 4.65%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-2700M-vs-Nvidia-GTX-950/m7747vs3510',t:'299. Nvidia Quadro FX 2700M - 4.63%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6620G/3510vsm8118',t:'300. AMD Radeon HD 6620G - 4.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GTS-250M/3510vsm8494',t:'301. Nvidia GeForce GTS 250M - 4.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7540D/3510vsm7756',t:'302. AMD Radeon HD 7540D - 4.59%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-4650/3510vsm7667',t:'303. ATI Mobility Radeon HD 4650 - 4.58%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4650/3510vsm7844',t:'304. ATI Radeon HD 4650 - 4.43%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-525M/3510vsm8869',t:'305. Nvidia GeForce GT 525M - 4.4%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-1800M-vs-Nvidia-GTX-950/m7771vs3510',t:'306. Nvidia Quadro FX 1800M - 4.31%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-3600M-vs-Nvidia-GTX-950/m9773vs3510',t:'307. Nvidia Quadro FX 3600M - 4.27%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-R5/3510vsm12264',t:'308. AMD Radeon R5 - 4.24%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-4200-Mobile-085-GHz/3510vsm8662',t:'309. Intel HD 4200 (Mobile 0.85 GHz) - 4.22%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-420M/3510vsm8926',t:'310. Nvidia GeForce GT 420M - 4.15%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6530D/3510vsm7795',t:'311. AMD Radeon HD 6530D - 4.14%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-880M-vs-Nvidia-GTX-950/m7780vs3510',t:'312. Nvidia Quadro FX 880M - 3.98%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-330M/3510vsm7739',t:'313. Nvidia GeForce GT 330M - 3.98%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-Graphics-G4-PentiumCeleron-105115-GHz/3510vsm7701',t:'314. Intel HD Graphics (G4 Pentium/Celeron 1.05/1.15 GHz) - 3.9%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-620/3510vsm8899',t:'315. Nvidia GeForce GT 620 - 3.87%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7520G/3510vsm8569',t:'316. AMD Radeon HD 7520G - 3.87%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-NVS-5100M-vs-Nvidia-GTX-950/m8318vs3510',t:'317. Nvidia NVS 5100M - 3.85%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-220/3510vsm7737',t:'318. Nvidia GeForce GT 220 - 3.83%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-130/3510vsm12240',t:'319. Nvidia GeForce GT 130 - 3.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6520G/3510vsm7806',t:'320. AMD Radeon HD 6520G - 3.79%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-240M/3510vsm8596',t:'321. Nvidia GeForce GT 240M - 3.74%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8600-GTS/3510vsm8311',t:'322. Nvidia GeForce 8600 GTS - 3.72%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-NVS-4200M-vs-Nvidia-GTX-950/m7966vs3510',t:'323. Nvidia NVS 4200M - 3.71%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9700M-GT/3510vsm12102',t:'324. Nvidia GeForce 9700M GT - 3.69%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7500G/3510vsm9442',t:'325. AMD Radeon HD 7500G - 3.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-R3-Graphics/3510vsm12440',t:'326. AMD Radeon R3 Graphics - 3.61%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-610M/3510vsm8250',t:'327. Nvidia GeForce 610M - 3.58%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8370D/3510vsm10640',t:'328. AMD Radeon HD 8370D - 3.52%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-230M/3510vsm8017',t:'329. Nvidia GeForce GT 230M - 3.5%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-520MX/3510vsm8048',t:'330. Nvidia GeForce GT 520MX - 3.43%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-3000-Desktop-V2-135-GHz/3510vs2170',t:'331. Intel HD 3000 (Desktop V2 1.35 GHz) - 3.41%',p:'$15'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-770M-vs-Nvidia-GTX-950/m7999vs3510',t:'332. Nvidia Quadro FX 770M - 3.38%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-130M/3510vsm9306',t:'333. Nvidia GeForce GT 130M - 3.35%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7480D/3510vsm7856',t:'334. AMD Radeon HD 7480D - 3.32%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8400-R3/3510vsm11160',t:'335. AMD Radeon HD 8400-R3 - 3.29%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-2600-XT/3510vsm7897',t:'336. ATI Radeon HD 2600-XT - 3.29%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-705/3510vsm13024',t:'337. Nvidia GeForce GT 705 - 3.26%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-580-vs-Nvidia-GTX-950/m7761vs3510',t:'338. Nvidia Quadro FX 580 - 3.21%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9500-GS/3510vsm11103',t:'339. Nvidia GeForce 9500 GS - 3.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6480G/3510vsm8221',t:'340. AMD Radeon HD 6480G - 3.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-520M/3510vsm8308',t:'341. Nvidia GeForce GT 520M - 3.08%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-420/3510vsm10183',t:'342. Nvidia GeForce GT 420 - 3.06%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-7470/3510vsm8681',t:'343. AMD HD 7470 - 3.06%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-520/3510vsm7768',t:'344. Nvidia GeForce GT 520 - 3.05%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-2600/3510vsm11511',t:'346. ATI Radeon HD 2600 - 3.04%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8600-GT/3510vsm7659',t:'346. Nvidia GeForce 8600 GT - 3.04%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9600M-GT/3510vsm7707',t:'347. Nvidia GeForce 9600M-GT - 3.04%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon--HD-6490M/3510vsm7775',t:'348. AMD Radeon  HD 6490M - 3.03%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9500-GT/3510vsm7816',t:'349. Nvidia GeForce 9500 GT - 3%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-220M/3510vsm11828',t:'350. Nvidia GeForce GT 220M - 2.96%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-8330/3510vsm8155',t:'351. AMD Radeon HD 8330 - 2.96%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-3000-Mobile-V2-13-GHz/3510vsm7647',t:'352. Intel HD 3000 (Mobile V2 1.3 GHz) - 2.95%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-3000-Desktop-V1-11-GHz/3510vsm7649',t:'353. Intel HD 3000 (Desktop V1 1.1 GHz) - 2.91%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7470M/3510vsm9296',t:'354. AMD Radeon HD 7470M - 2.91%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-1600M-vs-Nvidia-GTX-950/m8782vs3510',t:'355. Nvidia Quadro FX 1600M - 2.88%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-610/3510vsm7736',t:'356. Nvidia GeForce GT 610 - 2.85%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9650M-GT/3510vsm9295',t:'357. Nvidia GeForce 9650M-GT - 2.81%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-3670/3510vsm10736',t:'358. ATI Mobility Radeon HD 3670 - 2.8%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-3000-Mobile-V1-1112-GHz/3510vsm7646',t:'359. Intel HD 3000 (Mobile V1 1.1/1.2 GHz) - 2.77%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6410D/3510vsm8199',t:'360. AMD Radeon HD 6410D - 2.74%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7400M/3510vsm7817',t:'361. AMD Radeon HD 7400M - 2.69%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-NVS-320M-vs-Nvidia-GTX-950/m8310vs3510',t:'362. Nvidia Quadro NVS 320M - 2.68%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-2600-XT/3510vsm9915',t:'363. ATI Mobility Radeon HD 2600-XT - 2.68%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6470M/3510vsm7679',t:'364. AMD Radeon HD 6470M - 2.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9600M-GS/3510vsm9821',t:'365. Nvidia GeForce 9600M-GS - 2.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-2500-Desktop-105-GHz/3510vsm7696',t:'366. Intel HD 2500 (Desktop 1.05 GHz) - 2.65%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-HD-3650/3510vsm7982',t:'367. ATI HD 3650 - 2.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-320M/3510vsm9153',t:'368. Nvidia GeForce 320M - 2.6%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-400-vs-Nvidia-GTX-950/m9363vs3510',t:'369. Nvidia Quadro 400 - 2.58%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7400G/3510vsm10815',t:'370. AMD Radeon HD 7400G - 2.56%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7450/3510vsm8053',t:'371. AMD Radeon HD 7450 - 2.53%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-570M-vs-Nvidia-GTX-950/m9414vs3510',t:'372. Nvidia Quadro FX 570M - 2.51%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-FireGL-V5700/3510vsm10460',t:'373. ATI Mobility FireGL V5700 - 2.51%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6450/3510vsm7821',t:'374. AMD Radeon HD 6450 - 2.45%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-Graphics-G3-PentiumCeleron-1011-GHz/3510vsm7695',t:'375. Intel HD Graphics (G3 Pentium/Celeron 1.0/1.1 GHz) - 2.43%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-320M/3510vsm7796',t:'376. Nvidia GeForce GT 320M - 2.42%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-8240/3510vsm9779',t:'377. AMD HD 8240 - 2.39%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-3100-Graphics/3510vsm9910',t:'378. ATI Radeon 3100 Graphics - 2.37%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-410M/3510vsm9169',t:'379. Nvidia GeForce 410M - 2.36%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-3650/3510vsm7902',t:'380. ATI Mobility Radeon HD 3650 - 2.26%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-310M/3510vsm8049',t:'381. Nvidia GeForce 310M - 2.23%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-1700-vs-Nvidia-GTX-950/m9158vs3510',t:'382. Nvidia Quadro FX 1700 - 2.23%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-2600-PRO/3510vsm8524',t:'383. ATI Radeon HD 2600-PRO - 2.21%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8600M-GT/3510vsm8081',t:'384. Nvidia GeForce 8600M GT - 2.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6370M/3510vsm10005',t:'385. AMD Radeon HD 6370M - 2.19%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-6370/3510vsm11239',t:'386. ATI Mobility Radeon HD 6370 - 2.16%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-NVS-310-vs-Nvidia-GTX-950/m10691vs3510',t:'387. Nvidia NVS 310 - 2.15%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-380-vs-Nvidia-GTX-950/m8914vs3510',t:'388. Nvidia Quadro FX 380 - 2.13%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-5470/3510vsm7794',t:'389. ATI Mobility Radeon HD 5470 - 2.12%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6300M/3510vsm9894',t:'390. AMD Radeon HD 6300M - 2.08%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9400-GT/3510vsm7963',t:'391. Nvidia GeForce 9400 GT - 2.07%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-HD-8210/3510vsm7831',t:'392. AMD HD 8210 - 2.06%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-NVS-3100M-vs-Nvidia-GTX-950/m7837vs3510',t:'393. Nvidia NVS 3100M - 2.06%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-4570/3510vsm7827',t:'394. ATI Mobility Radeon HD 4570 - 2.05%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6350/3510vsm10261',t:'395. AMD Radeon HD 6350 - 2.04%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-315M/3510vsm10068',t:'396. Nvidia GeForce 315M - 2.04%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7350/3510vsm12157',t:'397. AMD Radeon HD 7350 - 2.03%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-GT-415M/3510vsm16834',t:'398. Nvidia GeForce GT 415M - 1.97%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-545v/3510vsm8734',t:'399. ATI Mobility Radeon HD 545v - 1.95%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-5450/3510vsm7719',t:'400. AMD Radeon HD 5450 - 1.94%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-2600/3510vsm10285',t:'401. ATI Mobility Radeon HD 2600 - 1.94%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-310/3510vsm9197',t:'402. Nvidia GeForce 310 - 1.93%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4550/3510vsm8944',t:'403. ATI Radeon HD 4550 - 1.86%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-5400/3510vsm8063',t:'404. ATI Radeon HD 5400 - 1.83%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-NVS-300-vs-Nvidia-GTX-950/m8966vs3510',t:'405. Nvidia NVS 300 - 1.83%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-4500/3510vsm7949',t:'406. ATI Mobility Radeon HD 4500 - 1.82%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-G210M/3510vsm8875',t:'407. Nvidia GeForce G210M - 1.81%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-FirePro-2270/3510vsm7813',t:'408. AMD FirePro 2270 - 1.78%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-210/3510vsm7740',t:'409. Nvidia GeForce 210 - 1.77%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-305M/3510vsm10705',t:'410. Nvidia GeForce 305M - 1.74%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4300/3510vsm7860',t:'411. ATI Radeon HD 4300 - 1.74%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8600M-GS/3510vsm8192',t:'412. Nvidia GeForce 8600M GS - 1.71%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-2000-Desktop-11-GHz/3510vsm7697',t:'413. Intel HD 2000 (Desktop 1.1 GHz) - 1.69%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8500-GT/3510vsm7777',t:'414. Nvidia GeForce 8500 GT - 1.68%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7340/3510vsm8996',t:'415. AMD Radeon HD 7340 - 1.64%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6320/3510vsm8103',t:'416. AMD Radeon HD 6320 - 1.64%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-G210/3510vsm11784',t:'417. Nvidia GeForce G210 - 1.63%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8400M-GT/3510vsm10523',t:'418. Nvidia GeForce 8400M GT - 1.55%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-570-vs-Nvidia-GTX-950/m8189vs3510',t:'419. Nvidia Quadro FX 570 - 1.53%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-Graphics-G2-PentiumCeleron-11115-GHz/3510vsm7699',t:'420. Intel HD Graphics (G2 Pentium/Celeron 1.1/1.15 GHz) - 1.52%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-530v/3510vsm10176',t:'421. ATI Mobility Radeon HD 530v - 1.49%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-Graphics-Bay-Trail-0667---0854-GHz/3510vsm7698',t:'422. Intel HD Graphics (Bay Trail 0.667 - 0.854 GHz) - 1.45%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-4350/3510vsm9335',t:'423. ATI Mobility Radeon HD 4350 - 1.45%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-Graphics-Clarkdale-073309-GHz/3510vsm7702',t:'424. Intel HD Graphics (Clarkdale 0.733/0.9 GHz) - 1.42%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6310/3510vsm7807',t:'425. AMD Radeon HD 6310 - 1.38%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-4300/3510vsm8572',t:'426. ATI Mobility Radeon HD 4300 - 1.37%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-7310/3510vsm9174',t:'427. AMD Radeon HD 7310 - 1.36%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-G105M/3510vsm8400',t:'428. Nvidia GeForce G105M - 1.35%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9400M/3510vsm7998',t:'429. Nvidia GeForce 9400M - 1.31%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-HD-Graphics-Arrandale-06670766-GHz/3510vsm7694',t:'430. Intel HD Graphics (Arrandale 0.667/0.766 GHz) - 1.21%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-NVS-295-vs-Nvidia-GTX-950/m12626vs3510',t:'431. Nvidia Quadro NVS 295 - 1.18%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-NVS-140M-vs-Nvidia-GTX-950/m7946vs3510',t:'432. Nvidia Quadro NVS 140M - 1.15%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-ION-vs-Nvidia-GTX-950/m7884vs3510',t:'433. Nvidia ION - 1.14%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9300M-GS/3510vsm7759',t:'434. Nvidia GeForce 9300M GS - 1.12%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6290/3510vsm7803',t:'435. AMD Radeon HD 6290 - 1.12%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-NVS-160M-vs-Nvidia-GTX-950/m8249vs3510',t:'436. Nvidia Quadro NVS 160M - 1.11%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8400M-GS/3510vsm8560',t:'437. Nvidia GeForce 8400M GS - 1.11%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-NVS-450-vs-Nvidia-GTX-950/m7791vs3510',t:'438. Nvidia Quadro NVS 450 - 1.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8400-GS/3510vsm7917',t:'439. Nvidia GeForce 8400 GS - 1.08%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-3400/3510vsm8480',t:'440. ATI Mobility Radeon HD 3400 - 1.07%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4290/3510vsm7847',t:'441. ATI Radeon HD 4290 - 1.05%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-3300/3510vsm7899',t:'442. ATI Radeon HD 3300 - 1.04%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9200M-GS/3510vsm9090',t:'443. Nvidia GeForce 9200M GS - 1.01%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-NVS-290-vs-Nvidia-GTX-950/m8083vs3510',t:'444. Nvidia Quadro NVS 290 - 0.96%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6250/3510vsm8472',t:'445. AMD Radeon HD 6250 - 0.94%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4250/3510vsm7965',t:'446. ATI Radeon HD 4250 - 0.94%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-3450/3510vsm7779',t:'447. ATI Radeon HD 3450 - 0.93%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-HD-6250M/3510vsm13446',t:'448. AMD Radeon HD 6250M - 0.91%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-4200/3510vsm8091',t:'449. ATI Radeon HD 4200 - 0.84%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-FirePro-2260/3510vsm9852',t:'450. ATI FirePro 2260 - 0.84%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-9300-GS/3510vsm10867',t:'451. Nvidia GeForce 9300 GS - 0.84%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-2400/3510vsm8548',t:'452. ATI Mobility Radeon HD 2400 - 0.83%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-2400-PRO/3510vsm8931',t:'453. ATI Radeon HD 2400-PRO - 0.82%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-4-Series-Internal-Chipset/3510vsm9993',t:'454. Intel 4 Series Internal Chipset - 0.78%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-G45G43-Express-Chipset/3510vsm7728',t:'455. Intel G45/G43 Express Chipset - 0.77%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-Q45Q43-Express-Chipset/3510vsm8195',t:'456. Intel Q45/Q43 Express Chipset - 0.75%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-3000-Graphics/3510vsm7853',t:'457. ATI Radeon 3000 Graphics - 0.75%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8200/3510vsm11915',t:'458. Nvidia GeForce 8200 - 0.75%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-HD-4250/3510vsm8680',t:'459. ATI Mobility Radeon HD 4250 - 0.73%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-G41-Express-Chipset/3510vsm7732',t:'460. Intel G41 Express Chipset - 0.73%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-NVS-135M-vs-Nvidia-GTX-950/m7758vs3510',t:'461. Nvidia Quadro NVS 135M - 0.68%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Intel-Mobile-Series-4-Express-Chipset-Family/3510vsm7651',t:'462. Intel Mobile Series 4 Express Chipset Family - 0.68%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Radeon-HD-3200/3510vsm8532',t:'463. ATI Radeon HD 3200 - 0.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7300-SE/3510vsm8767',t:'464. Nvidia GeForce 7300 SE - 0.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8400M-G/3510vsm9009',t:'465. Nvidia GeForce 8400M G - 0.67%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-8200M-G/3510vsm7912',t:'466. Nvidia GeForce 8200M G - 0.59%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-6100/3510vsm9213',t:'467. Nvidia GeForce 6100 - 0.48%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7900-GTX/3510vsm10625',t:'468. Nvidia GeForce 7900 GTX - 0.44%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-X1650/3510vsm10866',t:'469. AMD Radeon X1650 - 0.29%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7900-GS/3510vsm8541',t:'470. Nvidia GeForce 7900 GS - 0.28%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7800-GTX/3510vsm12348',t:'472. Nvidia GeForce 7800 GTX - 0.28%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-3500-vs-Nvidia-GTX-950/m10152vs3510',t:'472. Nvidia Quadro FX 3500 - 0.28%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-4500-vs-Nvidia-GTX-950/m8032vs3510',t:'473. Nvidia Quadro FX 4500 - 0.27%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7800-GT/3510vsm8420',t:'474. Nvidia GeForce 7800 GT - 0.26%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-X1600/3510vsm9407',t:'475. AMD Radeon X1600 - 0.24%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7600-GT/3510vsm8028',t:'476. Nvidia GeForce 7600 GT - 0.23%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-Go-7900/3510vsm9175',t:'477. Nvidia GeForce Go 7900 - 0.23%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7800-GS/3510vsm11875',t:'478. Nvidia GeForce 7800 GS - 0.21%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-MOBILITY-FireGL-V5250/3510vsm8385',t:'479. ATI MOBILITY FireGL V5250 - 0.21%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-X1300/3510vsm9011',t:'480. AMD Radeon X1300 - 0.2%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-X1600/3510vsm8748',t:'481. ATI Mobility Radeon X1600 - 0.19%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-AMD-Radeon-X1550/3510vsm11538',t:'482. AMD Radeon X1550 - 0.18%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-X1300/3510vsm11505',t:'483. ATI Mobility Radeon X1300 - 0.17%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-X2300/3510vsm8306',t:'484. ATI Mobility Radeon X2300 - 0.16%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7600-GS/3510vsm11979',t:'485. Nvidia GeForce 7600 GS - 0.16%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-1500-vs-Nvidia-GTX-950/m11831vs3510',t:'486. Nvidia Quadro FX 1500 - 0.15%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-ATI-Mobility-Radeon-X1400/3510vsm7829',t:'487. ATI Mobility Radeon X1400 - 0.15%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-6800-GS/3510vsm10950',t:'488. Nvidia GeForce 6800 GS - 0.14%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-FX-34504000-SDI-vs-Nvidia-GTX-950/m13072vs3510',t:'489. Nvidia Quadro FX 3450/4000 SDI - 0.14%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-6600-GT/3510vsm8656',t:'490. Nvidia GeForce 6600 GT - 0.11%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-6800/3510vsm9825',t:'491. Nvidia GeForce 6800 - 0.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7300-GT/3510vsm8156',t:'492. Nvidia GeForce 7300 GT - 0.1%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-Quadro-NVS-440-vs-Nvidia-GTX-950/m10103vs3510',t:'493. Nvidia Quadro NVS 440 - 0.09%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-Go-7600/3510vsm7872',t:'494. Nvidia GeForce Go 7600 - 0.09%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7300-GS/3510vsm7782',t:'495. Nvidia GeForce 7300 GS - 0.09%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-6600/3510vsm8606',t:'496. Nvidia GeForce 6600 - 0.09%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7150M--nForce-630M/3510vsm10312',t:'497. Nvidia GeForce 7150M / nForce 630M - 0.08%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-Go-7400/3510vsm8618',t:'498. Nvidia GeForce Go 7400 - 0.08%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7300-LE/3510vsm7971',t:'499. Nvidia GeForce 7300 LE - 0.07%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7025--nForce-630a/3510vsm9258',t:'500. Nvidia GeForce 7025 / nForce 630a - 0.06%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-Go-7300/3510vsm7778',t:'502. Nvidia GeForce Go 7300 - 0.06%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-6150SE-nForce-430/3510vsm7763',t:'502. Nvidia GeForce 6150SE nForce 430 - 0.06%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-6150/3510vsm10968',t:'503. Nvidia GeForce 6150 - 0.06%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7100-GS/3510vsm11594',t:'504. Nvidia GeForce 7100 GS - 0.05%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-6200/3510vsm9463',t:'505. Nvidia GeForce 6200 - 0.05%'},{id:'http://gpu.userbenchmark.com/Compare/Nvidia-GTX-950-vs-Nvidia-GeForce-7100--nForce-630i/3510vsm8642',t:'506. Nvidia GeForce 7100 / nForce 630i - 0.05%'}], text: 't' },
				dropdownCss: {'min-width':'450px'}
			})
		).on("select2-selecting", function(e) {
			MHAjaxStart();
			var lhsid = '3510';
			var urlpayload = e.val.toString(); 
			if (urlpayload.substring(0, 3) == "cid") 
				location = '/Compare/PeRmReDiRPRPage/'+lhsid+'vs'+urlpayload.substring(3);
			else
				location = e.val.toString();
			e.preventDefault();//prevent flicker
		}).on("select2-opening", function() {
			guiLogMessage('PCOMP_COMBO_OPEN');
		});
		
		
	</script>
<script>
	   var data = {
	        labels: ["Dec 15","Jan 16","Feb 16","Mar 16","Apr 16","May 16"],
	        datasets: [
	            {
	                label: "GTX 950",
	                fillColor: "rgba(255,165,0,0.2)",
	                strokeColor: "rgba(255,165,0,0.9)",
	                pointColor: "rgba(255,165,0,1)",
	                pointStrokeColor: "#fff",
	                pointHighlightFill: "#fff",
	                pointHighlightStroke: "rgba(255,165,0,1)",
 	                data: [0.8,0.9,1.0,1.1,1.1,1.2]
	            }
	            
	        ]
	    };
	   
// <![CDATA[
	   var options = {
			responsive: true,
			maintainAspectRatio: false,
	        scaleLabel: function (valuePayload) {
	            return ' '+valuePayload.value + '%';
	        },
	        legendTemplate : '<div class=\"row\">'
	        				+'<div class=\"col-xs-6 text-center blacktext\"><span style=\"background-color:<%=datasets[0].strokeColor%>\;padding:5px;border-radius:4px;"><%= datasets[0].label %></span></div>'
// ]]>
// <![CDATA[
	        				+'</div>',
		    multiTooltipTemplate: "<%= value + '%' %>",
		    tooltipTemplate: "<%= value + '%' %>"
// ]]>	        				
	   }
	    var myLineChart = new Chart(document.getElementById("marketShareChartCanvas").getContext("2d")).Line(data,options);
	    document.getElementById("marketSharelegendDiv").innerHTML = myLineChart.generateLegend();
</script>

	<script>
		mhasearchcomp("#navForm\\:searchInput",["Processors","64GB USB Flash Drives","RAM","512GB Solid State Drives","Hard Drives","Memory Kits","USB Flash Drives","256GB Solid State Drives","CPU","SSD","16GB USB Flash Drives","64GB Solid State Drives","128GB Solid State Drives","Graphics Cards","USB","4GB USB Flash Drives","HDD","Solid State Drives","32GB USB Flash Drives","1TB Solid State Drives","GPU","Super Talent","Microsoft","Corsair","Freeware","OCZ","Crucial","Intel","AMD","Asus","HP","Gas Powered Games","Capcom","Apple","Quickport","Google","Mozilla","Nintendo","Cooler Master","Paragon","VMware","Prime Technology","Oracle","Aquafold","Quest","Freeware by Chris Maunder","CodeWiz","Website","Sysinternals","Mythicsoft Freeware","ID Software","2BrightSparks","Mysema","Apache","JBoss","Tracker","CodePlex","Sybase","Harvest","W3schools Website","Chrome Extension","Firefox Extension","Freeware XPath Library","Lexar","Adata","Kingston","Patriot","Transcend","NirSoft","Crystal Dew World","ATTO","GNU","Alex Intelligent Software","Silicon Power","Hama","Mushkin","Wacom","Sony","SanDisk","Cyborg","Busbi","Lacie","Verbatim","Emtec","Intenso","RarLab","Corel","Kingmax","Novatech","Raspberry Pi","Hitachi","Seagate","Yishitongtech ","WD","Samsung","Synology","Lenovo","TDK","Plextor","CnMemory","Sharkoon","powertraveller","Acer","PQI","Razer","Integral","PNY","Payware","Dell","Toshiba","UserBenchMark","HGST","Nvidia","HyperX","New Product","G.SKILL","Zotac","Super Talent Express DUO USB 3.0 16GB","Microsoft Wired Ergonomic Keyboard 4000","Corsair Performance Pro 256GB","Freeware Eclipse Indigo\+","Corsair Voyager Mini USB 2.0 4GB","OCZ Agility 3 240GB","Crucial RealSSD C300 256GB","Crucial M4 256GB","OCZ Vertex 3 MAX IOPS 240GB","Intel Core2 Duo E6550","AMD Phenom II X4 965","Intel Core i7\-950","Intel Core i5\-2500K","Intel Core i7\-2600","Intel Core i7\-2600K","Intel Core i7\-3630QM","Microsoft Wheel Mouse Optical","Freeware Foobar 2000","Asus Eee Box EB1012P","HP ProLiant MicroServer N40L","Microsoft Developer Studio 2008","Freeware Bram Moolenaar's VIM","Gas Powered Games Supreme Commander  Forged Alliance","Capcom Street Fighter 2 Turbo","Intel Core i5\-2400","Apple iPad First Generation","Freeware Gnu Emacs","Quickport Combo eSata","Freeware 7\-Zip","Microsoft Natural Wireless Laser Mouse 6000","Microsoft Wireless Desktop 3000","Google Chrome","Mozilla Firefox","Freeware VideoLAN VLC Media Player","Microsoft Internet Explorer 8","Nintendo Super Mario Kart","Apple MacBook Air 13 2011","Freeware Voidtools Everything","Cooler Master Centurion 534","Freeware QTTabBar","Freeware Putty","Freeware WinSCP","Microsoft Excel 2003","Paragon Hard Disk Manager Suite","Freeware Inkscape","VMware Workstation 8","Freeware Quest Toad for MySQL","Prime Technology Primefaces","Freeware SqlDbx","Oracle SQL Developer","Aquafold Aqua Data Studio","Quest Toad for Oracle","Freeware by Chris Maunder MFC Grid Control","CodeWiz Developer Studio Add\-In","Freeware Metalscroll Developer Studio add\-in","Freeware MySql Workbench","Website Stackoverflow","Freeware Snippy","Website The Code Project","Sysinternals Process Explorer","Mythicsoft Freeware FileLocator Lite","Freeware Windiff Helper by Cagdas Calik","Freeware Core Temp","Oracle Java VisualVM","Freeware TrueCrypt","ID Software Quake 2","Freeware Malwarebytes","2BrightSparks Freeware SyncBack","Mysema Querydsl","Google Guava","Apache Lucene","JBoss Hibernate","Freeware MySQL","Freeware Treesize","Tracker PDF\-XChange Viewer","CodePlex XPath Visualizer","Google Chrome Developer Tools","Website Rubular","Oracle Database","Sybase ASE Database","Freeware Contentflow","Harvest Chosen","Freeware jQuery","Website Mozilla CSS Reference","W3schools Website CSS Color Names","Freeware PIE","Apple iPad Third Generation","Chrome Extension New Tab Website","Firefox Extension Firebug","Chrome Extension Page Load Time","Chrome Extension Meta SEO Inspector","Chrome Extension Alexa Traffic Rank","Firefox Extension Extended Statusbar","Freeware Project Lombok","Freeware Twitter Bootstrap ","Freeware XPath Library Saxon","Lexar JumpDrive Triton USB 3.0 16GB","Corsair Flash Voyager USB 3.0 16GB","Adata S107 USB 3.0 16GB","Kingston DataTraveler Ultimate USB 3.0 16GB","Corsair Flash Voyager GT USB 3.0 16GB","Patriot Supersonic Xpress USB 3.0 16GB","Adata Nobility N005 Pro USB 3.0 16GB","Transcend JetFlash 700 USB 3.0 16GB","Transcend JetFlash 700 USB 3.0 32GB","Corsair Flash Survivor USB 3.0 16GB","Transcend JetFlash 780 USB 3.0 16GB","Transcend JetFlash 760 USB 3.0 16GB","Lexar JumpDrive S73 USB 3.0 16GB","NirSoft Volumouse","Crystal Dew World CrystalDiskMark","ATTO Disk Benchmark","GNU Gimp","Alex Intelligent Software AS SSD","Patriot Supersonic Boost XT USB 3.0 16GB","Silicon Power Blaze B10 USB 3.0 16GB","Kingston DataTraveler Elite USB 3.0 16GB","Hama Probo USB 3.0 16GB","Patriot Supersonic Pulse USB 3.0 16GB","Mushkin Ventura USB 3.0 16GB","Wacom Bamboo Stylus","Microsoft Intellipoint Mouse Driver","Sony Micro Vault Mach USB 3.0 16GB","SanDisk Extreme USB 3.0 16GB","Freeware Notepad\+\+","Asus Transformer Pad TF300","Google Nexus 7","OCZ Vertex 4 256GB","Intel Core i5\-3570K","Intel Core i7\-3770K","Freeware Netbeans","Cyborg RAT 7 Gaming Mouse","Freeware Iometer","Freeware FreeCommander","Microsoft Natural Keyboard Elite","Kingston HyperX 240GB","SanDisk Extreme 240GB","Apple iPad Second Generation","Freeware Avast\! Antivirus","Freeware Microsoft Security Essentials","Freeware Avira AntiVir Personal Edition","Freeware AVG Anti\-Virus","Freeware Spybot\-S\&D","Busbi Bolt USB 3.0 16GB","Lacie RuggedKey USB 3.0 16GB","Adata S102 Pro USB 3.0 16GB","Verbatim Store n Go V3 USB 3.0 16GB","Emtec C650 USB 3.0 16GB","Intenso Speed Line USB 3.0 16GB","Freeware Opera","Apple Safari","Freeware Paint.NET","Freeware PeaZip","RarLab WinRAR","Corel WinZip","Apache OpenOffice Calc","Microsoft Word 2010","Kingmax Pop Series USB 3.0 16GB","Novatech HDD Docking Station USB 3.0","Chrome Extension Remove Cookies For Site","Raspberry Pi Model B","Hitachi Deskstar 7K3000 3TB","Seagate Barracuda 7200.14 3TB","Yishitongtech  SDHC Flash Array V2.5","Microsoft Surface RT","Apple iPad Mini","Apple iPad Fourth Generation","WD Red 3TB (2012)","Samsung 830 256GB","WD VelociRaptor 1TB","WD My Book Live Duo 4TB","Synology DS213\+","Lenovo ThinkPad X1 Carbon","Asus Zenbook Prime","Apple MacBook Air 13 2012","Freeware My Fitness Pal","Kingston DataTraveler SE9 USB 2.0 16GB","OCZ RevoDrive 3 X2 240GB","Corsair Neutron GTX 240GB","Corsair Neutron (v0) 240GB","TDK TF30 USB 3.0","Silicon Power Marvel M01 USB 3.0 16GB","Samsung 840 Pro 256GB","Plextor M5 Pro 256GB","CnMemory Evolution USB 3.0 16GB","Sharkoon Flexi Drive Extreme Duo USB 3.0 16GB","Kingston DataTraveler HyperX USB 3.0 64GB","WD Black 2TB (2010)","WD Green 3TB (2011)","Adata Classic C103 USB 3.0 16GB","Kingston DataTraveler 111 USB 3.0 16GB","OCZ Vector 256GB","Lenovo IdeaPad Z580","Apple MacBook Pro Retina 15 2012","Kingston DataTraveler R3.0 USB 3.0 16GB","powertraveller powergorilla","Apache XAMPP","Kingston SSDNow V\+200 240GB","Acer Aspire Revo L80","Corsair Flash Voyager GT Turbo USB 3.0 64GB","PQI Intelligent Drive Micro USB 3.0 16GB","Corsair Force 3 240GB","Razer BlackWidow Stealth","Razer DeathAdder Gaming Mouse","Kingston DataTraveler Ultimate G3 USB 3.0 64GB","Patriot Supersonic Magnum USB 3.0 64GB","SanDisk Extreme USB 3.0 64GB","Patriot Element USB 3.0 16GB","Lexar JumpDrive Triton USB 3.0 64GB","Lexar JumpDrive Triton USB 3.0 32GB","SanDisk Extreme USB 3.0 32GB","Kingston DataTraveler Ultimate USB 3.0 32GB","Transcend JetFlash 700 USB 3.0 64GB","Verbatim Store n Go V3 USB 3.0 32GB","Verbatim Store n Go V3 USB 3.0 64GB","Lexar JumpDrive S73 USB 3.0 32GB","Lexar JumpDrive S73 USB 3.0 64GB","Lexar JumpDrive P10 USB 3.0 64GB","Lexar JumpDrive P10 USB 3.0 32GB","Lexar JumpDrive P10 USB 3.0 16GB","Integral Neon USB 3.0 16GB","Mushkin Ventura Pro USB 3.0 64GB","PNY Key Attache Grey USB 2.0 32GB","Intel Core i7\-3930K","Intel Core i3\-3225","AMD FX\-8350","Transcend JetFlash 760 USB 3.0 32GB","SanDisk Ultra USB 3.0 32GB","Freeware Magento Community Edition","Intel 525 Series mSATA 240GB","Samsung 840 250GB","SanDisk Ultra Plus 256GB","Patriot Tab Micro USB 3.0 32GB","Kingston DataTraveler 100 G3 USB 3.0 16GB","Payware Sublime Text","Patriot Supersonic Rage XT USB 3.0 32GB","Google Picasa","Intel Core i7\-4770K","Intel Core i5\-4670K","Samsung Series 7 Chronos ","Dell Inspiron 15R Special Edition","Verbatim Store n Go V3 Max USB 3.0 16GB","SanDisk Extreme II 240GB","Sony Micro Vault Click USB 3.0 16GB","AMD Athlon II X4 750K","Lexar JumpDrive S23 USB 3.0 16GB","Crucial M500 240GB","Acer Aspire V5","AMD FX\-6300","Freeware Select2","Transcend JetFlash 810 USB 3.0 16GB","Adata DashDrive Elite UE700 USB 3.0 64GB","Patriot Supersonic Rage XT USB 3.0 64GB","Lacie XtremKey USB 3.0 64GB","Lacie XtremKey USB 3.0 32GB","Corsair Flash Voyager GT USB 3.0 64GB","Adata Nobility N005 Pro USB 3.0 64GB","Adata Nobility N005 Pro USB 3.0 32GB","Corsair Flash Voyager GT USB 3.0 32GB","Lexar JumpDrive S23 USB 3.0 64GB","Lexar JumpDrive S23 USB 3.0 32GB","Verbatim Store n Go V3 Max USB 3.0 32GB","Verbatim Store n Go V3 Max USB 3.0 64GB","Kingston DataTraveler 111 USB 3.0 32GB","Kingston DataTraveler R3.0 USB 3.0 64GB","Kingston DataTraveler R3.0 USB 3.0 32GB","Transcend JetFlash 810 USB 3.0 32GB","Kingston DataTraveler Ultimate G3 USB 3.0 32GB","WD Black 1TB (2010)","Adata DashDrive UV128 USB 3.0 32GB","Silicon Power Blaze B20 USB 3.0 32GB","Samsung 840 Evo 250GB","Seagate Desktop HDD 4TB (2013)","WD Black 4TB (2012)","Seagate 600 240GB","OCZ Vertex 450 256GB","OCZ Agility 4 256GB","Adata DashDrive Elite S102 Pro USB 3.0 32GB","Adata DashDrive UV128 USB 3.0 64GB","Seagate Barracuda 7200.14 2TB","Intel Core i3\-4130","Mushkin Chronos 240GB","Toshiba HG5d Q Series 256GB","Plextor M5M mSATA 256GB","Adata DashDrive Elite S102 Pro USB 3.0 64GB","SanDisk Ultra USB 3.0 16GB","Intel Core i7\-4820K","Kingston DataTraveler Mini USB 3.0 16GB","OCZ Vector 150 240GB","WD Blue 1TB (2012)","WD Blue 1TB (2010)","WD Green 2TB (2012)","UserBenchMark UBM","Seagate Desktop SSHD 2TB","Seagate Desktop SSHD 1TB","WD Red 2TB (2012)","Seagate Momentus XT SSHD 2.5 500GB","Seagate Laptop Thin SSHD 2.5 500GB","Seagate Laptop SSHD 2.5 1TB","AMD FX\-9590","Seagate Video SV35.6 Series 2TB","Kingston SSDNow V300 240GB","Kingston HyperX 3K 240GB","Adata XPG SX900 256GB","Mushkin Chronos Deluxe 240GB","WD Black 2TB (2013)","WD Black 1TB (2013)","WD Se 4TB","Samsung Spinpoint F3 1TB","Seagate Barracuda 7200.14 1TB","WD Green 2TB (2011)","Adata DashDrive UV150 USB 3.0 16GB","Adata DashDrive UV150 USB 3.0 32GB","Samsung 840 Evo 120GB","SanDisk Ultra Plus 128GB","Crucial M500 120GB","SanDisk Extreme II 120GB","Samsung 840 Pro 128GB","Seagate 600 120GB","Kingston SSDNow V300 120GB","Plextor M5 Pro 128GB","Kingston HyperX 3K 120GB","OCZ Vertex 4 128GB","OCZ Vertex 450 128GB","Samsung 830 128GB","OCZ Vertex 3 120GB","Crucial M4 128GB","Adata Premier Pro SP900 128GB","Intel 330 Series 120GB","Intel 530 Series 120GB","Intel 520 Series 120GB","Intel 320 Series 120GB","Intel 335 Series 240GB","Toshiba Q Series Pro 128GB","Toshiba Notebook SSHD 2.5 1TB","Intel Pentium G3220","Intel Pentium G3420","Intel Pentium G3430","HGST Deskstar NAS 4TB","Intel Core i7\-3960X","Intel Core i7\-4930K","Intel Core i7\-4960X","Intel Core i7\-4770","Intel Core i7\-3770","Intel Core2 Quad Q6600","Intel Core i7\-920","Intel Core i7\-2670QM","AMD FX\-8320","AMD FX\-6100","Intel Core i7\-2700K","Intel Celeron G1820","Intel Core i5\-4440","Intel Core i7\-4900MQ","Kingston DataTraveler G4 USB 3.0 32GB","Crucial M550 256GB","AMD Phenom II X6 1055T","AMD Phenom II X6 1100T","AMD FX\-9370","AMD FX\-8150","AMD A10\-5800K APU","Intel Core i7\-4771","Seagate Barracuda 7200.12 1TB","Intel 730 Series 240GB","OCZ Vertex 460 240GB","Nvidia GTX 760","AMD HD 7950","AMD HD 7870","Nvidia GTX 660","AMD HD 7970","Nvidia GTX 780","Nvidia GTX 780 Ti","AMD R9 290X","Nvidia GTX 460","Intel HD 4600 (Desktop 1.25 GHz)","Intel HD 4000 (Desktop 1.15 GHz)","Intel HD 3000 (Desktop V2 1.35 GHz)","AMD R9 290","Nvidia GTX 770","Nvidia GTX 560 Ti","Nvidia GTX 670","AMD HD 7850","Nvidia GTX 660 Ti","Nvidia GTX 750 Ti","AMD R9 270X","Nvidia GTX 650 Ti","Nvidia GTX 650 Ti Boost","Nvidia GTX Titan","AMD R9 280X","SanDisk X110 mSATA 128GB","Plextor M6S 128GB","Patriot Pyro SE 120GB","Patriot Pyro 120GB","Patriot Wildfire 120GB","AMD R9 280","OCZ Vector 150 120GB","Corsair Force 3 120GB","Plextor M5S 128GB","OCZ Agility 3 120GB","Samsung 840 120GB","Kingston SSDNow KC300 120GB","Mushkin Ventura Ultra USB 3.0 60GB","Intel Core i7\-4790","Intel Core i3\-4150","Intel Core i5\-4460","Intel Core i5\-4690","Crucial MX100 256GB","SanDisk Extreme Pro 240GB","Intel Core i7\-4790K","Samsung 850 Pro 256GB","Kingston DataTraveler R3.0 G2 USB 3.0 32GB","Intel Core i5\-4690K","Intel Core i3\-4350","Intel Pentium G3258","Intel Pentium G3440","OCZ AMD Radeon R7 240GB","SanDisk Ultra II 240GB","Nvidia GTX 980","Nvidia GTX 970","Intel Core i7\-5930K","Intel Core i7\-5820K","Intel Core i7\-5960X","HyperX Fury 120GB","OCZ ARC 100 240GB","Intel Core i5\-4590","Crucial MX100 128GB","Nvidia GTX 745 (OEM)","WD Purple 2TB (2014)","WD Red 6TB (2014)","WD Red Pro 4TB (2014)","WD Re 3TB (2012)","Seagate Desktop SSHD 4TB","Seagate NAS HDD 4TB","SanDisk Ultra Fit USB 3.0 16GB","SanDisk Ultra Fit USB 3.0 32GB","SanDisk Ultra Fit USB 3.0 64GB","Transcend SSD370 128GB","Transcend SSD370 256GB","Intel Core i5\-3210M","Intel Core2 Duo E8400","Intel Core i7\-4700MQ","Intel Core i7\-4700HQ","Intel Core i7\-2630QM","Intel Core i7\-3610QM","Toshiba DT01ACA300 3TB","Toshiba DT01ACA200 2TB","Toshiba DT01ACA100 1TB","Intel Core i5\-4200U","Intel Core i7\-4500U","Intel Core i5\-3317U","Intel Core i5\-2410M","Intel Core i5\-4570","Intel Core i5\-3470","Intel Core i5\-3230M","Intel Core i5\-750","Intel Core i5\-2450M","Intel Core i3\-4160","Intel Core i3\-4370","Intel Pentium G3460","Intel Core i3\-4360","Intel Pentium G3240","Nvidia Quadro K6000","Nvidia Quadro K4200","Nvidia Quadro K2200","Nvidia Quadro K620","AMD FirePro W9000","AMD FirePro W7000","AMD FirePro V4900","Intel Celeron G1830","Intel Celeron G1840","Intel Celeron G1850","Intel Core i3\-4330","Intel Core i3\-4340","AMD FX\-4100","AMD FX\-4300","AMD FX\-4350","New Product from www.newegg.com","AMD Phenom II X4 955","AMD A10\-6800K APU","AMD A10\-7850K APU","AMD A10\-6700 APU","AMD A10\-5700 APU","Samsung 850 Evo 250GB","AMD FX\-8370","AMD FX\-8370E","AMD FX\-8320E","Crucial BX100 250GB","OCZ Vertex 460A 240GB","Nvidia GTX 680","AMD R9 270","Nvidia GTX 580","AMD R7 260X","AMD HD 6950","Nvidia GTX 650","Nvidia GTX 560","Nvidia GTX 570","Nvidia GTX 480","Nvidia GTX Titan Black","Nvidia GTX 260","Nvidia GTX 550\-Ti","Nvidia GTX 750","Nvidia GTX 960","AMD R9 285","Crucial MX200 250GB","Toshiba MD04ACA400 4TB","Nvidia GTX 275","AMD Athlon II X4 860K","Corsair Neutron XT 240GB","Adata Premier SP610 256GB","Nvidia GTX Titan X","AMD R7 265","Corsair Force LS 240GB","Nvidia GTX 980 Ti","Adata Premier Pro SP920 256GB","OCZ ARC 100 480GB","Transcend SSD370 512GB","SanDisk Ultra II 480GB","Crucial BX100 500GB","Crucial MX100 512GB","SanDisk Extreme Pro 480GB","Samsung 850 Evo 500GB","Samsung 850 Pro 512GB","Intel 730 Series 480GB","Kingston SSDNow V300 480GB","AMD R9 390","AMD R9 380","Samsung 850 Pro 128GB","Samsung 850 Evo 120GB","Crucial M550 128GB","SanDisk Ultra II 120GB","OCZ ARC 100 120GB","OCZ Vertex 460 120GB","Crucial BX100 120GB","OCZ Vertex 460A 120GB","Adata XPG SX900 128GB","OCZ AMD Radeon R7 120GB","OCZ Vector 180 240GB","HyperX Savage 240GB","OCZ Vector 180 120GB","HyperX Savage 120GB","AMD R9 390X","AMD R9 Fury\-X","Plextor M6V 256GB","Intel 535 Series 240GB","OCZ Trion 100 240GB","Intel Core i7\-6700K","Intel Core i5\-6600K","Crucial MX200 500GB","Plextor M6S 256GB","Plextor M6S 512GB","OCZ AMD Radeon R7 480GB","OCZ Vector 180 480GB","AMD R9 Fury","Nvidia GTX 950","Intel Core i3\-6100","Intel Core i5\-6400","Intel Core i5\-6500","Intel Core i5\-6600","Intel Core i7\-6700","WD Green 4TB (2013)","WD Green 5TB (2014)","WD Green 6TB (2014)","WD Black 6TB (2015)","WD Blue 1TB (2015)","WD Blue 2TB (2015)","WD Blue 3TB (2015)","WD Blue 4TB (2015)","WD Red 5TB (2014)","WD Red 4TB (2013)","Toshiba MD04ACA500 5TB","Lexar JumpDrive P20 USB 3.0 32GB","Lexar JumpDrive P20 USB 3.0 64GB","Lexar JumpDrive S25 USB 3.0 16GB","Lexar JumpDrive S25 USB 3.0 32GB","Lexar JumpDrive S25 USB 3.0 64GB","AMD R9 380X","Corsair Vengeance LPX DDR4 2400 C14 4x4GB","Intel Core i3\-6320","Intel Core i3\-6300","Intel Pentium G4520","Intel Pentium G4500","Intel Pentium G4400","G.SKILL Ripjaws 4 DDR4 3000 C15 4x4GB","Corsair Vengeance LPX DDR4 2800 C16 4x4GB","Corsair Vengeance LPX DDR4 2400 C14 4x8GB","Corsair Vengeance LPX DDR4 2133 C13 2x8GB","Corsair Vengeance LPX DDR4 2400 C14 2x8GB","Corsair Vengeance LPX DDR4 2666 C16 2x8GB","Corsair Vengeance LPX DDR4 3000 C15 2x8GB","Corsair Vengeance LPX DDR4 3200 C16 2x8GB","G.SKILL Trident Z DDR4 3000 C15 2x8GB","G.SKILL Ripjaws V DDR4 2400 C15 2x8GB","G.SKILL Trident Z DDR4 3200 C16 2x8GB","G.SKILL Ripjaws 4 DDR4 2400 C15 2x8GB","HyperX Fury DDR4 2133 C14 2x8GB","HyperX Fury DDR4 2666 C15 2x8GB","HyperX Fury DDR4 2133 C14 2x4GB","HyperX Fury DDR4 2133 C14 1x8GB","HyperX Fury DDR4 2666 C15 2x4GB","Corsair Vengeance LPX DDR4 2666 C16 4x4GB","Corsair Vengeance LPX DDR4 3000 C15 4x4GB","G.SKILL Ripjaws V DDR4 2400 C15 2x4GB","G.SKILL Ripjaws V DDR4 2133 C15 2x4GB","Crucial Ballistix Sport DDR4 2400 C16 4x4GB","G.SKILL Trident Z DDR4 3600 C16 2x8GB","G.SKILL Trident Z DDR4 3600 C17 2x8GB","G.SKILL Ripjaws V DDR4 3200 C16 4x16GB","Corsair Dominator DDR4 3000 C15 4x16GB","G.SKILL Trident Z DDR4 3600 C17 2x4GB","G.SKILL Ripjaws 4 DDR4 2400 C14 8x16GB","G.SKILL Ripjaws V DDR4 2400 C15 4x8GB","HyperX Fury DDR4 2133 C14 4x8GB","HyperX Fury DDR4 2666 C15 4x8GB","AMD R7 370","AMD R7 360","Patriot Ignite 240GB","Patriot Ignite 480GB","Patriot Ignite 960GB","Samsung 850 Evo 1TB","Samsung 850 Pro 1TB","Crucial MX200 1TB","Transcend SSD370 1TB","HyperX Savage 960GB","SanDisk Extreme Pro 960GB","SanDisk Ultra II 960GB","Mushkin Reactor 1TB","Mushkin Reactor 512GB","HyperX Fury DDR4 2400 C15 4x4GB","Corsair Vengeance LPX DDR4 2666 C16 4x8GB","HyperX Fury DDR4 2400 C15 2x8GB","HyperX Fury DDR4 1866 C10 2x4GB","Toshiba P300 1TB","Toshiba P300 2TB","Toshiba P300 3TB","Toshiba X300 4TB","Toshiba X300 5TB","Toshiba X300 6TB","Toshiba E300 2TB","Toshiba E300 3TB","Corsair Dominator DDR4 3000 C15 2x8GB","Zotac Premium Edition 240GB","Zotac Premium Edition 480GB","Seagate Laptop SSHD 2.5 (32GB NAND) 1TB","Crucial Ballistix Sport DDR4 2400 C16 2x4GB","HyperX Savage 480GB","Nvidia GTX 1080","Intel Core i7\-6950X","Intel Core i7\-6900K","Intel Core i7\-6850K","Intel Core i7\-6800K","G.SKILL Ripjaws 4 DDR4 2800 C16 4x4GB","Nvidia GTX 1070"]);
	</script>
	

<script>

myPageIsLoaded();

// <![CDATA[
if($('.be-int').length > 0 && $('iframe').length == 0)
{
	//USED FOR IMG IA UNITS
	$(".be-int img").each(function() {
	    $(this).attr("src",$(this).attr("data-src")).removeAttr("data-src");
	});
	
	$('.be-int').show();
	$('.be-caption').hide();
}

var usernotchosen = true;
var navcount = 0;
function onNavigateToHotPrice(aLink)
{
	var showne = $(aLink).parent().parent().siblings('div').children('div').children(":contains('Newegg')").length == 1;
    var retval = true;//allow def nav
	if(usernotchosen && ( navcount < 2  || (showne && navcount < 3) ))
	{
		switch(navcount)
		{
		case 0:
			window.open(aLink.href,'_blank');
			onValidateChecksAndSetMerchants($(aLink).parent().parent().siblings('div').children('div').children(":contains('Ebay')"),true);//on
			onValidateChecksAndSetMerchants($(aLink).parent().parent().siblings('div').children('div').children(":contains('Amazon')"),true);//off
			retval = false;
			break;
		case 1:
			window.open(aLink.href,'_blank');
			if(showne)
			{
				onValidateChecksAndSetMerchants($(aLink).parent().parent().siblings('div').children('div').children(":contains('Newegg')"),true);//on
				onValidateChecksAndSetMerchants($(aLink).parent().parent().siblings('div').children('div').children(":contains('Ebay')"),true);//off
			}
			else
			{
				onValidateChecksAndSetMerchants($(aLink).parent().parent().siblings('div').children('div').children(":contains('Amazon')"),true);//on
			}
			retval = false;
			break;
		case 2:
			window.open(aLink.href,'_blank');
			onValidateChecksAndSetMerchants($(aLink).parent().parent().siblings('div').children('div').children(":contains('Ebay')"),true);
			onValidateChecksAndSetMerchants($(aLink).parent().parent().siblings('div').children('div').children(":contains('Amazon')"),true);
			retval = false;
			break;
		default:
			break;
		}
		navcount++;
	}
    return retval;
}
function onValidateChecksAndSetMerchants(aCaller,aAuto)
{
	$(aCaller).toggleClass('extramutedtext').children('i').toggleClass('fa-check-square-o fa-square-o');
	
	var hasama = $(aCaller).parent().children().children('.fa-check-square-o').parent(":contains('Amazon')").length;
	var haseba = $(aCaller).parent().children().children('.fa-check-square-o').parent(":contains('Ebay')").length;
	var hasnew = $(aCaller).parent().children().children('.fa-check-square-o').parent(":contains('Newegg')").length;
	var targetstr = (hasama?'Amazon':'')+(haseba?'Ebay':'')+(hasnew?'Newegg':'');
	
	
	$(aCaller).parent().parent().siblings('div').children('div').children('a').each(function(){
		var start = this.href.substr(0,this.href.indexOf('Go/Hot')+9);
		var end = this.href.replace(start,'');
		end = end.substr(end.indexOf('/'),end.length);
		this.href = start+targetstr+end;
	});
	
	if(aAuto != true)
	{
		var btnbase = aCaller.className.match(/(btn-\w+)/)[1];
		var additionaltextclass = '';
		if(btnbase == 'btn-default')
			additionaltextclass = 'ambertext';
		
		if($(aCaller).parent().children().children('.fa-check-square-o').length == 0)
			$(aCaller).parent().parent().siblings('div').children('div').children('a').addClass('disabled').removeClass(additionaltextclass).addClass('extramutedtext');
		else
			$(aCaller).parent().parent().siblings('div').children('div').children('a').removeClass('disabled').addClass(additionaltextclass).removeClass('extramutedtext');
		
		usernotchosen = false;
		
		var selbtnstr =  btnbase+'-3d';
		var unselbtnstr = btnbase;
		$(aCaller).parent().children('a').addClass(selbtnstr).removeClass(unselbtnstr);
		
		guiLogMessage('HOTCHOOSE_'+btnbase+'_'+targetstr);
	}
	
}

// ]]>				




</script>	

</body>
</html>`
}());


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
        let regExp = /([\d]+(\.[\d]+))<span class="tc-units"> fps/g;
        let regExpResult;
        let fps = [];
        while ((regExpResult = regExp.exec(this.heading)) !== null) {
            fps.push(regExpResult[1])
        }
        this.dx9 = fps[0];
        this.dx10 = fps[1]
    }

}

let amd390 = new Parse(rawHTML);
amd390.findHeading();
amd390.findFPS();
console.log(`dx9 fps is ${amd390.dx9}`);
console.log(`dx10 fps is ${amd390.dx10}`);
























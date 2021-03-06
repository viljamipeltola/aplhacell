var score = {
	wormsKilled: 0,
	boilsKilled: 0,
	startTime: null,
	endTime: null,
}

function ScoreDisplay() {
	this.show = function () {
		
		var timeBonus = Math.floor( ( score.endTime.getTime() - score.startTime.getTime() ) / 100 ); 
		if( !this.dialog ) {
			var fullBonus = score.wormsKilled * 100 + timeBonus;
			this.dialog = $('<div id="scoreDialog"><h1>Scores</h1><table style="margin: 0px auto;"><tr><td style="width:100px;"> Worms killed: </td><td style="width:50px;text-align:right;">' + 
				score.wormsKilled + '</td></tr><tr><td>Time bonus: </td><td style="text-align:right;">' + timeBonus + '</td></tr><tr><td>Total: </td><td style="text-align:right;">' + fullBonus  + '</td></tr><tr></tr></table><br /><p>Press R to replay!</p></div>').appendTo('#canvasContainer');
		}
		
		$(this.dialog).keypress( this.hide );
	}

	this.hide = function () {
		$( this.dialog ).remove();

		this.reset();
		
		// TODO: Replay
	}
	this.hide = this.hide.bind( this );
	
	this.reset = function ()  {
		this.dialog = null;
		score.startTime = null;
		score.endTime = null;
		score.wormsKilled = 0;
	}
}

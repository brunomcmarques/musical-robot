tg = {}

tg.rules= {};
tg.rules.number_of_players = 2
tg.rules.maximum_number_of_sets = 3
tg.rules.fifth_set_tiebreak_to_ten_points = null
tg.rules.number_of_games_per_set = 6
tg.rules.advantage_rule = 1
tg.rules.tiebreak_set = 1
tg.rules.tiebreak_number_of_points = 7
tg.rules.last_set_tiebreak = 0
tg.rules.tiebrake_change_ends_after_x_games = 6

function resetScore(){
	tg.score = {}
	tg.score.points = [0,0]
	tg.score.tiebreak = 0
	tg.score.set  = []; for(i=0;i<tg.rules.maximum_number_of_sets;i++){tg.score.set[i] = [0,0]}
	tg.score.setScore = [0,0]
	tg.score.game_number = 1
}
resetScore()

tg.currentSet = 0

function resetProb(){
	tg.position = [0,0,0]
	tg.prob = {}
	tg.prob[[0,0,0]] = []
	tg.prob[[0,0,1]] = []
	tg.prob[[0,1,0]] = []
	tg.prob[[0,1,1]] = []
	tg.prob[[1,0,0]] = []
	tg.prob[[1,0,1]] = []
	tg.prob[[1,1,0]] = []
	tg.prob[[1,1,1]] = []
}
resetProb()

tg.string = []

tg.resetPoint = function(){tg.score.points = [0,0]}
tg.resetCourt = function(){tg.position[0]=0}
tg.flipCourt  = function(){tg.position[0]=(tg.position[0]==0?1:0)}
tg.flipEnds   = function(){tg.position[1]=(tg.position[1]==0?1:0)}
tg.flipServe  = function(){tg.position[2]=(tg.position[2]==0?1:0)}

tg.point = function(w){
	tg.score.points[w]++
	tg.string.push(w)
	tg.prob[tg.position].push(w)
}

tg.game  = function(w){tg.score.set[tg.currentSet][w]++}
tg.set   = function(w){
	tg.score.setScore[w]++
	tg.currentSet++
	tg.score.tiebreak = 0
	sa = tg.score.setScore[0]
	sb = tg.score.setScore[1]
	if((tg.score.game_number%2)==1){tg.position[2]=0}else{tg.position[2]=1}
	if(Math.max(sa,sb)>(tg.rules.maximum_number_of_sets/2)){throw TypeError}
}

function pp(w){
	try{
		// tg.point(Math.random()>0.5?0:1)
		tg.point(w)
		a = tg.score.points[0]
		b = tg.score.points[1]
		if (Math.max(a,b)<(tg.score.tiebreak?7:4) | Math.abs(a-b)<2) {
			if (tg.score.tiebreak) {
				tg.flipCourt()
				if((a+b)%2==1){tg.flipServe()}
				if((a+b)==1){tg.flipEnds()}else if((a+b)%6==0){tg.flipEnds()}
			}
			else {tg.flipCourt()}
		}
		else {
			tg.game(a>b?0:1)
			tg.score.game_number++
			tg.flipServe()
			tg.resetCourt()
			tg.resetPoint()
			ga = tg.score.set[tg.currentSet][0]
			gb = tg.score.set[tg.currentSet][1]
			if ((ga+gb)%2==1){tg.flipEnds()}
			if (ga == 6 & gb == 6){tg.score.tiebreak=1}
			if ((Math.max(ga,gb)<6 | Math.abs(ga-gb)<2) & Math.max(ga,gb)!=7){} 
			else {
				tg.set(ga>gb?0:1)
			}
		}
		document.querySelector('#points').innerText = tg.score.points
		document.querySelector('#set').innerText = tg.score.set
		document.querySelector('#position').innerText = tg.position
		document.querySelector('#prob').innerText = cprob()
		function cprob(){
			try {
				return tg.prob[tg.position].reduce((a,b)=>a+b) / tg.prob[tg.position].length }
			catch (TypeError) {
				return 'n/a'}
		}
	} catch(err){
		console.log(tg)
		console.log(tg.score)
		console.log(tg.position)
		console.log(err)
	}
}

function qwe(){
	t = tg.string
	tg.string = []
	tg.currentSet = 0
	resetProb()
	resetScore()
	q=t.slice(0,t.length-1);q.forEach(x=>pp(x))
}

document.addEventListener('keydown', (event) => {
	if(event.key=='z'){pp(0)}
	else if(event.key=='m'){pp(1)}
	else if(event.key=='u'){qwe()}
})



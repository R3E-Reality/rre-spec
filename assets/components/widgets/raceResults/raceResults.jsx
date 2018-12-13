UI.widgets.RaceResults = React.createClass({
	componentWillMount: function() {
		var self = this;
		(function checkRefs() {
			if (!self.refs['entries-outer']) {
				return setTimeout(checkRefs, 100);
			}

			var diff = self.refs['entries-outer'].clientHeight - self.refs['entries-inner'].clientHeight;
			setTimeout(function() {
				if (!self.refs['entries-inner']) {
					return;
				}
				self.refs['entries-inner'].style.top = diff+'px';
			}, 10 * 1000);
		})();
	},
	render: function() {
		var self = this;
		var fastestTime = 99999;
		var fastestTimeIndex = null;
		self.props.results.forEach(function(entry, i) {
			if (entry.bestLapInfo.sector3 !== -1 && entry.bestLapInfo.sector3 < fastestTime) {
				fastestTime = entry.bestLapInfo.sector3;
				fastestTimeIndex = i;
			}
		});

		if (self.props.results[fastestTimeIndex]) {
			self.props.results[fastestTimeIndex].isFastest = true
		}
		var self = this;
		return (
			<div className="race-results">
				<div className="title">Race results</div>
				<div className="race-results-entry title">
					<div className="position">Position</div>
					<div className="livery"/>
					<div className="manufacturer"/>
					<div className="name">Name</div>
					<div className="penaltyTime">Penalties</div>
					<div className="lap-time">Finish time</div>
					<div className="fastest-time">Best lap time</div>
				</div>
				<div className="entries-outer" ref="entries-outer">
					<div className="entries-inner" ref="entries-inner">
						{self.props.results.map(function(entry, i) {
							return <RaceResultEntry entry={entry} firstEntry={self.props.results[0]} index={i}/>
						})}
					</div>
				</div>
			</div>
		);
	}
});

var RaceResultEntry = React.createClass({
	getClassColour: function(classId) {
		var classColour = "rgba(38, 50, 56, 0.8)";
		var className = "";

		if (r3eData.classes[classId] != null && r3eClassColours.classes[classId] != null) {
			classColour = r3eClassColours.classes[classId].colour;
			className = r3eData.classes[classId].Name;
		}

		return {	'backgroundColor': classColour };
	},
		render: function() {
		var self = this;
		var entry = self.props.entry;
		var lapTime = null;
		if (entry.finishStatus === 'DNF') {
			lapTime = <div className="lap-time">DNF</div>
		} else if (self.props.index === 0) {
			lapTime = <div className="lap-time">{UI.formatTime(entry.totalTime, {ignoreSign: true})}</div>
		} else {
			lapTime = <div className="lap-time">{UI.formatTime(entry.totalTime-self.props.firstEntry.totalTime)}</div>
		}

		var penaltyTime = <div className="timePenalty"> No Penalties </div>
		if (entry.penaltyTime) {
			penaltyTime = <div className="timePenalty"> (entry.penaltyTime/1000)s Penalty </div>
		}

		return (
			<div className={cx({'fastest': entry.isFastest, 'race-results-entry': true})}>
			<div className={cx({'classPosition': true})} style={self.getClassColour(entry.classId)}>Class P{entry.positionClass}.</div>
			<div className="position">{entry.positionOverall}.</div>
				<div className="manufacturer">
					<img src={'/img/manufacturers/'+entry.manufacturerId+'.webp'} />
				</div>
				<div className="name">{UI.fixName(entry.name)}</div>
				<div className="livery">
					<img src={'/render/'+entry.liveryId+'/small/'}/>
				</div>
				{penaltyTime}
				{lapTime}
				{entry.bestLapInfo.sector3 !== -1 ?
					<div className="fastest-time">{UI.formatTime(entry.bestLapInfo.sector3, {ignoreSign: true})}</div>
					:
					<div className="fastest-time">-</div>
				}
			</div>
		);
	}
});

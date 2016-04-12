var React = require('react'),
    Words = require('../game/words'),
    Util = require('../game/util'),
    ShuffledWord = require('./shuffled_word'),
    TargetWord = require('./target_word'),
    ScoreBox = require('./score_box'),
    Countdown = require('./countdown');

var Game = React.createClass({
  getInitialState: function() {
    return({
      word: this.getWord(),
      score: 0,
      level: 0,
      inPlay: true
    });
  },
  getWord: function() {
    return Words.getEasyWord();
  },
  _handleClick: function() {
    this.setState({word: this.getWord()});
  },
  _timeIsUp: function() {
    alert('you lose!');
  },
  _goodJob: function() {
    var newScore = this.state.score + 1;
    var newLevel = Util.calculateLevel(newScore);
    this.setState(
      {
        word: this.getWord(),
        score: newScore,
        level: newLevel
      }
    );
  },
  _badJob: function() {
    this.setState({inPlay: false});
  },
  _makeDecoys: function() {
    var decoyWords = [];
    while (decoyWords.length < 3) {
      var decoy = Util.shuffleWord(this.state.word);
      var swappedDecoy = Util.replaceLetterWithRandomCharacter(decoy);
      if (swappedDecoy !== this.state.word) {
        decoyWords.push(swappedDecoy);
      }
    }
    return decoyWords;
  },
  _makeCorrectChoice: function() {
    var correctWord = Util.shuffleWord(this.state.word);
    return <ShuffledWord word={correctWord}
                         clicked={this._goodJob}
                         key={-1} />;
  },
  render: function() {

    var correctChoice = this._makeCorrectChoice();
    var allChoices = [correctChoice];

    this._makeDecoys().forEach(function(word, i) {
      allChoices.push(
        <ShuffledWord word={word} clicked={this._badJob} key={i} />
                  );
    }.bind(this));

    var shuffledChoices = Util.shuffleChoices(allChoices);

    return (
      <div>
        <Countdown
            initialTimeRemaining={5000}
            interval={50}
            completeCallback={this._timeIsUp} />
          <ScoreBox score={this.state.score} />
          <TargetWord word={this.state.word}/>
        <ul>
          {shuffledChoices}
        </ul>
      </div>
    );
  }
});

module.exports = Game;

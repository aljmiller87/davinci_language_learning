import React from 'react';
import * as Cookies from 'js-cookie';
import * as actions from '../actions/actions';
import {connect} from 'react-redux';
const ReactToastr = require("react-toastr");
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

export class QuestionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            instructions: true,
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.logOff = this.logOff.bind(this);
        this.startSpanishQuiz = this.startSpanishQuiz.bind(this);
        this.firstQuestion = this.firstQuestion.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.readInstructions = this.readInstructions.bind(this);
        this.correctPopUp = this.correctPopUp.bind(this);
        this.incorrectPopUp = this.incorrectPopUp.bind(this);
        this.levelOne = this.levelOne.bind(this);
        this.levelUpdate = this.levelUpdate.bind(this);
    }


    componentDidMount() {
        this.props.dispatch(actions.asyncFirstQuestion());
    }

    logOff() {
        fetch('/auth/logout')
        .then(res => {
            res.json();
        })
    }

    startSpanishQuiz(event) {
        event.preventDefault();
        this.props.dispatch(actions.quizActive());
        this.props.dispatch(actions.asyncStartQuiz())
    }

    firstQuestion() {
        this.props.dispatch(actions.asyncFirstQuestion());
        this.levelOne();
    }

    readInstructions(event) {
        event.preventDefault();
        this.props.dispatch(actions.instructionsActive());
    }

    submitAnswer(id) {
        let clickedItem = document.getElementById(id);
        let selectedAnswer = clickedItem.getAttribute("value");
        if (selectedAnswer == this.props.answer) {
            this.correctPopUp();
        } else {
            this.incorrectPopUp();
        }
        this.props.dispatch(actions.asyncNextQuestion(selectedAnswer));
    }

    correctPopUp () {
        this.refs.container.success(
            "Keep up the great work!",
            "Great Job!", {
                timeOut: 700
        });
    }

    incorrectPopUp () {
        this.refs.container.error(
            "You'll get it next time!",
            "Not quite!", {
                timeOut: 700
            });
    }
    
    levelOne () {
        this.refs.container.info(
            "Goodluck",
            "Level One!", {
                timeOut: 3000
            });
    }

    levelUpdate() {
        this.refs.container.info(
            "Congratulations",
            "Next Level!", {
                timeOut: 3000
            });
    }

    render() {
      
        let options = (this.props.options[0]) ? this.props.options[0] : [];
        let newQuiz = (this.props.options[0]) ? false : true;

        if (this.props.levelUp === true) {
            this.levelUpdate();
        }

        return (

        <div>
            <div className="header">
                <div className="blue circle"></div>
                <div className="dark circle"></div>
                <h1>DaVinci Language Learning</h1>
            </div>
            <div className="main">
                <div className="content-container">
                    <div className="question-container">
                        <div className="nav">
                            <ul>
                                <li><a onClick={this.readInstructions} href="">Instructions</a></li>
                                <li className="dropdown"><span className="dropbtn">Select Language</span>
                                    <div className="dropdown-content">
                                        <a onClick={this.startSpanishQuiz} href="">Spanish</a>
                                        <a href="" className="disabled">Italian
                                            <p>Coming Soon!</p>
                                        </a>
                                        <a href="" className="disabled">Portuguese
                                            <p>Coming Soon!</p>
                                        </a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className={this.props.instructions === true ? "instructions" : "hidden"}>
                            <h3 className="bold">Select a language:</h3>
                            <p>To get started, click the 'Select Language' tab above. Choose from the available languages on the dropdown.</p>
                            <h3 className="bold">How to Use: </h3>
                            <p>Once you select the language to study, the first question will automatically load on your screen. You will be presented with a word or phrase in English and asked to select the correct translation out of three possible options given. To select an answer, simply click directly on top of the choice. There will be a green highlighter that appears when you hover over any option.</p>
                            <p>Upon submitting an anwer, you will be given immediate feedback via notification if answer was correct. All progress is automatically saved. To continue progress upon return, simply select the same language lesson and your current progress will appear.</p>
                            <h3 className="bold">Spaced Repetition:</h3>
                            <p>The Davinci Language Learning strategy follows a 'spaced repetition' algorithm. This means the more you correctly answer an individual question, the greater period of time before that question is revisited. However, if an anwer given is incorrect, that question will be revisited in a shorter time than before.</p>
                            <h3 className="bold">Levels:</h3>
                            <p>After sufficient proficiency has been achieved, you will be given a notification that you will 'level up'. Leveling up means that new and more difficult questions are added to your study.</p>
                            

                        </div>
                        <div className={(this.props.instructions === false && newQuiz === true) ? "question-details" : "hidden"}>
                            <div onClick={this.firstQuestion} className="btn-green btn large fade-in button">Start Quiz</div>
                        </div>
                        <div className={(this.props.instructions === false && newQuiz === false) ? "question-details" : "hidden"}>
                            <h3>Current Question:</h3>
                            <h3 className="question">{this.props.question}</h3>
                            <ul className="option-list"> 
                                <li value="1" id="1" onClick={() => this.submitAnswer("1")}>{options[0]}</li>
                                <li value="2" id="2" onClick={() => this.submitAnswer("2")}>{options[1]}</li>                
                                <li value="3" id="3" onClick={() => this.submitAnswer("3")}>{options[2]}</li>
                            </ul>
                            <h2>Answered {this.props.correctCount} out of {this.props.questionCount}.</h2>
                            <div>
                                <ToastContainer ref="container" toastMessageFactory={ToastMessageFactory}  />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer">
                <div className="logout">
                    <a href="/api/auth/logout" className="btn btn-black">Log Out</a>
                </div>
            </div>
        </div>


        );
    }
}


function mapStateToProps (state, props) {
    return {
        question:state.question,
        options:state.options,
        answer:state.answer,
        questionCount: state.questionCount,
        correctCount: state.correctCount,
        instructions: state.instructions,
        levelUp: state.levelUp
    }

}
export default connect(mapStateToProps)(QuestionPage);
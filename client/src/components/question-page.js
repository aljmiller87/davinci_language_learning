import React from 'react';
import * as Cookies from 'js-cookie';
import * as actions from '../actions/actions';
import {connect} from 'react-redux';

export class QuestionPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            instructions: true,
        }

        this.componentDidMount = this.componentDidMount.bind(this);
        this.logOff = this.logOff.bind(this);
        this.startQuiz = this.startQuiz.bind(this);
        this.firstQuestion = this.firstQuestion.bind(this);
        this.submitAnswer = this.submitAnswer.bind(this);
        this.readInstructions = this.readInstructions.bind(this);
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

    startQuiz(event) {
        event.preventDefault();
        this.props.dispatch(actions.quizActive());
        this.props.dispatch(actions.asyncStartQuiz())
    }

    firstQuestion() {
        this.props.dispatch(actions.asyncFirstQuestion());
    }

    readInstructions(event) {
        event.preventDefault();
        this.props.dispatch(actions.instructionsActive());
    }

    submitAnswer(id) {
        const clickedItem = document.getElementById(id);
        const selectedAnswer = clickedItem.getAttribute("value");
        this.props.dispatch(actions.asyncNextQuestion(selectedAnswer));
    }


    
    render() {
      
        let options = (this.props.options[0]) ? this.props.options[0] : [];
        let newQuiz = (this.props.options[0]) ? false : true;

        return (

        <div>
            <div className="header">
                <div className="blue circle"></div>
                <div className="dark circle"></div>
                <h1>DaVinci Language Learning</h1>
            </div>
            <div className="main"></div>
                

            <div className="content-container">

                <div className="question-container">
                    <div className="nav">
                        <ul>
                            <li><a onClick={this.readInstructions} href="">Instructions</a></li>
                            <li className="dropdown"><a className="dropbtn" href="">Select Language</a>
                                <div className="dropdown-content">
                                    <a onClick={this.startQuiz} href="">Spanish</a>
                                    <a href=""><p p className="deactive">Italian</p></a>
                                    <a href=""><p className="deactive">Portuguese</p></a>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className={this.props.instructions === true ? "instructions" : "hidden"}>
                        <h3>Instructions</h3>
                        <p>To get started, hover over the 'Select Language' tab above. Choose from the available languages on the dropdown.</p>
                        <p>Once you select the language to study, the first question will automatically load on your screen. You will be presented with a word or phrase in English and asked to select the correct translation out of three possible options given. To select an answer, simply click directly on top of the choice. There will be a green highlighter that appears when you hover over any option.</p>
                        <p>All progress is automatically saved. To continue progress upon return, simply select the same language lesson and your current progress will appear.</p>
                    </div>
                    <div className={(this.props.instructions === false && newQuiz === true) ? "question-details" : "hidden"}>
                        <div onClick={this.firstQuestion} className="btn-green btn large fade-in">Start Quiz</div>
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
        questionCount: state.questionCount,
        correctCount: state.correctCount,
        instructions: state.instructions
    }

}
export default connect(mapStateToProps)(QuestionPage);
import React from 'react';

import * as Cookies from 'js-cookie';
import {connect} from 'react-redux';
import QuestionPage from './question-page';
import LoginPage from './login-page';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            fetch('/api/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            }).then(res => {
                if (!res.ok) {
                    if (res.status !== 401) {
                        // Unauthorized, clear the cookie and go to
                        // the login page
                        Cookies.remove('accessToken');
                        return;
                    }
                    throw new Error(res.statusText);
                }
                return res.json();
            }).then(currentUser =>
                this.setState({
                    currentUser
                })
            );
        }
    }

    render() {
        if (!this.state.currentUser) {
            return <LoginPage />;
        }

        return <QuestionPage />;
    }
}



function mapStateToProps (state, props) {
    return {

        question:state.question,
        options:state.options,
        correctAnswer: state.correctAnswer
    }

}
export default connect(mapStateToProps)(App);
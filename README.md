# Davinci Language Learning

## What is it?
A full stack language learning app that uses custom ‘spaced repetition’ algorithm to help students learn a new language. Uses Passport and Google OAuth authentication. All data manipulation is handled by backend. Built with React, Node, Express, and Mongo.

## How to use:
### Select a language:
To get started, click the 'Select Language' tab above. Choose from the available languages on the dropdown.

### Answering questions: 
Once you select the language to study, the first question will automatically load on your screen. You will be presented with a word or phrase in English and asked to select the correct translation out of three possible options given. To select an answer, simply click directly on top of the choice. There will be a green highlighter that appears when you hover over any option.
Upon submitting an anwer, you will be given immediate feedback via notification if answer was correct. All progress is automatically saved. To continue progress upon return, simply select the same language lesson and your current progress will appear.

### Spaced Repetition:
The Davinci Language Learning strategy follows a 'spaced repetition' algorithm. This means the more you correctly answer an individual question, the greater period of time before that question is revisited. However, if an anwer given is incorrect, that question will be revisited in a shorter time than before.

### Levels:
After sufficient proficiency has been achieved, you will be given a notification that you will 'level up'. Leveling up means that new and more difficult questions are added to your study.

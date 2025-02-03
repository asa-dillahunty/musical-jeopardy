# Musical Jeopardy!

This app is supposed to be Jeopardy, but instead of clues the cards will play songs.
Eventually, users will be able to create jeopardy boards including categories and
selecting individual songs for each of the cards. It is intended to function
just like jeopardy and is not for commercial use.

Some useful links for continuing the project:

- [Building a Web Player](https://developer.spotify.com/documentation/web-playback-sdk/howtos/web-app-player)
- [Start a Playback](https://developer.spotify.com/documentation/web-api/reference/start-a-users-playback)
- [iFrame API](https://developer.spotify.com/documentation/embeds/tutorials/using-the-iframe-api)

Some terminology for reading the code

- **Session** - includes players, scores, game
- **Game** - includes game boards, up to three
- **Game Board** - singular board, contains the category titles, songs, score multiplier, daily double data for that board

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# space-invaders-rxjs

This is a popular old-timer implemented in RxJS. The game is for browser.

## Instructions to launch the game: ##

1. Clone the Repo to your working directory.
2. Switch to a branch of your choice (on master the game is fully implemented).
3. Run 'npm install' in the main directory to fetch all the dependencies. For that you will need to have Node.js installed on your computer.
4. Run 'webpack' in the main directory. If you don't have webpack installed globally, run 'npm install -g webpack'.
5. Webpack will bundle all the files that make the game in one single .js file which is already included in index.html. Moreover it will watch the files, so whenever something changes in any file, it will update the bundle. All you have to do is refresh the browser.
6. Open index.html in a browser of your choice (Google Chrome recomended).
7. Enjoy the game!

There are ten branches in the repo which name starts with a number, e.g.: 1-initial, 2-structure, etc. These are the branches that represents incremental work to implement the game. If you would like to check how parts of the game are written just 'git diff' two neighbour branches.

When you switch a branch make sure that webpack is running. Other way you won't receive the newest version of the files.

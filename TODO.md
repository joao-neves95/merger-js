# TODO:

- Solve bug where if the user chooses to build "All" files (on the source file selection prompt), the timer gets compromised and gives an error (asynchrony bug/feature);

- Add support for only typing the directory name to merge all its files (without any specific order);

- Add a mini package manager (a small extension to npm) and facilitate the addition of external libaries.

  Example: 
  
  // $import 'async'
  
  // $import 'jquery'
  
  // @import 'myFile'
  
  (the "$" token imports from node-module (npm default folder))

- TESTS;
- Add an edit source file command to the CLI;
- Add more validation and error handling to the CLI.

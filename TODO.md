# TODO

- Add support for importing an entire directory of files inside node_modules (``` // $import<<DIR 'dirInsideNodeModules/' ```);

- Solve bug where, in non-minified builds, if the last line of a file ends with a comment it comments out the first line of the next file. (Add a new line ("\n") after each file data).

- (Bug) Block attempts to import directories inside directories that are beeing imported;

- In "merger add" ask the user if he is on the header file directory and if so, give him a drop down menu with all the files in that directory;

- Solve bug where its added "\ufeff" unicode characters on the build/read files process. No interpreter errors though (Char encoding Node.js issue. Use "strip-bom" package on the next release);

- TESTS;
- Add an edit source file command to the CLI;
- Add more validation and error handling to the CLI.

--------------------------------------------------------------------------------------------------------------------------
### Proposals:


--------------------------------------------------------------------------------------------------------------------------

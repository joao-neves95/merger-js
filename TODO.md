# TODO

- Add support for importing an entire directory of files inside node_modules (``` // $import<<DIR 'dirInsideNodeModules/' ```);

- Block attempts to import directories inside directories that are beeing imported (bug);

- Solve bug where its added "\ufeff" unicode characters on the build/read files process. No interpreter errors though (Char encoding Node.js issue. Use "strip-bom" package on the next release);

- TESTS;
- Add an edit source file command to the CLI;
- Add more validation and error handling to the CLI.

--------------------------------------------------------------------------------------------------------------------------
### Proposals:

- Make a MergerJS plugin for Visual Studio Code (start/stop).

--------------------------------------------------------------------------------------------------------------------------

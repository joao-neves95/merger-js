# TODO

- Add support for importing entire directories (without any specific order);

- Fix the github imports. Bug with the bars ('/twbs/bootstrap/v4-dev/dist/js/bootstrap.min.js' / 'twbs/bootstrap/v4-dev/dist/js/bootstrap.min.js');

- Solve bug where its added "\ufeff" unicode characters on the build/read files process. No interpreter errors though (Char encoding Node.js issue. Use "strip-bom" package on the next release);

- TESTS;
- Add an edit source file command to the CLI;
- Add more validation and error handling to the CLI.

--------------------------------------------------------------------------------------------------------------------------
### Proposals:

- Add the import directory sintax: 
  * ``` @import<<dir './someDirRelativeToThisFile' ``` or ``` // @<<dir '../models' ```.
--------------------------------------------------------------------------------------------------------------------------

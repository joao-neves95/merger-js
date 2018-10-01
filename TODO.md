# TODO

- Add support for importing a **file** from an URL (the file is stored in the node_modules folder);

- Add support for importing entire directories (without any specific order);

- Solve bug where if the user chooses to build "All" files (on the source file selection prompt), the timer gets compromised and gives an error (asynchrony bug/feature);

- Solve bug where its added "\ufeff" unicode characters somewhere on the build process. No interpreter errors though (char encoding issue(?) change from "utf-8" to "utf-8-sig");

- TESTS;
- Add an edit source file command to the CLI;
- Add more validation and error handling to the CLI.

--------------------------------------------------------------------------------------------------------------------------
### Proposals:

- Add support for importing a file from an URL (the file is stored in the node_modules folder):
  * "%import": Imports from a specific URL, provided by the user (a cdn for example);
  * "%import<<gh" or "%import<<GH" or "%import<<github": Import a file from GitHub.</br>
  E.g.: " // %import<<gh '\<user\>/\<repository-name\>/\<path-to-file\>' ";
  * "%import<<bb" or "%import<<BB" or "%import<<bitbucket: Import a file from BitBucket.

- Add the import directory sintax: 
  * " @import<<dir './someDirRelativeToThisFile' " or "// @<<dir '../models' ".
--------------------------------------------------------------------------------------------------------------------------

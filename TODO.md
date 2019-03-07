# TODO

- Add the new configuration properties to the config model;

- Add support for importing files with imports;

- When checking if a file already exists before downloading it, check its contents to see if it's '404: Not Found\n'. If it is download it again;

- Clean up the fileDownloader module;

- Add support for importing an entire directory of files inside node_modules (``` // $import<<DIR 'dirInsideNodeModules/' ```);

- Add support for importing an entire directory of files from GitHub (``` // %import<<GH<<DIR 'dirFromGithub/' ```);

- In "merger add" ask the user if he is on the header file directory and if so, give him a drop down menu with all the files in that directory;

- Add an edit source file command to the CLI;

- Add more validation and error handling to the CLI;

- Add contributing guidelines;

- TESTS;

--------------------------------------------------------------------------------------------------------------------------
### Proposals:

- Add support for plugins (???);

- A desktop app, similar to WinLess.

--------------------------------------------------------------------------------------------------------------------------

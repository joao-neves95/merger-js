## MergerJS JavaScript Style Guide

&nbsp;

## Files

All files **must** start with the **MergerJS** copyright information as a comment,
with the exception of the ***merger.js*** file which must start with
`#!/usr/bin/env node` before the copyrigth information.

### Naming:
Filenames must be [`camelCase`](https://en.wikipedia.org/wiki/Camel_case).

### Encoding:
[UTF-8](https://en.wikipedia.org/wiki/UTF-8)

### Whitespace:
- Use **spaces**, not tabs.
- Lines ([line breaks](https://en.wikipedia.org/wiki/Newline)) should end in `LF` characters (UNIX)
  and not `CRLF` (Windows).

&nbsp;

## Code Formating

## Identation:
Use two (2) spaces.

## Semicollons:
All expresions **must** end with a semicollon.

Example:

`
doThis();
`

`
const PI = 3.14;
`

### Variables and Contants:

- `const`
Constant names **must** have the `PASCAL_ALL_CAPS` style.
In case their are constant variables from function call values, they *must* have the `camelCase` style.

- `let`
Variables **must** have the `camelCase` style.

- Variables and constants **should** have JSDoc
  ([Official specification](https://jsdoc.app/index.html),
  [Wikipedia](https://en.wikipedia.org/wiki/JSDoc)) documentation, when suited,
  or if you this it will improve the readability of the code (I.e: type).

### String:
You **should** use single quotes ` const MESSAGE = 'Hello World!'; `.

### Spacing:
You **must** insert a space after opening and before closing non-empty parenthesis.

Example:

`
doThis( 'with this string' );
`

### Braces:
Braces **must** be used in all controll structures (i.e. if, else, for, do, while, as well as any others),
even if the body contains only a single statement.

Example:

```js
if ( something ) {
  doThis( 'now' );
}
```

### Conditionals:
The `else` statement **must** be separated by an extra line break.

Example:

```js
if ( isNight ) {
  console.log( 'Good night!' );

} else {
  console.log( 'Good day!' );
}
```

### Classes:
- Classes **must** have `PascalCase` as naming style.
- Properties **must** have `camelCase` naming style.
- Private properties (properties that will be used only by that class)
  **must** start with four (4) undescores characters in their name
  (see example in "Functions").

### Functions
- Functions **must** have the `camelCase` naming convention.
- Private functions (internal functions in a class or module)
  **should** start with four (4) undescores characters in their name:

  `const ____privateFunction = ...`

- Functions **must** have JSDoc
  ([Official specification](https://jsdoc.app/index.html), [Wikipedia](https://en.wikipedia.org/wiki/JSDoc)) documentation.
- Functions **must** follow the ES arrow function syntax and use the `const` keyword when they are
  a defenition and not part of an object.
- Parameters **must** have parenthesis, even if the function only has one parameter.
- Lambdas **must** have braces, even if there is only only one expression inside the function.

Example:

```js
/**
 * Description of the function and what it returns.
 *
 * @param { string } withThis Description of the parameter.
 *
 * @returns { void }
 */
const doThis = ( withThis ) => {
  console.log( withThis );
};
```

### Don't do things like this:

```js
// No:
listArray[listSize++] = it;

// Yes:
listArray[listSize + 1] = it;
++listsSize;
```

---

After following these style conventions, you should also follow the Airbnb style guide:
https://github.com/airbnb/javascript

---

***This document may change in the future.***

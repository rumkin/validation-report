# Validation Report

Unified validation report interface. It specifies interface for the validation
issues reporting and issues interface. This "low level" library is for
creating validators also it could be used with manual validation.

![Build](https://img.shields.io/travis/rumkin/validation-report.svg)

---

## Installation

Install via npm:
```bash
npm i validation-report
```

## Usage

Validation report is a collection of objects which contains validation result
data (issues). Each issue has `path`, `rule` and `details` properties.

Example of issues:

```javascript
{
    path: ['images', 0, 'title'],
    rule: 'required',
    details: {},
}

{
    path: ['user', 'age'],
    rule: 'min',
    details: {should: 18, is: 16},
}

{
    path: ['file.js'],
    rule: 'syntax',
    details: {line: 0, pos: 0, lang: 'javascript', is: '%'},
}
```

Such objects are very simple to send, process or stringify.

### Path: string[]

Path is array to allow any characters (including dots, slashes or other separators) as property name.

### Rule: string

Validation rule code unique across your application.

### Details: object

Custom data object representing error data.

## Example

Let create simple one function number validator:

```javascript
const Report = require('validation-report');

function checkNumber(value) {
    const report = new Report();

    if (typeof value !== 'number') {
        report.addIssue({
            rule: 'type',
            details: {
                should: 'number',
                is: typeof value,
            },
        });
    }

    return report;
}

const report = checkNumber(null);

if (report.hasIssues()) {
    console.log('Looks like it is not a Number');
    const issue = report.findIssue(); // => {path: [], issue: 'type', details: {should: 'number', is: 'object'}}
}

```

## Example for Express

Create and use report without validator in express:

```javascript
const Report = require('validation-report');
const express = require('express');

express()
    .use((req, res, next) => {
        let report = new Report({
            value: req.query,
        });

        if ('id' in req.query === false) {
            report.addIssue('id', 'exists');
        }
        else if (req.query.id.length != 24) {
            report.addIssue('id', 'length', {
                accept: 32,
                result: req.query.id.length,
            });
        }

        if (! report.isValid()) {
            res.status(400)
            .json({
                code: 'validation',
                error: 'Request validation error',
                details: {issues: report},
            });
        }
        else {
            // do something...
            res.end();
        }
    })
```

## API

### constructor({issues:ReportIssue[], value: * }) -> Report

Constructor accepts an object as an only argument. This object could
provides validating `value` and array of `issues`.

### setIssues(issues:ReportIssue[]) -> Report

Add a list of issues.

### getIssues() -> ReportIssue[]

Return an array of issues.

### addIssue(issue:ReportIssue) -> Report

Add an issue.

### hasIssue(path:string|string[]) -> Boolean

Check is issue exists by it's path. If path is a string separate it with '.'.

### findIssue(path:function(reportIssue) -> Bool|string|string[], [rule]) -> ReportIssue

Search issue with function or by path or by path and rule. Returns
ReportIssue or undefined if issue not found.

### isValid() -> Boolean

Check if report contains no issues and it's value is valid.

### toJSON() -> ReportIssue[]

Return array of report issues.

### License

MIT.

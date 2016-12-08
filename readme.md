# Validation Report

Unified validation report interface. It specifies interface for the validation
issues reporting and issues interface.

![Build](https://img.shields.io/travis/rumkin/validation-report.svg)

---

## Installation

Install via npm:
```bash
npm i validation-report
```

## Example

Create and use report without validator in express:

```javascript
const ValidationReport = require('validation-report');
const express = require('express');

express()
    .use((req, res, next) => {
        let report = new ValidationReport({
            value: req.query,
        });

        if ('id' in req.query === false) {
            report.addIssue({
                path: ['id'],
                rule: 'exists',
            });
        }
        else if (req.query.id.length != 24) {
            report.addIssue({
                path: ['id'],
                rule: 'length',
                details: {
                    accept: 32,
                    result: req.query.id.length,
                },
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

### isValid() -> Boolean

Check if report contains no issues and it's value is valid.

### toJSON() -> ReportIssue[]

Return array of report issues.

### License

MIT.

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

'use strict';

module.exports = Report;

/**
 * @typedef {object} ReportIssue
 * @property {strng|string[]} path Issue path as an array of keys of dot delimited path.
 * @property {string} rule Failed rule name.
 * @property {ReportIssueDetails} [details] Validation details.
 */

/**
 * @typedef {object} ReportIssueDetails
 * @property {*} [value] Value caused an issue.
 * @property {*} [accept] Value that is acceptable.
 * @property {*} [reason] The cause of the error.
 */

/**
 * Validation report object.
 *
 * @param {{issues:object[],value:*}} options Validation report params.
 * @constructor
 */
function Report(options) {
    options = options || {};
    this.issues = [];
    this.setIssues(options.issues || []);
    this.setValue(options.value);
    this.checks = 0;
}

/**
 * Check if report has no issues.
 * @return {boolean}
 */
Report.prototype.isValid = function () {
    return this.issues.length === 0;
};

/**
 * Check if report has some issues.
 * @return {boolean}
 */
Report.prototype.hasIssues = function () {
    return this.issues.length !== 0;
};

/**
 * Add issue to issue list.
 *
 * @param  {ReportIssue} issue Issue object.
 */
Report.prototype.addIssue = function (issue) {
    if (arguments.length > 1) {
        issue = {
            path: issue,
            rule: arguments[1],
            details: arguments[2],
        };
    }

    else {
        if (! isObject(issue)) {
            throw new Error('Issue should be an object');
        }
    }

    if (! issue.hasOwnProperty('path')) {
        issue.path = [];
    }

    if (typeof issue.path === 'string') {
        issue.path = issue.path.split('.');
    }

    if (! Array.isArray(issue.path)) {
        throw new Error('Path should be an array');
    }

    if (typeof issue.rule !== 'string') {
        throw new Error('Issue should has "rule" property');
    }

    this.issues.push(deepCopy(issue));
};

/**
 * Check if report has a specified issue.
 *
 * @param  {string|string[]}  path Array of keys or path koined with a dot.
 * @return {boolean}      Return true if there is at list one issue.
 */
Report.prototype.hasIssue = function(path) {
    if (this.isValid()) {
        return false;
    }

    let p;
    if (Array.isArray(path)) {
        p = path.join('.');
    }
    else {
        p = path;
    }

    for (let issue of this.issues) {
        if (issue.path.join('.') === p) {
            return true;
        }
    }

    return false;
};

/**
 * Get issues.
 *
 * @return {array} Array with issues.
 */
Report.prototype.getIssues = function () {
    return this.issues.slice();
};

/**
 * Set issues.
 *
 * @param  {ReportIssue[]} issues Array of issues.
 * @return {Report} Return this.
 */
Report.prototype.setIssues = function (issues) {
    issues.forEach((issue) => {
        this.addIssue(issue);
    });

    return this;
};

/**
 * Set value.
 *
 * @private
 * @param  {*} value Validation report target value.
 * @return {Report} Return this.
 */
Report.prototype.setValue = function (value) {
    this.value = value;
    return this;
};

/**
 * Report converts to JSON as array of issues.
 *
 * @return {array} Array of issues.
 */
Report.prototype.toJSON = function () {
    return this.getIssues();
};

/**
 * Check if type is an object and not null.
 *
 * @param  {*}  value Value to check
 * @return {Boolean}  True if object is not null and it's type is an object.
 */
function isObject(value) {
    return value !== null && typeof value === 'object';
}

/**
 * Deep copy js objects and arrays. Function doesn't copy custom function
 * instances and functions itself.
 *
 * @param  {*} value Any value.
 * @return {*}       Return copy of passed value.
 */
function deepCopy(value) {
    if (! isObject(value)) {
        return value;
    }

    if (Array.isArray(value)) {
        return value.map(deepCopy);
    }
    else if (value.constructor !== Object) {
        if (typeof value.clone === 'function') {
            return value.clone();
        }
        else {
            return value;
        }
    }
    else {
        return Object.getOwnPropertyNames(value)
        .reduce(function (result, prop) {
            result[prop] = deepCopy(value[prop]);
            return result;
        }, {});
    }
}

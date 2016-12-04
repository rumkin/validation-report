'use strict';

module.exports = Report;

/**
 * @typedef {object} ReportIssue
 * @property {string[]} path issue path.
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
 * Add issue to issue list.
 *
 * @param  {ReportIssue} issue Issue object.
 */
Report.prototype.addIssue = function (issue) {
    if (issue === null || typeof issue !== 'object') {
        throw new Error('Issue should be an object');
    }

    if (! Array.isArray(issue.path)) {
        issue.path = [];
    }

    this.issues.push(issue);
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
        this.setIssue(issue);
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

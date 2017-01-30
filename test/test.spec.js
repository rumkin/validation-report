'use strict';

const should = require('should');
const Report = require('..');

describe('Validation Report', () => {
    it('Should be valid after createion', () => {
        let report = new Report();

        should(report.hasIssue()).be.equal(false);
        should(report.isValid()).be.equal(true);
    });

    it('Should add issues with constructor', () => {
        let report = new Report({
            issues: [{
                path: ['username'],
                rule: 'uniq',
                accept: true,
                result: false,
            }],
        });

        should(report.hasIssue('username')).be.equal(true);
        should(report.isValid()).be.equal(false);
    });

    it('Should has issues', () => {
        let report = new Report();

        report.addIssue({
            path: ['username'],
            rule: 'uniq',
            accept: true,
            result: false,
        });

        should(report.hasIssue('username')).be.equal(true);
        should(report.isValid()).be.equal(false);
    });

    it('Should add issues', () => {
        let report = new Report();

        report.addIssue('user.name', 'uniq', {
            accept: true,
            result: false,
        });

        should(report.hasIssue('user.name')).be.equal(true);
        should(report.hasIssues()).be.equal(true);
    });

    it('Should has no missed issue', () => {
        let report = new Report();

        report.addIssue({
            path: ['username'],
            rule: 'uniq',
            accept: true,
            result: false,
        });

        should(report.hasIssue('usernameX')).be.equal(false);
    });

    it('Should return issues', () => {
        let report = new Report();
        let issue = {
            path: ['username'],
            rule: 'uniq',
        };

        report.addIssue(issue);

        let issues = report.getIssues();

        should(issues).be.instanceOf(Array);
        should(issues).have.lengthOf(1);
        should(issues[0]).be.deepEqual({
            path: ['username'],
            rule: 'uniq',
        });
    });

    it('Should set empty path', () => {
        let report = new Report();
        let issue = {
            rule: 'uniq',
        };

        report.addIssue(issue);

        let issues = report.getIssues();

        should(issues).be.instanceOf(Array);
        should(issues).have.lengthOf(1);
        should(issues[0]).be.deepEqual({
            path: [],
            rule: 'uniq',
        });
    });
});

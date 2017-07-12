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

    describe('findIssue()', () => {
        it('Should get issue by path', () => {
            const report = new Report();

            report.addIssue(['user'], 'string');
            report.addIssue(['age'], 'number');

            const issue = report.findIssue('age');

            should(issue).not.equal(undefined);
            should(issue).be.instanceOf(Object);

            should(issue).ownProperty('path')
            .which.deepEqual(['age']);

            should(issue).ownProperty('rule')
            .which.equal('number');
        });

        it('Should get issue by path and rule name', () => {
            const report = new Report();

            report.addIssue(['children'], 'number');
            report.addIssue(['age'], 'number');

            const issue = report.findIssue('age', 'number');

            should(issue).not.equal(undefined);
            should(issue).be.instanceOf(Object);

            should(issue).ownProperty('path')
            .which.deepEqual(['age']);

            should(issue).ownProperty('rule')
            .which.equal('number');
        });

        it('Should search items useing method', () => {
            const report = new Report();

            report.addIssue(['images', 0, 'size'], 'number');
            report.addIssue(['images', 0, 'path'], 'string');

            const issue = report.findIssue((issue) =>
                issue.path.slice(0, 2).join('.') === 'images.0'
            );

            should(issue).not.equal(undefined);
            should(issue).be.instanceOf(Object);

            should(issue).ownProperty('path')
            .which.deepEqual(['images', 0, 'size']);

            should(issue).ownProperty('rule')
            .which.equal('number');
        });
    });
});

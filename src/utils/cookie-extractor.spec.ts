'use strict';
import { expect } from 'chai';
import 'mocha';
import {CookieExtractor} from './cookie-extractor';

describe('test cookieExtractor class', () => {
    it('when empty cookie', () => {
        const testData: string[] = [];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(false);

        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('');
    });
    it('return empty when cookie not in list', () => {
        const testData: string[] = [
            'foo=bar; bar=foo'
        ];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(false);
        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('');
    });
    it('return all cookie in list', () => {
        const testData: string[] = [
            'PHPSESSID=bar;',
            'uid=foo;',
            'pid=baz;',
            'cid=faa;',
        ];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(true);
        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('PHPSESSID=bar; uid=foo; pid=baz; cid=faa');
    });
    it('not return cookie deleted', () => {
        const testData: string[] = [
            'PHPSESSID=bar;',
            'uid=deleted;'
        ];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(false);
        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('PHPSESSID=bar');
    });
    it('return cookie with value not deleted', () => {
        const testData: string[] = [
            'PHPSESSID=deleted;',
            'PHPSESSID=bar;',
            'PHPSESSID=deleted;',
        ];
        const isGoodCookies = CookieExtractor.isContainAllCookies(testData);
        expect(isGoodCookies).to.equal(false);
        const result = CookieExtractor.getCookiesString(testData);
        expect(result).to.equal('PHPSESSID=bar');
    });
});

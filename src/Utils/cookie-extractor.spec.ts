'use strict';
import { expect } from 'chai';
import 'mocha';
import {CookieExtractor} from './cookie-extractor';

describe('test cookieExtractor class', () => {
    it('when empty cookie', () => {
        const result = CookieExtractor.getCookiesString([]);
        expect(result).to.equal('');
    });
    it('return empty when cookie not in list', () => {
        const result = CookieExtractor.getCookiesString([
            'foo=bar; bar=foo'
        ]);
        expect(result).to.equal('');
    });
    it('return all cookie in list', () => {
        const result = CookieExtractor.getCookiesString([
            'PHPSESSID=bar;',
            'uid=foo;',
            'pid=baz;',
            'cid=faa;',
        ]);
        expect(result).to.equal('PHPSESSID=bar; uid=foo; pid=baz; cid=faa');
    });
    it('not return cookie deleted', () => {
        const result = CookieExtractor.getCookiesString([
            'PHPSESSID=bar;',
            'uid=deleted;'
        ]);
        expect(result).to.equal('PHPSESSID=bar');
    });
    it('return cookie with value not deleted', () => {
        const result = CookieExtractor.getCookiesString([
            'PHPSESSID=deleted;',
            'PHPSESSID=bar;',
            'PHPSESSID=deleted;',
        ]);
        expect(result).to.equal('PHPSESSID=bar');
    });
});

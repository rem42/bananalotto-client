'use strict';
import { expect } from 'chai';
import 'mocha';
import {Grid} from './grid';

describe('test cookieExtractor class', () => {
    it('when empty cookie', () => {
        const result = Grid.generate;
        expect(result).length(17);

        const countDash = result.match(/-/g)!.length;
        expect(countDash).to.equal(5);
    });
});

import * as cheerio from 'cheerio';
import * as https from 'https';
import * as querystring from 'querystring';
import {Credentials} from '../Model/credentials';
import {User} from '../Model/user';
import {CookieExtractor} from '../Utils/cookie-extractor';
import {BananalottoUri, ClientUri} from '../Config/bananalotto-uri';
import {Grid} from '../Utils/grid';

export class BananalottoClient {
    protected get options() {
        return {
            headers: {},
            hostname: this.uri.host,
            method: 'GET',
            path: '',
        };
    }

    public static init(credentials: Credentials, uri: ClientUri = new BananalottoUri()): Promise<BananalottoClient> {
        const bananalotto = new BananalottoClient(uri);
        return bananalotto.connect(credentials);
    }
    protected cookies?: string;
    protected token?: string;

    protected constructor(protected readonly uri: ClientUri) {}

    public userInformation(path = this.uri.playUri, tryRequest = 0): Promise<User> {
        const options = this.options;
        options.path = path;
        options.headers = {
            Cookie: this.cookies,
        };

        return new Promise<User>((resolve, reject) => {
            const request = https.request(options, (response) => {
                response.setEncoding('utf8');
                let body = '';
                response.on('data', (chuck) => body += chuck);
                response.on('end', () => {
                    if (response.statusCode !== 200 && tryRequest === 1) {
                        return reject('cannot access to the url');
                    }
                    if (response.statusCode !== 200) {
                        return this.userInformation(this.uri.winnerUri, tryRequest + 1).then((userWinner: User) => {
                            return resolve(userWinner);
                        });
                    }
                    const user = new User();
                    const $ = cheerio.load(body);

                    const img = $('.play-summary img').attr('src').match(/([0-9]+)\.gif/);
                    if (img !== null) {
                        user.grid = Number(img[1]);
                    }

                    const member = $('#member-info');
                    user.address = member.data('address');
                    user.address2 = member.data('address2');
                    user.birthdate = member.data('birthdate');
                    user.city = member.data('city');
                    user.email = member.data('email');
                    user.firstname = member.data('firstname');
                    user.ip = member.data('ip');
                    user.lastname = member.data('lastname');
                    user.id = member.data('mid');
                    user.signupDate = member.data('signupdate');
                    user.tel = member.data('tel');
                    user.zip = member.data('zip');

                    const stats = $('.account-summary');
                    user.cash = $(stats[0]).text();
                    user.point = $(stats[1]).text();

                    resolve(user);
                });
            });
            request.on('error', (err) => reject(err));
            request.end();
        });
    }

    public fetchGrid(): Promise<boolean> {
        const options = this.options;
        options.path = this.uri.playUri;
        options.method = 'GET';
        options.headers = {
            Cookie: this.cookies,
        };

        return new Promise<boolean>((resolve, reject) => {
            const request = https.request(options, (response) => {
                response.setEncoding('utf8');
                let body = '';
                response.on('data', (chuck) => {
                    body += chuck;
                    const $ = cheerio.load(body);
                    this.token = $('#gridBtn').data('token');
                });
                response.on('end', () => resolve(true));
            });
            request.on('error', (err) => reject(err));
            request.end();
        });
    }

    public postGrid(): Promise<boolean> {
        const options = this.options;
        options.path = this.uri.gridUri;
        options.method = 'POST';
        const postData = querystring.stringify({
            'favoris': 'false',
            'grid-token': this.token,
            'liste': Grid.generate,
        });
        options.headers = {
            'Content-Length': postData.length,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': this.cookies,
        };

        return new Promise<boolean>((resolve, reject) => {
            const request = https.request(options, (response) => {
                response.setEncoding('utf8');
                let body = '';
                response.on('data', (chuck) => body += chuck);
                response.on('end', () => resolve(!!body));
            });
            request.on('error', (err) => reject(err));
            request.write(postData);
            request.end();
        });
    }

    protected connect(credentials: Credentials): Promise<BananalottoClient> {
        const postData = querystring.stringify({
            email: credentials.email,
            pass: credentials.password,
        });

        const options = this.options;
        options.path = this.uri.connectUri;
        options.method = 'POST';
        options.headers = {
            'Content-Length': postData.length,
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        return new Promise<BananalottoClient>((resolve, reject) => {
            const request = https.request(options, (response) => {
                if (response.headers['set-cookie'] === undefined ||
                    !CookieExtractor.isContainAllCookies(response.headers['set-cookie'] as string[])) {
                    reject('set-cookie empty');
                }

                this.cookies = CookieExtractor.getCookiesString(response.headers['set-cookie'] as string[]);

                response.on('data', () => resolve(this));
                response.on('end', () => resolve(this));
            });
            request.on('error', (err) => reject(err));
            request.write(postData);
            request.end();
        });
    }
}

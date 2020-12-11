import axios from 'axios';
import tough = require('tough-cookie');
import axiosCookieJarSupport from 'axios-cookiejar-support';
import {User} from './model/user';
import {Grid} from './utils/grid';
import * as cheerio from 'cheerio';
import * as querystring from 'querystring';
import {CookieExtractor} from './utils/cookie-extractor';

export class Bananalotto {
    private uri = {
        connect: '/include/login.php',
        playUri: '/play.php',
        gridUri: '/urlCdv.php'
    }

    private axiosInstance = axios.create({
        baseURL: 'https://www.bananalotto.fr',
        withCredentials: true,
    });
    private user?: User;

    private constructor(
        private email: string,
        private password: string
    ) {
        axiosCookieJarSupport(this.axiosInstance);
        this.axiosInstance.defaults.jar = new tough.CookieJar();
    }

    public static async init(email: string, password: string): Promise<Bananalotto>
    {
        const self = new Bananalotto(email, password);
        return await self.connect();
    }

    public async playGrid(): Promise<boolean>
    {
        return this.postGrid(await this.fetchGridToken());
    }

    private async fetchGridToken(): Promise<string>
    {
        return await this.axiosInstance.get(this.uri.playUri)
            .then(response => {
                const $ = cheerio.load(response.data);
                return $('#gridBtn').data('token');
            });
    }

    private async postGrid(token: string): Promise<boolean>
    {
        const postData = querystring.stringify({
            'favoris': 'false',
            'grid-token': token,
            'liste': Grid.generate,
        });
        const axiosConfig = {
            headers: {
                'Content-Length': postData.length,
                'Content-Type': 'application/x-www-form-urlencoded',
            }};
        return await this.axiosInstance.post(this.uri.gridUri, postData, axiosConfig)
            .then(response => {
                return response.status === 200
            });
    }

    public async userInformations(): Promise<User | undefined>
    {
        await this.axiosInstance.get(this.uri.playUri)
            .then(response => {

                const $ = cheerio.load(response.data);
                const user = new User();

                const img = $('.play-summary img').attr('src');
                if (img !== undefined) {
                    const gridFinder = img.match(/([0-9]+)\.gif/);
                    if (gridFinder) {
                        user.grid = Number(gridFinder[1]);
                    }
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

                this.user = user;
            });
        return this.user;
    }

    private async connect(): Promise<Bananalotto>
    {
        const postData = querystring.stringify({
            email: this.email,
            pass: this.password,
        });
        const axiosConfig = {
            headers: {
            'Content-Length': postData.length,
            'Content-Type': 'application/x-www-form-urlencoded',
        }};
        await this.axiosInstance.post(this.uri.connect, postData, axiosConfig)
            .then(response => {
                const cookies = response.headers['set-cookie'];
                if(cookies !== undefined || !CookieExtractor.isContainAllCookies(cookies)) {
                    this.axiosInstance.defaults.headers['Cookie'] = CookieExtractor.getCookiesString(cookies);
                }

                return response.status === 200
            });

        return this;
    }
}

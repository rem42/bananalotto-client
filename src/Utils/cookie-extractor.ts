export class CookieExtractor {
    public static isContainAllCookies(cookies: string[]): boolean {

        const cookieList: string[] = [];
        cookies
            .forEach((cookie) => {
                cookie
                    .split(';')
                    .forEach((cook) => {
                        const parts = cook.split('=');
                        const name = parts.shift()!.trim();
                        const value = decodeURI(parts.join('='));
                        if (
                            this.useFullCookies.includes(name) &&
                            value !== 'deleted'
                        ) {
                            cookieList.push(name);
                        }
                    });
            });

        return cookieList.length === 4;
    }

    public static getCookiesString(cookies: string[]): string {

        const cookieList: string[] = [];
        cookies
            .forEach((cookie) => {
                cookie
                    .split(';')
                    .forEach((cook) => {
                        const parts = cook.split('=');
                        const name = parts.shift()!.trim();
                        const value = decodeURI(parts.join('='));
                        if (
                            this.useFullCookies.includes(name) &&
                            value !== 'deleted'
                        ) {
                            cookieList.push(name + '=' + value);
                        }
                    });
            });

        return cookieList.join('; ');
    }
    private static readonly useFullCookies: string[] = [
        'PHPSESSID', 'uid', 'pid', 'cid',
    ];
}

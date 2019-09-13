export interface ClientUri {
    host: string;
    connectUri: string;
    playUri: string;
    winnerUri: string;
    gridUri: string;
}

export class BananalottoUri implements ClientUri {
    public host = 'www.bananalotto.fr';
    public connectUri = '/include/login.php';
    public playUri = '/play.php';
    public winnerUri = '/winners.php';
    public gridUri = '/urlCdv.php';
}

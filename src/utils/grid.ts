export class Grid {
    public static get generate(): string {
        const gridNumber = [
            '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
            '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
            '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
            '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
            '41', '42', '43', '44', '45', '46', '47', '48', '49',
        ];

        const list: string[] = [];

        do {
            const val = gridNumber[Math.floor(Math.random() * gridNumber.length)];
            if (!list.includes(val)) {
                list.push(val);
            }
        }while (list.length !== 6);

        return list.join('-');
    }
}

export class Settings {    
    settings: [string, any][] = [];

    get(name: string) {
        var existingSetting = this.settings.find(item => item[0] === name);
        if (existingSetting !== undefined && existingSetting !== null)
            return existingSetting[1];

        return "";
    }

    set(name: string, value: any) {
        var existingSetting = this.settings.find(item => item[0] === name);
        if (existingSetting === undefined || existingSetting === null)
            this.settings.push([name, value]);
        else
            existingSetting[1] = value;
    }
}

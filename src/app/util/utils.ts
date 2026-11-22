import { MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

export class Utils {
    static snackBarConfig(): MatSnackBarConfig {
        let snackConfig: MatSnackBarConfig = new MatSnackBarConfig();
        snackConfig.duration = 12000;
        snackConfig.panelClass = ['btn', 'btn-outline-dark'];
        snackConfig.verticalPosition = 'top';
        snackConfig.horizontalPosition = 'center';
        return snackConfig;
    }

    static openSnackBar(message: string, action: string, snackBar: MatSnackBar) {
        let snackConfig = Utils.snackBarConfig();
        snackBar.open(message, action, snackConfig);
    }

    static getMatDialogConf(): MatDialogConfig {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = true;
        dialogConfig.exitAnimationDuration = '1000ms';
        dialogConfig.enterAnimationDuration = '1000ms';

        dialogConfig.width = '90vh';
        dialogConfig.height = '80vh';
        dialogConfig.maxWidth = '100vh';
        return dialogConfig;
    }

    static async generateSHA256(txt: string): Promise<string> {
        var encoderr: TextEncoder = new TextEncoder();
        const txtBuffer = encoderr.encode(txt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', txtBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    static isSha256(txt: string): boolean {
        const sha256Regex = /^[0-9a-fA-F]{64}$/;
        return sha256Regex.test(txt);
    }

    static randomString(length: number) {
        var chars = ' 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_- ';
        var result = '';
        var index = this.randomInt(chars.length - 1)
        for (var i = length; i > 0; --i) result += chars[index];
        return result;
    }

    static randomSelect<Modelo>(array: Array<Modelo>, min: number = 0): Modelo {
        var index = this.randomInt(array.length - 1, min)
        var result = array[index];
        return result;
    }

    static randomInt(max: number, min: number = 0): number {
        var result = 0;
        result = Math.floor(Math.random() * max) | 0;
        if (result < min) result = min;
        return result;
    }
}

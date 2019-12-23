import { hash as bHash, compare as bCompare } from 'bcrypt';

export const hash = (text: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        bHash(text, 10, (err: Error, hashed: string): void => {
            if (err) {
                reject(err);
            } else
                resolve(hashed);
        });
    });
}


export const compare = (text: string, hash: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        bCompare(text, hash, (err: Error, res: boolean): void => {
            if (err) {
                reject(err);
            } else {
                resolve(res)
            }
        })
    });
}
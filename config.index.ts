import {writeFile} from 'fs';

import {name, version} from './package.json';

const targetPath = 'src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
    production: true,
    staging: false,
    devEnvironment: false,
    CODEREDEMPTIONSECRET: '${process.env.CODEREDEMPTIONSECRET}',
    STRIPESECRET: '${process.env.STRIPESECRET}',
    PATREONCLIENTID: '${process.env.PATREONCLIENTID}',
    PATREONCLIENTSECRET: '${process.env.PATREONCLIENTSECRET}',
    SQUARE_ETERNAL_MELEE_TICKETS: '${process.env.SQUARE_ETERNAL_MELEE_TICKETS}',
    SQUARE_SUPPORTER: '${process.env.SQUARE_SUPPORTER}',
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
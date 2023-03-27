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
    PATREONCLIENTSECRET: '${process.env.PATREONCLIENTSECRET}'
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
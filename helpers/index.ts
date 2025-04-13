import fs from 'fs';

import path from 'path';

export function recurseDir(
  dir: string,
  filter: (arg: string) => boolean,
  apply: VoidFunction,
) {
  const files = fs.readdirSync(dir);

  return files
    .map((file) => path.join(dir, file))
    .filter((file) => {
      const stats = fs.statSync(file);

      if (stats.isFile()) {
        return filter(file);
      }

      recurseDir(file, filter, apply);
      return false;
    })
    .forEach(apply);
}

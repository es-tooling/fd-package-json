import {packageUp, packageUpSync} from 'package-up';
import {up as empathic} from 'empathic/package';
import {findPackagePath, findPackagePathSync} from 'fd-package-json';
import {Bench} from 'tinybench';
import {join} from 'node:path';
import {styleText} from 'node:util';

const dirs = 'abcdefghij';
const depths = [1, 3, 5, 10];

for (const dep of depths) {
  const name = `${dep} depth${dep === 1 ? '' : 's'}`;
  const cwd = join(import.meta.dirname, 'fixture', ...dirs.substring(0, dep));
  const bench = new Bench({name, warmup: true});

  bench
    .add('package-up', async () => await packageUp({cwd}))
    .add('package-up (sync)', () => packageUpSync({cwd}))
    .add('empathic (sync)', () => empathic({cwd}))
    .add('fd-package-json', async () => await findPackagePath(cwd))
    .add('fd-package-json (sync)', () => findPackagePathSync(cwd));

  await bench.run();

  console.log(`# ${name}`);

  const table = bench.table();
  for (const row of table) {
    for (const prop in row) {
      const isName = prop === 'Task name';
      console.log(
        `${isName ? '-' : ' '} ${isName ? '' : `${prop}: `}${styleText(isName ? ['bold', 'underline'] : 'none', String(row[prop]))}`
      );
    }
  }

  console.log('');
}

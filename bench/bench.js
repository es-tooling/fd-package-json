import {packageUp, packageUpSync} from 'package-up';
import {up as empathic} from 'empathic/package';
import {findPackagePath, findPackagePathSync} from 'fd-package-json';
import {Bench} from 'tinybench';
import {join} from 'node:path';

function formatResult(task) {
  return `${task.name} × ${Math.round(task.result.throughput.mean).toString()} (ops/s) \xb1${task.result.throughput.rme.toFixed(2)}% (${task.result.samples.length} runs sampled)`;
}

const dirs = 'abcdefghij';
const depths = [1, 3, 5, 10];

depths.forEach(async (dep) => {
  const name = `${dep} depth${dep === 1 ? '' : 's'}`;
  const start = join(import.meta.dirname, 'fixture', ...dirs.substring(0, dep));
  const bench = new Bench({name});

  bench
    .add('package-up', async () => await packageUp(start))
    .add('package-up (sync)', () => packageUpSync(start))
    .add('empathic (sync)', () => empathic(start))
    .add('fd-package-json', async () => await findPackagePath(start))
    .add('fd-package-json (sync)', () => findPackagePathSync(start));

  await bench.run();

  console.log(`# ${name}`);
  bench.tasks.forEach((task) => console.log(formatResult(task)));
  console.log('');
});

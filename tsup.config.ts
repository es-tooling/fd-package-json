import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['./src/main.ts'],
  outDir: './lib',
  format: 'esm',
  minifyIdentifiers: true,
  bundle: true,
  dts: true,
  clean: true
});

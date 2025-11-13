import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['./src/main.ts'],
  outDir: './lib',
  format: 'esm',
  minify: true,
  bundle: true,
  dts: true,
  clean: true
});

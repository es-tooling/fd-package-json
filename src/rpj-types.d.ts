declare module 'read-package-json-fast' {
  export default function rpj(
    path: string
  ): Promise<Record<string, unknown> | null>;
}

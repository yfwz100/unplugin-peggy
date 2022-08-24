import { createUnplugin } from 'unplugin';
import { generate, SourceBuildOptions } from 'peggy';
import { SourceMap } from 'rollup';

/**
 * The options for Peggy.
 */
export type PeggyParserConfig = SourceBuildOptions<'source' | 'source-and-map'>;

/**
 * The plugin config.
 */
export type PeggyPluginConfig = {
  includes: (id: string) => boolean;
  options: PeggyParserConfig;
};

function includingSourceMap(
  opt?: PeggyParserConfig
): opt is SourceBuildOptions<'source-and-map'> {
  return opt?.output === 'source-and-map';
}

function isSourceOnly(
  opt?: PeggyParserConfig
): opt is SourceBuildOptions<'source'> {
  return opt?.output === 'source';
}

/**
 * Default peggy options.
 */
const defaultPeggyOptions: SourceBuildOptions<'source'> = {
  output: 'source',
  format: 'es',
};

/**
 * The unified plugin interface for build tools.
 *
 * It expose several properties that you can pick the one that fits your build tools to use.
 */
export default createUnplugin((config?: Partial<PeggyPluginConfig>) => {
  const transformInclude =
    config?.includes ??
    ((id: string) => id.endsWith('.pegjs') || id.endsWith('.peggy'));
  return {
    name: 'peggy-unplugin',
    transformInclude,
    transform(code) {
      const opt = { ...defaultPeggyOptions, ...config?.options };
      if (includingSourceMap(opt)) {
        const sourceNode = generate(code, opt).toStringWithSourceMap();
        return {
          code: sourceNode.code,
          map: sourceNode.map.toJSON() as SourceMap, // FIXME here should be SourceMapInput, annotated improperly in unplugin.
        };
      }
      if (isSourceOnly(opt)) {
        return {
          code: generate(code, opt),
        };
      }
      return undefined;
    },
  };
});

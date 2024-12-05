import {
  getObjectFromJsonFile,
  getRollupInputFromDirectory,
  setPathForAssetsFiles
} from "./system/actions";
import { defineConfig, loadEnv } from 'vite';
import { UserConfig } from 'vite';
import { resolve } from "path";
import viteHandlebars from "./system/plugins/vite-handlebars";
import liveReload from 'vite-plugin-live-reload'
import viteRewriteUrlInCss from "./system/plugins/vite-rewrite-url-in-css";
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

interface EnvFile {
  MODE: "development" | "production"
  PORT: string
  HOST: string
  PAGE_NAME: string
  VITE_MINIFIED: string
}
export default defineConfig( ( configEnv ) => {
  const { mode } = configEnv;

  // @ts-ignore
  const env = loadEnv( mode, process.cwd(), '' ) as EnvFile

  const isDev = mode === 'development'
  const pageName = env.PAGE_NAME ?? 'main'
  const minify = env.VITE_MINIFIED !== 'false'

  const userConfig: UserConfig  = {
    plugins: [
      liveReload( resolve(__dirname, 'src') ),
      viteHandlebars({ partialsDir: resolve(__dirname, 'src', 'templates') }),
      viteRewriteUrlInCss({ paths: { '/media': './media', '/fonts': './fonts' } }),
      createSvgIconsPlugin( {
        iconDirs: [ resolve( __dirname, 'public', 'assets', 'media', 'icons' ) ],
        symbolId: '[name]',
        svgoOptions: {
          plugins:
            [
              {
                name: 'removeAttrs',
                params: {
                  attrs: [ 'class', 'data-name', 'fill', 'stroke' ],
                },
              },
            ],
        },
      } ),
    ],
    base: './',
    server: {
      cors: false,
      strictPort: true,
      port: +env.PORT,
      hmr: true,
      watch: {
        usePolling: true,
      }
    },
    build: {
      outDir: resolve(__dirname, 'dist'),
      rollupOptions: {
        input: getRollupInputFromDirectory(resolve(__dirname, 'pages')),
        output: {
          entryFileNames: 'assets/js/[name].[hash].js',
          chunkFileNames: 'assets/js/[name].[hash].js',
          assetFileNames: setPathForAssetsFiles,
          manualChunks( id ) {
            if ( id.includes( 'node_modules' ) ) {
              let vendorName = id
                .split(new RegExp('\\S+node_modules([\/|\\\\])', 'g'))
                .slice(-1)[0]
                .split(new RegExp('([\/|\\\\])', 'g'))[0];

              return `vendors-${vendorName}`;
            }
          },
        }
      },
      minify
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    },
    resolve: {
      alias: {
        "/src": resolve(process.cwd(), "src"),
        "cssCore": resolve(__dirname, 'src', 'common', 'styles', 'settings', 'settings.scss'),
        "@": resolve(__dirname, 'src'),
        "@common": resolve(__dirname, 'src', 'common'),
        "@layouts": resolve(__dirname, 'src', 'templates', 'layouts'),
        "@sections": resolve(__dirname, 'src', 'templates', 'sections'),
        "@shared": resolve(__dirname, 'src', 'templates', 'shared'),
        "@media": resolve(__dirname, 'public', 'assets', 'media'),
        "@fonts": resolve(__dirname, 'public', 'assets', 'fonts'),
        "@js": resolve(__dirname, 'src', 'js'),
      },
    },
    define: {
      BREAKPOINTS: getObjectFromJsonFile(resolve(__dirname, 'src', 'common', 'styles', 'settings', 'breakpoints.json'))
    }
  }

  if ( isDev ) {
    userConfig.root = `pages/${pageName}`
    userConfig.publicDir = '../../public'
  }

  return userConfig;
})
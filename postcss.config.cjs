const path = require( 'path' )
const { loadEnv } = require( "vite" );

const env = loadEnv( 'development', process.cwd(), '' )
const minify = env.VITE_MINIFIED === 'true'

const settingsJsonFiles = [
    'breakpoints.json',
    'container.json',
    'text-crop.json',
    'main-settings.json',
    'typography.json'
]

const mapsOptions = {
    basePath: 'src',
    maps: settingsJsonFiles.map( fileName => path.resolve( __dirname, 'src', 'styles', 'settings', fileName ) )
}

const mixinsOptions = {
    mixins: {
        minMaxFontSize: function ( rule, min, max, minScreen = 375, maxScreen = 1920 ) {
            const newValue = 'clamp(' +
                `${ min }px, calc(${ min }px + (${ max } - ${ min }) * ` +
                `((100vw - ${ minScreen }px) / (${ maxScreen } - ${ minScreen }))), ${ max }px` +
                ')'
            rule.replaceWith( { prop: 'font-size', value: newValue } );
        },
        size: function ( rule, value1, value2 = null ) {
            rule.replaceWith(
                { prop: 'width', value: `${ value1 }px` },
                { prop: 'height', value: value2 !== null ? `${ value2 }px` : `${ value1 }px` }
            );
        },
    }
}

const plugins = [
    require( 'postcss-simple-vars' ),
    require( 'postcss-sassy-mixins' )( mixinsOptions ),
    require( 'postcss-map' )( mapsOptions ),
    require( 'postcss-each' ),
    require( 'postcss-nested' ),
    require( 'postcss-preset-env' )( {
        features: {
            'custom-properties': false,
        }
    } ),
    require( 'postcss-combine-duplicated-selectors' ),
    require( 'postcss-sort-media-queries' ),
]

if ( minify ) {
    plugins.push( require( 'cssnano' ) )
}

module.exports = { plugins }
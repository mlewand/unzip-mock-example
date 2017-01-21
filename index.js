require( 'isomorphic-fetch' );

const fetchMock = require( 'fetch-mock' ),
	fsp = require( 'fs-promise' ),
	unzip = require( 'unzip' ),
	rimraf = require( 'rimraf-then' ),
	path = require( 'path' );

let zipLink = 'https://github.com/stevemao/left-pad/archive/master.zip',
	out = 'left-pad-master';

// Careful: lib might might be removed at any moment.
fetchMock.get( zipLink,
	fsp.createReadStream( path.join( __dirname, 'left-pad-master.zip' ) ) );

rimraf( out )
	.then( () => fetch( zipLink ) )
	.then( response => {
		return new Promise( ( resolve, reject ) => {
			// For example purpose, just parse zip file, and log each entry.
			response.body.pipe( unzip.Parse() )
				.on( 'entry', ( entry ) => console.log( entry.path ) )
				.on( 'close', resolve )
				.on( 'error', reject );
		} );
	} )
	.then( () => console.log( 'done' ) )
	.catch( console.log );
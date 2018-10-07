export default async ( ctx ) => {
	ctx.body = 'hello world234'
	await ctx.render( 'main' )
}

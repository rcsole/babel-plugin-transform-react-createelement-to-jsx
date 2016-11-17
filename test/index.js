import chai, {expect} from 'chai'
import convertTo from './chai-convert-to'

chai.use(convertTo(
	{ plugins: [require.resolve('../'), 'syntax-object-rest-spread'] },
	{ plugins: ['syntax-jsx', 'syntax-object-rest-spread'] }))

describe('h-to-JSX', () => {
	it('should convert 1-argument calls', () => {
		expect('Preact.h("h1")'       ).to.convertTo('<h1 />;')
		expect('Preact.h(Foo)'        ).to.convertTo('<Foo />;')
		expect('Preact.h(Foo.Bar)'    ).to.convertTo('<Foo.Bar />;')
		expect('Preact.h(Foo.Bar.Baz)').to.convertTo('<Foo.Bar.Baz />;')
	})
	
	it('should convert effective 1-argument calls (with null or undefined)', () => {
		expect('Preact.h("h1", null)'      ).to.convertTo('<h1 />;')
		expect('Preact.h("h2", null, null)').to.convertTo('<h2 />;')
		expect('Preact.h("h3", undefined)' ).to.convertTo('<h3 />;')
	})
	
	it('should handle props without children', () => {
		expect('Preact.h("h1", {hi: there})'  ).to.convertTo('<h1 hi={there} />;')
		expect('Preact.h("h2", {"hi": there})').to.convertTo('<h2 hi={there} />;')
		expect('Preact.h("h3", {hi: "there"})').to.convertTo('<h3 hi="there" />;')
	})
	
	it('should handle spread props', () => {
		expect('Preact.h("h1", props)'     ).to.convertTo('<h1 {...props} />;')
		expect('Preact.h("h1", getProps())').to.convertTo('<h1 {...getProps()} />;')
	})
	
	it('should handle mixed props', () => {
		expect('Preact.h("h1", _extends({ hi: "there" }, props))'    ).to.convertTo('<h1 hi="there" {...props} />;')
		expect('Preact.h("h1", _extends({}, props, { hi: "there" }))').to.convertTo('<h1 {...props} hi="there" />;')
		expect('Preact.h("h1", { ...props, hi: "there" })'           ).to.convertTo('<h1 {...props} hi="there" />;')
	})
	
	it('should handle props and ignore “null”/“undefined” children', () => {
		expect('Preact.h("h1", {hi: there}, null, undefined)').to.convertTo('<h1 hi={there} />;')
	})
	
	it('should ignore “null”/“undefined” props and handle children', () => {
		expect('Preact.h("h1", null, "Header")'                          ).to.convertTo('<h1>Header</h1>;')
		//this can be created from e.g. '<h2>Header{"harhar"}</h2>', but i think there’s no downside to merging it
		expect('Preact.h("h2", null, "Header", "harhar")'                ).to.convertTo('<h2>Headerharhar</h2>;')
		expect('Preact.h("h3", null, Preact.h("i"))'          ).to.convertTo('<h3><i /></h3>;')
		expect('Preact.h("h4", null, "a", Preact.h("b"), "c")').to.convertTo('<h4>a<b />c</h4>;')
	})
	
	it('should handle props and children', () => {
		//we extensively tested props and children separately, so only sth. basic
		expect('Preact.h("h1", {hi: there}, "Header")').to.convertTo('<h1 hi={there}>Header</h1>;')
	})
	
	it('should ignore intermingled “null”/“undefined” children', () => {
		expect('Preact.h("h1", null, null, "Header", undefined)').to.convertTo('<h1>Header</h1>;')
	})
	
	it('should handle children in nested expressions', () => {
		expect('Preact.h("h1", null, foo ? Preact.h("p") : null)').to.convertTo('<h1>{foo ? <p /> : null}</h1>;')
	})
})

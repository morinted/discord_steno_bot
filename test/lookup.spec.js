import expect from "expect";
import { lookup } from '../lookup.js'

describe('lookup', function() {
  it('should return results in Markdown table', async () => {
    const results = await lookup('test')
    expect(results).toContain('T-EFT')
    // This was a paper-tape entry…
    expect(results).toContain('TETS')
  })
  it('should handle no results', async () => {
    expect((await lookup('this is garbage'))).toContain('No result')
  })
})
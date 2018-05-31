import { YAMLSemanticError } from '../src/errors'
import YAML from '../src/index'

test('eemeli/yaml#2', () => {
  const src = `
aliases:
  - docker:
      - image: circleci/node:8.11.2
  - key: repository-{{ .Revision }}\n`
  expect(YAML.parse(src)).toMatchObject({
    aliases: [
      { docker: [{ image: 'circleci/node:8.11.2' }] },
      { key: 'repository-{{ .Revision }}' }
    ]
  })
})

test('eemeli/yaml#3', () => {
  const src = '{ ? : 123 }'
  const doc = YAML.parseDocuments(src)[0]
  expect(doc.errors).toHaveLength(0)
  expect(doc.contents.items[0].key).toBeNull()
  expect(doc.contents.items[0].value.value).toBe(123)
})

test('eemeli/yaml#6', () => {
  const src = 'abc: 123\ndef'
  const doc = YAML.parseDocuments(src)[0]
  expect(doc.errors).toHaveLength(1)
  expect(doc.errors[0]).toBeInstanceOf(YAMLSemanticError)
})

describe('eemeli/yaml#7', () => {
  test('map', () => {
    const src = '{ , }\n---\n{ 123,,, }\n'
    const docs = YAML.parseDocuments(src)
    expect(docs[0].errors).toHaveLength(1)
    expect(docs[1].errors).toHaveLength(2)
  })
  test('seq', () => {
    const src = '[ , ]\n---\n[ 123,,, ]\n'
    const docs = YAML.parseDocuments(src)
    expect(docs[0].errors).toHaveLength(1)
    expect(docs[1].errors).toHaveLength(2)
  })
})

test('eemeli/yaml#8', () => {
  const src = '{'
  const doc = YAML.parseDocuments(src)[0]
  expect(doc.errors).toHaveLength(1)
  expect(doc.errors[0]).toBeInstanceOf(YAMLSemanticError)
})

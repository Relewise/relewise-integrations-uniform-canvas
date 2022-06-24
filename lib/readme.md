## Relewise data enhancers for Uniform Canvas.

Used on the [https://uniform.app](Uniform Platform).

## Usage examples

```javascript
const enhancer = createRelewiseEnhancer({
  apiKey: process.env.RELEWISE_API_KEY!,
  datasetId: process.env.RELEWISE_DATASET_ID!,
  dataKeys: { products: ['Images', 'SubTitle'], contents: ['url'] },
  language: 'da-DK'
});
  
await enhance({
  composition: composition,
  enhancers: new EnhancerBuilder().parameterType(RELEWISE_CANVAS_PARAMETER_TYPES, enhancer),
  context: {},
});
```
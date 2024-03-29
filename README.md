# Relewise Uniform Canvas [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE) [![npm version](https://badge.fury.io/js/@relewise%2Funiform-canvas.svg)](https://badge.fury.io/js/@relewise%2uniform-canvas) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Relewise/relewise-integrations-uniform-canvas/pulls)

## Installation 

Install via NPM or you preferred package manager: 

```
npm install @relewise/uniform-canvas
```

## Usage examples

```ts
function getUser() {
  return userHasAcceptedCookies 
    ? UserFactory.byAuthenticatedId(<CookieProvider.UniqueId>) 
    : UserFactory.anonymous();
}

const recommender = new Recommender(`RELEWISE_DATASET_ID`, `RELEWISE_API_KEY`)
const enhancer = createRelewiseEnhancer({
  recommender,
  dataKeys: { products: ['ImageUrl', 'ShortDescription'], contents: ['url'] },
  language: 'en-US',
  currency: 'USD',
  userFactory: getUser
});
  
await enhance({
  composition: composition,
  enhancers: new EnhancerBuilder().parameterType(RELEWISE_CANVAS_PARAMETER_TYPES, enhancer),
  context: {},
});
```

## Contributing

Pull requests are always welcome.  
Please fork this repository and make a PR when you are ready with your contribution.  

Otherwise you are welcome to open an Issue in our [issue tracker](https://github.com/Relewise/relewise-integrations-uniform-canvas/issues).

## License

Relewise Uniform Canvas is licensed under the [MIT license](./LICENSE)

D:\ui-framework
├─ apps
│ ├─ server
│ │ ├─ package.json
│ │ ├─ tsconfig.json
│ │ ├─ nest-cli.json
│ │ ├─ .env.example
│ │ ├─ src
│ │ │ ├─ Controllers
│ │ │ │ ├─ ComponentDefinitionController.ts
│ │ │ │ ├─ ComponentController.ts
│ │ │ │ ├─ ComponentVariantController.ts
│ │ │ │ ├─ PageController.ts
│ │ │ │ ├─ PageTreeController.ts
│ │ │ │ └─ HealthController.ts
│ │ │ ├─ Services
│ │ │ │ ├─ ComponentDefinitionService.ts
│ │ │ │ ├─ ComponentService.ts
│ │ │ │ ├─ ComponentVariantService.ts
│ │ │ │ ├─ PageService.ts
│ │ │ │ ├─ PageTreeService.ts
│ │ │ │ ├─ MappingService.ts
│ │ │ │ └─ MongoService.ts
│ │ │ ├─ Entities
│ │ │ │ ├─ ComponentManifest.entity.ts
│ │ │ │ ├─ ComponentVariant.entity.ts
│ │ │ │ ├─ ComponentProp.entity.ts
│ │ │ │ ├─ ComponentStyleProp.entity.ts
│ │ │ │ ├─ ComponentBehaviorProp.entity.ts
│ │ │ │ ├─ ComponentStyle.entity.ts
│ │ │ │ ├─ ComponentStyleValue.entity.ts
│ │ │ │ ├─ ComponentBehavior.entity.ts
│ │ │ │ ├─ Page.entity.ts
│ │ │ │ └─ PageTree.entity.ts
│ │ │ ├─ Models
│ │ │ │ ├─ ComponentManifest.model.ts
│ │ │ │ ├─ ComponentVariant.model.ts
│ │ │ │ ├─ ComponentProp.model.ts
│ │ │ │ ├─ ComponentStyleProp.model.ts
│ │ │ │ ├─ ComponentBehaviorProp.model.ts
│ │ │ │ ├─ ComponentStyle.model.ts
│ │ │ │ ├─ ComponentStyleValue.model.ts
│ │ │ │ ├─ ComponentBehavior.model.ts
│ │ │ │ ├─ Page.model.ts
│ │ │ │ ├─ PageTree.model.ts
│ │ │ │ └─ index.ts
│ │ │ ├─ app.module.ts
│ │ │ └─ main.ts
│ │ └─ test
│ │ └─ app.e2e-spec.ts
│ ├─ editor
│ │ ├─ package.json
│ │ ├─ tsconfig.json
│ │ ├─ vite.config.ts
│ │ ├─ index.html
│ │ ├─ src
│ │ │ ├─ main.tsx
│ │ │ ├─ App.tsx
│ │ │ ├─ pages
│ │ │ │ └─ EditorPage.tsx
│ │ │ └─ features
│ │ │ └─ component-canvas.tsx
│ │ └─ public
│ │ └─ favicon.ico
│ └─ reference-component
│ ├─ package.json
│ ├─ tsconfig.json
│ ├─ vite.config.ts
│ ├─ index.html
│ ├─ src
│ │ ├─ main.tsx
│ │ ├─ App.tsx
│ │ ├─ components
│ │ │ └─ Button.tsx
│ │ └─ examples
│ │ └─ component-definition.example.ts
│ └─ public
│ └─ favicon.ico
├─ packages
│ ├─ contract
│ │ ├─ package.json
│ │ ├─ tsconfig.json
│ │ ├─ src
│ │ │ ├─ definitions
│ │ │ │ ├─ ComponentDefinition.ts
│ │ │ │ ├─ ComponentPropDefinition.ts
│ │ │ │ ├─ ComponentStylePropDefinition.ts
│ │ │ │ ├─ ComponentBehaviorPropDefinition.ts
│ │ │ │ ├─ ComponentStyleDefinition.ts
│ │ │ │ └─ ComponentBehaviorDefinition.ts
│ │ │ ├─ models
│ │ │ │ ├─ ComponentManifest.ts
│ │ │ │ ├─ ComponentVariant.ts
│ │ │ │ ├─ ComponentProp.ts
│ │ │ │ ├─ ComponentStyleProp.ts
│ │ │ │ ├─ ComponentBehaviorProp.ts
│ │ │ │ ├─ ComponentStyle.ts
│ │ │ │ ├─ ComponentStyleValue.ts
│ │ │ │ ├─ ComponentBehavior.ts
│ │ │ │ ├─ Page.ts
│ │ │ │ ├─ PageTree.ts
│ │ │ │ └─ index.ts
│ │ │ ├─ enums
│ │ │ │ ├─ ComponentPropKind.ts
│ │ │ │ ├─ ComponentStyleValueKind.ts
│ │ │ │ ├─ StyleValueType.ts
│ │ │ │ └─ StyleValueUnit.ts
│ │ │ └─ index.ts
│ │ └─ openapi
│ │ ├─ openapi.yaml
│ │ └─ schemas
│ │ ├─ ComponentDefinition.yaml
│ │ ├─ ComponentPropDefinition.yaml
│ │ ├─ ComponentStylePropDefinition.yaml
│ │ ├─ ComponentBehaviorPropDefinition.yaml
│ │ ├─ ComponentStyleDefinition.yaml
│ │ ├─ ComponentBehaviorDefinition.yaml
│ │ ├─ ComponentManifest.yaml
│ │ ├─ ComponentVariant.yaml
│ │ ├─ ComponentProp.yaml
│ │ ├─ ComponentStyleProp.yaml
│ │ ├─ ComponentBehaviorProp.yaml
│ │ ├─ ComponentStyle.yaml
│ │ ├─ ComponentStyleValue.yaml
│ │ ├─ ComponentBehavior.yaml
│ │ ├─ Page.yaml
│ │ ├─ PageTree.yaml
│ │ ├─ ComponentPropKind.yaml
│ │ ├─ ComponentStyleValueKind.yaml
│ │ ├─ StyleValueType.yaml
│ │ └─ StyleValueUnit.yaml
│ ├─ sdk
│ │ ├─ package.json
│ │ ├─ tsconfig.json
│ │ ├─ src
│ │ │ ├─ manifest
│ │ │ │ └─ defineComponent.ts
│ │ │ ├─ render
│ │ │ │ ├─ index.ts
│ │ │ │ └─ types.ts
│ │ │ └─ index.ts
│ │ └─ tests
│ │ └─ render.test.ts
│ ├─ contract-ts
│ │ ├─ package.json
│ │ └─ src
│ │ ├─ schema.ts
│ │ ├─ contract.ts
│ │ └─ index.ts
│ └─ mongo-validators
│ ├─ package.json
│ ├─ src
│ │ ├─ component-manifest.validator.json
│ │ ├─ component-variant.validator.json
│ │ ├─ page.validator.json
│ │ └─ page-tree.validator.json
│ └─ index.ts
├─ tools
│ ├─ codegen
│ │ ├─ generate-contract-ts.ts
│ │ ├─ generate-openapi.ts
│ │ └─ generate-mongo-validators.ts
│ └─ scripts
│ ├─ build-all.ps1
│ └─ publish-sdk.ps1
├─ docs
│ ├─ architecture
│ │ └─ boundaries.md
│ └─ api-guidelines
│ └─ naming.md
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.base.json
├─ .gitignore
└─ README.md

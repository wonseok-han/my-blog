# EsLint Rules Settings

## Recommends

- `plugin:astro/base`: Astro 프로젝트의 기본적인 문법 검사를 위한 규칙을 제공합니다. 가장 기본적인 코드 품질과 문제를 감지하기 위한 설정입니다.
- `plugin:astro/recommended`: Astro 프로젝트에 대해 권장되는 확장된 린트 규칙을 제공합니다. 이 설정은 base에 비해 더 많은 규칙을 포함하여 일반적인 문제들을 방지하도록 도와줍니다.
- `plugin:astro/jsx-a11y-strict`: Astro 컴포넌트에서 접근성 관련 규칙을 엄격하게 적용합니다. 웹 접근성(WAI-ARIA) 가이드라인을 준수하기 위한 설정입니다.
- `plugin:@typescript-eslint/recommended`: TypeScript 코드에 대해 권장되는 규칙들을 제공합니다. 이는 타입 안정성과 관련된 일반적인 문제들을 감지하기 위한 설정입니다.
- `plugin:prettier/recommended`: Prettier와 ESLint를 함께 사용하기 위한 권장 설정입니다. 코드 스타일 문제를 감지하고 일관된 코드 포맷을 유지하도록 도와줍니다.

```json
"extends": [
  "plugin:astro/base",
  "plugin:astro/recommended",
  "plugin:astro/jsx-a11y-strict",
  "plugin:@typescript-eslint/recommended",
  "plugin:prettier/recommended",
],
```

## Astro Rules

- `astro/no-conflict-set-directives`: Astro 컴포넌트 내에서 충돌할 수 있는 set: 지시어 사용을 방지합니다. 동일한 이름으로 여러 번 선언되는 문제를 예방합니다.
- `astro/no-unused-define-vars-in-style`: `<style>` 태그 내에서 정의되었지만 사용되지 않는 변수를 방지합니다. 코드의 깔끔함과 효율성을 유지합니다.

## Typescript Rules

- `import/no-named-as-default`: 디폴트로 내보낸 것이 아닌, 이름을 가진 내보내기를 디폴트로 가져오려 할 때 오류를 표시합니다.
- `no-unused-vars`: 선언되었지만 사용되지 않는 변수가 있을 경우 오류를 표시합니다. 불필요한 코드를 줄이는 데 도움이 됩니다.
- `prettier/prettier`: Prettier 규칙에 따라 코드 포맷이 맞지 않을 경우 오류를 표시합니다. 일관된 코드 스타일을 유지합니다.
- `@typescript-eslint/consistent-type-definitions`: interface와 type 사용을 일관되게 유지합니다.
- `@typescript-eslint/consistent-type-imports`: 타입 임포트를 위해 import type {} 구문의 사용을 권장합니다.
- `@typescript-eslint/naming-convention`: 변수, 함수, 타입 등의 네이밍에 일관된 규칙을 적용합니다.
- `@typescript-eslint/no-explicit-any`: any 타입의 사용을 금지하여 타입 안정성을 높입니다.
- `@typescript-eslint/no-floating-promises`: 처리되지 않은 프로미스를 방지합니다.
- `@typescript-eslint/no-misused-promises`: 프로미스가 잘못 사용되는 것을 방지합니다.
- `@typescript-eslint/no-non-null-asserted-nullish-coalescing`: 널 병합 연산자(??) 사용 시, non-null assertion(!)의 사용을 방지합니다.
- `@typescript-eslint/no-unsafe-argument`: 타입 검사 없이 함수에 전달되는 인자를 방지합니다.
- `@typescript-eslint/no-unsafe-assignment`: 타입 검사 없이 값이 할당되는 것을 방지합니다.
- `@typescript-eslint/no-unsafe-member-access`: 타입 검사 없이 객체의 속성에 접근하는 것을 방지합니다.
- `@typescript-eslint/no-unsafe-return`: 함수에서 타입 검사 없이 값을 반환하는 것을 방지합니다.
- `@typescript-eslint/no-unused-vars`: 사용되지 않는 변수를 방지합니다.
- `@typescript-eslint/no-useless-empty-export`: 내용이 없는 불필요한 export 문을 방지합니다.
- `@typescript-eslint/prefer-optional-chain`: 옵셔널 체이닝(?.) 사용을 권장합니다.
- `@typescript-eslint/triple-slash-reference`: 삼중 슬래시 참조 대신 import 사용을 권장합니다.
- `@typescript-eslint/type-annotation-spacing`: 타입 주석에 대한 공백 규칙을 설정합니다.

## Reference

- <https://github.com/ota-meshi/eslint-plugin-astro>
- <https://github.com/jsx-eslint/eslint-plugin-react>
- <https://eslint.org/docs/latest/rules/>
- <https://github.com/prettier/eslint-config-prettier>
- <https://github.com/prettier/eslint-plugin-prettier>

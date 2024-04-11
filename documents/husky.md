# husky

* husky는 Git hook을 쉽게 관리할 수 있게 도와주는 도구로 코드 커밋 또는 푸쉬 전에 특정 작업(예: lint, test)을 자동으로 실행할 수 있습니다.

## 설정

* `package.json` 파일에 다음과 같이 설정합니다.

```json
// package.json

...
"scripts": {
  "prepare": "husky install", // npm install을 실행할 때 husky를 설치하고, Git hook을 설정합니다.
  ...
},
...

// `./src` 디렉토리 아래의 astro, typescript 파일에 대해 ESLint와 Prettier 코드 스타일을 자동 적용하도록 합니다.
"lint-staged": {
   "**/*.{astro,ts}": [
   "eslint"
   ]
},
```

* `pre-commit`: 커밋을 실행하기 전에 자동으로 실행되는 스크립트입니다. 이를 통해 **타입스크립트 검사**, package.json에 설정된 **lint-staged**를 실행해 문제가 있는 경우 커밋을 중단합니다.

```bash
#!/usr/bin/env sh
echo 'husky: pre-commit hook started'

npx tsc --noEmit --skipLibCheck

npx lint-staged
```

## Reference

* <https://typicode.github.io/husky/>

# SSM Parameter Store Env Loader

AWS SSM Parameter Store에서 파라미터를 가져와 GitHub Actions 워크플로우의 환경 변수로 설정하거나 `.env` 파일로 저장하는 GitHub Action입니다.

## 주요 기능

- **재귀적 검색**: 지정된 경로(`aws-base-path`) 하위의 모든 파라미터를 재귀적으로 가져옵니다.
- **자동 복호화**: SecureString 타입의 파라미터를 자동으로 복호화합니다.
- **보안 처리**: 가져온 모든 값은 GitHub Actions 로그에서 자동으로 마스킹(Secret) 처리됩니다.
- **키 변환**: 파라미터 경로의 마지막 부분만 추출하여 환경 변수 키로 사용합니다. (예: `/prod/service/DB_HOST` -> `DB_HOST`)
- **유연한 출력**: 환경 변수로 즉시 로드하거나, 파일(예: `.env`)로 저장할 수 있습니다.

## 사용 방법 (Usage)

`.github/workflows` 디렉토리의 워크플로우 파일(YAML)에서 다음과 같이 사용합니다.

```yaml
steps:
  - name: Configure AWS Credentials
    uses: aws-actions/configure-aws-credentials@v4
    with:
      aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
      aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      aws-region: ap-northeast-2

  - name: Load Secrets from SSM
    uses: ./ # 또는 게시된 액션 이름 사용 (예: luviny/aws-ssm-parameter-store-env-loader@v1)
    with:
      aws-base-path: /my-service/prod/
      # 선택 사항: 기본값 ap-northeast-2
      aws-region: ap-northeast-2
      # 선택 사항: 환경 변수로 로드 여부 (기본값 true)
      load-env: true
      # 선택 사항: .env 파일로 저장하려면 파일명 지정
      env-file-name: .env

  - name: Check Env
    run: |
      echo "DB_HOST is set to $DB_HOST" # 값은 마스킹되어 ***로 표시됨
```

## 입력 변수 (Inputs)

| 입력값 (Input) | 필수 여부 | 기본값 | 설명 |
| :--- | :---: | :---: | :--- |
| `aws-base-path` | **Yes** | - | SSM Parameter Store에서 검색할 기본 경로입니다. 재귀적으로 검색됩니다. |
| `aws-region` | No | `ap-northeast-2` | AWS 리전입니다. |
| `load-env` | No | `true` | 가져온 파라미터를 현재 워크플로우의 환경 변수로 등록할지 여부입니다. |
| `env-file-name` | No | - | 파라미터를 저장할 파일 이름입니다. (예: `.env`). 지정하지 않으면 파일을 생성하지 않습니다. |

## 동작 예시

SSM Parameter Store에 다음과 같은 값이 저장되어 있다고 가정합니다:

- `/my-service/prod/DATABASE_URL`: `postgres://...`
- `/my-service/prod/API_KEY`: `secret-key`

`aws-base-path: /my-service/prod/`로 실행 시:

1. **환경 변수 로드 (`load-env: true`)**:
   - `DATABASE_URL`과 `API_KEY`가 환경 변수로 등록되어 이후 단계에서 `$DATABASE_URL`, `$API_KEY` 또는 `${{ env.DATABASE_URL }}`로 접근 가능합니다.

2. **파일 생성 (`env-file-name: .env`)**:
   - `.env` 파일이 생성되며 내용은 다음과 같습니다.
     ```env
     DATABASE_URL="postgres://..."
     API_KEY="secret-key"
     ```

## 개발 및 빌드

이 프로젝트는 TypeScript로 작성되었습니다.

### 의존성 설치
```bash
pnpm install
```

### 빌드
GitHub Actions에서 실행하기 위해 `ncc`를 사용하여 단일 파일로 빌드합니다.
```bash
pnpm build
```

### 로컬 실행
```bash
pnpm dev
```

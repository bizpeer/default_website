# 프로젝트 설정 가이드 (Project Setup Guide)

## 1. Node.js 버전 설정 (GitHub Actions 에러 방지)
GitHub Actions에서 Node.js 20 deprecation 경고가 발생하므로, 최신 버전인 **Node.js v24**를 명시적으로 사용하도록 설정되었습니다. `.github/workflows/deploy.yml` 파일 내에 다음과 같이 버전을 지정하여 빌드 및 배포 에러를 방지했습니다:

```yaml
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '24'
```

## 2. 패키지 의존성 (package-lock.json)
GitHub Actions 배포 시 `Dependencies lock file is not found` 에러를 방지하기 위해 로컬에서 `npm install`을 실행하여 `package-lock.json` 파일을 생성하고 함께 커밋해야 합니다.

## 3. Cloudflare Pages 배포 설정 (GitHub Secrets)
Cloudflare Pages 자동 배포를 위해 GitHub Repository의 **Settings > Secrets and variables > Actions** 에서 다음 2가지 Secret 값을 반드시 설정해야 합니다:

*   **`CLOUDFLARE_API_TOKEN`**: Cloudflare 대시보드에서 생성한 API 토큰 (권한: Cloudflare Pages Edit 설정 필요)
*   **`CLOUDFLARE_ACCOUNT_ID`**: Cloudflare 대시보드 우측 하단에서 확인할 수 있는 Account ID (계정 ID)

이 두 가지 값이 설정되어 있어야 `Input required and not supplied: apiToken` 에러 없이 정상적으로 배포가 완료됩니다.
